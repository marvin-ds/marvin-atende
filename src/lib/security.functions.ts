import { callBackend } from '@/blink/backend'
export const listAuditLog = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/security.functions", name:"listAuditLog",data:args.data})
export const exportLgpd = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/security.functions", name:"exportLgpd",data:args.data})
