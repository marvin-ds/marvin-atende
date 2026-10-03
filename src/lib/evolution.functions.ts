import { callBackend } from '@/blink/backend'
export const connectWhatsapp = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/evolution.functions", name:"connectWhatsapp",data:args.data})
export const checkWhatsappStatus = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/evolution.functions", name:"checkWhatsappStatus",data:args.data})
export const disconnectWhatsapp = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/evolution.functions", name:"disconnectWhatsapp",data:args.data})
export const sendWhatsappText = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/evolution.functions", name:"sendWhatsappText",data:args.data})
export const setContactIaActive = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/evolution.functions", name:"setContactIaActive",data:args.data})
export const testAiReply = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/evolution.functions", name:"testAiReply",data:args.data})
