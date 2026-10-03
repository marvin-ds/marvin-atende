import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { makeContext } from './native/context'
import { Database } from './native/database'
import { loadDomain,rpcAllowlist,publicRoutes } from './native/domain'
const app=new Hono()
app.use('*',cors({origin:'*'}))
app.onError((e,c)=>{console.error('request failed',e.message);return c.json({error:e.message||'Falha ao processar'},400)})
app.get('/health',async c=>{const ctx=await makeContext(c.req.raw,c.env as any);await ctx.blink.db.sql('SELECT id FROM plan LIMIT 1');return c.json({ok:true,database:'connected',version:'native-v1'})})
app.get('/api/bootstrap',async c=>{const ctx=await makeContext(c.req.raw,c.env as any);if(!ctx.identity.userId)return c.json({configured:!!(c.env as any).OWNER_USER_ID&&(c.env as any).OWNER_PROJECT_ID===(c.env as any).BLINK_PROJECT_ID},401);return c.json({configured:!!(c.env as any).OWNER_USER_ID&&(c.env as any).OWNER_PROJECT_ID===(c.env as any).BLINK_PROJECT_ID,isSuperAdmin:ctx.identity.master})})
app.post('/api/query',async c=>{const ctx=await makeContext(c.req.raw,c.env as any);const spec=await c.req.json();const db=new Database(ctx.blink.db,ctx.identity);return c.json(await db.execute(spec))})
app.post('/api/rpc',async c=>{
 const ctx=await makeContext(c.req.raw,c.env as any),body=await c.req.json()
 if(!rpcAllowlist[body.module]?.includes(body.name))return c.json({error:'Operação inexistente'},404)
 const publicOps=['getCsatByToken','submitCsat']
 if(!ctx.identity.userId&&!publicOps.includes(body.name))return c.json({error:'Autenticação necessária'},401)
 const load=loadDomain(ctx),result=await load(body.module)[body.name]({data:body.data})
 return c.json(result??null)
})
app.post('/api/database-operation',async c=>{const ctx=await makeContext(c.req.raw,c.env as any);if(!ctx.identity.userId)return c.json({error:'Autenticação necessária'},401);const body=await c.req.json();return c.json(await ctx.scoped.rpc(body.name,body.args))})
for(const [route,module]of Object.entries(publicRoutes))app.all(route.replace('/$','/*'),async c=>{
 const ctx=await makeContext(c.req.raw,c.env as any,true),config=loadDomain(ctx)(module).Route
 const handler=config.server?.handlers?.[c.req.method]
 if(!handler)return c.json({error:'Método não permitido'},405)
 return handler({request:c.req.raw,params:{_splat:c.req.path.split('/v1/')[1]||''}})
})
export default app
