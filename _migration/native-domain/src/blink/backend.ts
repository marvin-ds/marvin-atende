import { blink } from './client'
export const backendUrl=String(import.meta.env.VITE_BLINK_BACKEND_URL||'https://ly6fytdy.backend.blink.new').replace(/\/$/,'')
export async function callBackend(path:string,body?:any){
 await blink.auth.initialize()
 const token=await blink.auth.getValidToken()
 const response=await fetch(backendUrl+path,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})})
 const result=await response.json().catch(()=>({error:'Resposta inválida do servidor'}))
 if(!response.ok)throw new Error(typeof result.error==='string'?result.error:result.error?.message||'Falha no servidor')
 return result
}
