import { callBackend } from '@/blink/backend'
export const listWebhooks = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/integrations.functions", name:"listWebhooks",data:args.data})
export const saveWebhook = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/integrations.functions", name:"saveWebhook",data:args.data})
export const deleteWebhook = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/integrations.functions", name:"deleteWebhook",data:args.data})
export const listWebhookLogs = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/integrations.functions", name:"listWebhookLogs",data:args.data})
export const listApiTokens = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/integrations.functions", name:"listApiTokens",data:args.data})
export const createApiToken = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/integrations.functions", name:"createApiToken",data:args.data})
export const revokeApiToken = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/integrations.functions", name:"revokeApiToken",data:args.data})
