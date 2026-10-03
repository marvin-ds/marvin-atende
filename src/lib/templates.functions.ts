import { callBackend } from '@/blink/backend'
export const listTemplates = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/templates.functions", name:"listTemplates",data:args.data})
export const saveTemplate = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/templates.functions", name:"saveTemplate",data:args.data})
export const deleteTemplate = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/templates.functions", name:"deleteTemplate",data:args.data})
export const saveBusinessHours = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/templates.functions", name:"saveBusinessHours",data:args.data})
export const getBusinessHours = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/templates.functions", name:"getBusinessHours",data:args.data})
