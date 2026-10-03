import { callBackend } from '@/blink/backend'
export const startGoogleOAuth = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/google.functions", name:"startGoogleOAuth",data:args.data})
export const disconnectGoogle = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/google.functions", name:"disconnectGoogle",data:args.data})
export const createGoogleCalendarEvent = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/google.functions", name:"createGoogleCalendarEvent",data:args.data})
