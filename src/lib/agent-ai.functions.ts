import { callBackend } from '@/blink/backend'
export const analyzeBusinessBrief = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/agent-ai.functions", name:"analyzeBusinessBrief",data:args.data})
export const generateAgentConfig = (args:any={}) => callBackend('/api/rpc', {module:"src/lib/agent-ai.functions", name:"generateAgentConfig",data:args.data})
