import { callBackend } from '@/blink/backend'
export const getMyCredits = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/credits.functions", name:"getMyCredits",data:args.data})
export const adminGrantCredits = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/credits.functions", name:"adminGrantCredits",data:args.data})
