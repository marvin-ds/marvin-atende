import { adaptBlinkSql } from './sql-adapter'
import { ownerEligible } from './owner'
import { createClient } from '@blinkdotnew/sdk'
import { Database,type Identity } from './database'
export async function makeContext(request:Request,env:Record<string,string>,publicWebhook=false){
 const blink=createClient({projectId:env.BLINK_PROJECT_ID,secretKey:env.BLINK_SECRET_KEY,auth:{mode:'headless'}})
 const sql=adaptBlinkSql(blink.db)
 const header=publicWebhook?null:request.headers.get('authorization')
 const auth=header?await blink.auth.verifyToken(header):{valid:false}
 if(header&&(!auth.valid||!('userId'in auth)||!auth.userId||auth.projectId!==env.BLINK_PROJECT_ID))throw new Error('Sessão inválida')
 const userId=auth.valid&&'userId'in auth?auth.userId||'':''
 const email=auth.valid&&'email'in auth?auth.email||'':''
 if(userId){
   await sql.sql('INSERT INTO profiles(user_id,email) VALUES(?,?) ON CONFLICT(user_id) DO UPDATE SET email=excluded.email',[userId,email])
   if(await ownerEligible({userId,email},env,sql)){
     await sql.batch([
      {sql:'INSERT INTO template_owner(id,user_id) VALUES(?,?) ON CONFLICT(id) DO NOTHING',args:['owner',userId]},
      {sql:"INSERT INTO user_roles(id,user_id,role) SELECT ?,?,? WHERE EXISTS(SELECT 1 FROM template_owner WHERE id='owner' AND user_id=?) ON CONFLICT(user_id,role) DO NOTHING",args:['owner:'+userId,userId,'super_admin',userId]},
     ],'write')
   }
 }
 const member=userId?(await sql.sql('SELECT company_id,role FROM company_user WHERE user_id=? AND ativo=1 ORDER BY created_at LIMIT 1',[userId])).rows[0]:null
 const master=userId?!!(await sql.sql("SELECT 1 FROM user_roles WHERE user_id=? AND role='super_admin' LIMIT 1",[userId])).rows.length:false
 const identity:Identity={userId,email,master,companyId:member?.company_id,role:member?.role}
 const admin=new Database(sql,identity,true,true),scoped=new Database(sql,identity,false,true)
 admin.auth={admin:{
  async createUser(input:any){try{
   if(!identity.master&&!['owner','admin'].includes(identity.role||''))throw new Error('Acesso negado')
   const client=createClient({projectId:env.BLINK_PROJECT_ID,auth:{mode:'headless'},authRequired:false})
   const user=await client.auth.signUp({email:input.email,password:input.password})
   return{data:{user},error:null}
  }catch(error:any){return{data:{user:null},error:{message:error.message}}}},
  async updateUserById(){return{error:{message:'Na Blink, a senha deve ser alterada pelo titular em Esqueci minha senha.'}}},
  async getUserById(id:string){const row=(await sql.sql('SELECT user_id,email FROM profiles WHERE user_id=?',[id])).rows[0];return{data:{user:row?{id:row.user_id,email:row.email}:null},error:null}},
 }}
 for(const db of [admin,scoped])db.rpc=async(name:string,args:any={})=>{try{
  const cid=args._company_id
  if(name==='is_super_admin')return{data:identity.master,error:null}
  if(name==='grant_credits'){
   if(!identity.master)throw new Error('Acesso restrito ao administrador')
   const amount=Number(args._qtd);if(!Number.isInteger(amount)||Math.abs(amount)>10000000)throw new Error('Quantidade inválida')
   const id=crypto.randomUUID()
   await sql.batch([{sql:'UPDATE company SET creditos_saldo=MAX(0,COALESCE(creditos_saldo,0)+?) WHERE id=?',args:[amount,cid]},{sql:'INSERT INTO credit_ledger(id,company_id,delta,saldo_apos,motivo,created_by) SELECT ?,id,?,creditos_saldo,?,? FROM company WHERE id=?',args:[id,amount,args._motivo||'bonus_admin',userId,cid]}],'write')
   return{data:(await sql.sql('SELECT creditos_saldo FROM company WHERE id=?',[cid])).rows[0]?.creditos_saldo,error:null}
  }
  if(name==='fin_enable_for_company'){
   if(!identity.master&&(cid!==identity.companyId||!['owner','admin'].includes(identity.role||'')))throw new Error('Acesso negado')
   await sql.sql('UPDATE company SET financeiro_ativo=? WHERE id=?',[Number(!!args._enable),cid]);return{data:true,error:null}
  }
  if(db.internal&&name==='claim_campaign_targets'){
   const limit=Math.max(1,Math.min(50,Number(args._limit)||5));if(!args._token||!args._campaign_id)throw new Error('Reserva inválida')
   const rows=(await sql.sql("UPDATE campaign_target SET processing_token=?,processing_started_at=? WHERE id IN (SELECT id FROM campaign_target WHERE campaign_id=? AND status='pendente' AND processing_token IS NULL ORDER BY created_at,id LIMIT ?) RETURNING *",[args._token,new Date().toISOString(),args._campaign_id,limit])).rows
   return{data:rows,error:null}
  }
  if(db.internal&&name==='consume_ai_credit'){const rows=(await sql.sql('UPDATE company SET creditos_saldo=creditos_saldo-1 WHERE id=? AND creditos_saldo>0 RETURNING creditos_saldo',[cid])).rows;return{data:rows.length>0,error:null}}
  if(db.internal&&name==='refund_ai_credit'){await sql.sql('UPDATE company SET creditos_saldo=creditos_saldo+1 WHERE id=?',[cid]);return{data:true,error:null}}
  if(db.internal&&name==='topup_plan_credits'){await sql.sql('UPDATE company SET creditos_saldo=COALESCE((SELECT creditos_mensais FROM plan WHERE slug=?),0),creditos_origem=? WHERE id=?',[args._plan_slug,'plano',cid]);return{data:true,error:null}}
  throw new Error('Operação não disponível: '+name)
 }catch(error:any){return{data:null,error:{message:error.message}}}}
 return{blink,sql,identity,admin,scoped,request,env}
}
