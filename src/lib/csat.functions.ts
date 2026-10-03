import { callBackend } from '@/blink/backend'
export const sendCsat = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/csat.functions", name:"sendCsat",data:args.data})
export const submitCsat = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/csat.functions", name:"submitCsat",data:args.data})
export const getCsatByToken = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/csat.functions", name:"getCsatByToken",data:args.data})
