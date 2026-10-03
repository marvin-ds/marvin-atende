import { callBackend } from '@/blink/backend'
export const getBillingWebhookInfo = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/billing.functions", name:"getBillingWebhookInfo",data:args.data})
export const listRecentBillingEvents = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/billing.functions", name:"listRecentBillingEvents",data:args.data})
