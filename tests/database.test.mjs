import assert from 'node:assert/strict'
import {test,beforeEach} from 'node:test'
import {DatabaseSync} from 'node:sqlite'
import fs from 'node:fs'
import {Database} from './database.bundle.mjs'
let sql,a,b,admin
beforeEach(()=>{const db=new DatabaseSync(':memory:');db.exec(fs.readFileSync('scripts/native/schema.sql','utf8'));db.exec(fs.readFileSync('scripts/native/bootstrap.sql','utf8'));sql={async sql(q,args=[]){return{rows:db.prepare(q).all(...args)}},async batch(items){db.exec('BEGIN');try{const results=items.map(x=>({rows:db.prepare(x.sql).all(...x.args||[])}));db.exec('COMMIT');return{results}}catch(e){db.exec('ROLLBACK');throw e}}};
 db.exec("INSERT INTO company(id,nome,created_by) VALUES('a','A','u1'),('b','B','u2'); INSERT INTO crm_cards(id,company_id,numero,nome) VALUES('lead-a','a','111','Alpha'),('lead-b','b','222','Beta'); INSERT INTO company_user(id,user_id,company_id,role) VALUES('ma','u1','a','owner'),('mb','u2','b','owner');");a=new Database(sql,{userId:'u1',companyId:'a',role:'owner',master:false});b=new Database(sql,{userId:'u2',companyId:'b',role:'owner',master:false});admin=new Database(sql,{userId:'root',master:true},true,true)})
test('scoped reads only own company',async()=>assert.deepEqual((await a.from('crm_cards').select('id')).data,[{id:'lead-a'}]))
test('update by foreign ID cannot change other company',async()=>{await a.from('crm_cards').update({nome:'Hacked'}).eq('id','lead-b');assert.equal((await b.from('crm_cards').select('nome').single()).data.nome,'Beta')})
test('delete by foreign ID cannot delete another company',async()=>{await a.from('crm_cards').delete().eq('id','lead-b');assert.equal((await b.from('crm_cards').select('id')).data.length,1)})
test('upsert cannot change company',async()=>assert.ok((await a.from('crm_cards').upsert({id:'lead-b',company_id:'b',numero:'222'},{onConflict:'company_id,numero'})).error))
test('unsafe upsert by ID rejected',async()=>assert.ok((await a.from('crm_cards').upsert({id:'lead-b',nome:'Hacked'})).error))
test('cannot assign foreign stage',async()=>assert.ok((await a.from('crm_cards').update({stage_id:'b:stage:0'}).eq('id','lead-a')).error))
test('ordinary owner cannot self-promote',async()=>assert.ok((await a.from('user_roles').insert({user_id:'u1',role:'super_admin'})).error))
test('ordinary owner cannot change billing state',async()=>assert.ok((await a.from('company').update({status_cobranca:'ativo'}).eq('id','a')).error))
test('unknown table and column rejected',async()=>{assert.ok((await a.from('users').select('*')).error);assert.ok((await a.from('crm_cards').eq('id;DROP TABLE company','a')).error)})
test('CRM create then reread persists',async()=>{const r=await a.from('crm_cards').insert({numero:'333',nome:'Persistido'}).select('*').single();assert.equal(r.error,null);assert.equal((await a.from('crm_cards').select('nome').eq('id',r.data.id).single()).data.nome,'Persistido')})
test('relationship includes company for onboarding',async()=>{const r=await a.from('company_user').select('company_id,company:company(nome)').eq('user_id','u1').single();assert.equal(r.error,null);assert.equal(r.data.company.nome,'A')})
test('bootstrap schema has four stages per company',async()=>assert.equal((await a.from('crm_stage').select('id')).data.length,4))
test('single detects missing record',async()=>assert.ok((await a.from('crm_cards').eq('id','missing').single()).error))
test('no-auth cannot read private tables',async()=>assert.ok((await new Database(sql,{userId:'',master:false}).from('crm_cards').select('*')).error))
test('admin can create a company with initialized stages',async()=>{const r=await admin.from('company').insert({nome:'Nova',created_by:'root'}).select('id').single();assert.equal(r.error,null);assert.equal((await sql.sql('SELECT * FROM crm_stage WHERE company_id=?',[r.data.id])).rows.length,4)})
