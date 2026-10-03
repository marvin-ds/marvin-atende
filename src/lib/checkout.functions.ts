import { callBackend } from '@/blink/backend'
export const createCheckoutCompany = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/checkout.functions", name:"createCheckoutCompany",data:args.data})
