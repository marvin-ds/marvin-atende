import { callBackend } from '@/blink/backend'
export const listTeam = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/team.functions", name:"listTeam",data:args.data})
export const inviteMember = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/team.functions", name:"inviteMember",data:args.data})
export const setMemberActive = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/team.functions", name:"setMemberActive",data:args.data})
export const setMemberRole = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/team.functions", name:"setMemberRole",data:args.data})
