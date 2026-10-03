import { callBackend } from '@/blink/backend'
export const getPlanUsage = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/plan.functions", name:"getPlanUsage",data:args.data})
export const createContact = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/plan.functions", name:"createContact",data:args.data})
export const importContacts = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/plan.functions", name:"importContacts",data:args.data})
