import { createClient } from '@blinkdotnew/sdk'

export type Env = Record<string, string | undefined>
export type Blink = ReturnType<typeof createClient>

export type AuthContext = {
  blink: Blink
  auth: { valid: true; userId: string; email?: string | null; [key: string]: unknown }
  membership: any | null
  isSuperAdmin: boolean
}

export const SENSITIVE_TABLES = new Set([
  'users', '_blink_auth', 'password_reset_tokens', 'magic_link_tokens',
  'email_verification_tokens', 'app_config', 'user_roles', 'api_token',
  'google_integration',
])

export const TABLE_POLICIES: Record<string, {
  scope: 'company' | 'companyRow' | 'user' | 'public'
  columns: string[]
  read: boolean
  create: boolean
  update: boolean
  remove: boolean
  writeRoles?: string[]
}> = {
  company: {
    scope: 'companyRow', read: true, create: false, update: true, remove: false,
    writeRoles: ['owner', 'admin'],
    columns: ['nome', 'slug', 'primaryColor', 'logoUrl', 'telefone', 'statusCobranca', 'trialAte', 'tipoPessoa', 'cnpjCpf', 'razaoSocial', 'nomeFantasia', 'inscricaoEstadual', 'segmento', 'porte', 'site', 'emailCorporativo', 'cep', 'rua', 'numero', 'complemento', 'bairro', 'cidade', 'estado', 'pais', 'onboardingCompleted', 'onboardingStep', 'selectedPlanSlug', 'financeiroAtivo', 'financeiroDiasVencimentoPadrao'],
  },
  profiles: {
    scope: 'user', read: true, create: true, update: true, remove: false,
    writeRoles: ['owner', 'admin', 'atendente'],
    columns: ['email', 'nome', 'nomeCompleto', 'cpf', 'cargo', 'telefone'],
  },
  plan: {
    scope: 'public', read: true, create: false, update: false, remove: false,
    columns: ['slug', 'nome', 'descricao', 'precoCents', 'moeda', 'intervalo', 'trialDays', 'limiteMensagens', 'limiteInstancias', 'limiteUsuarios', 'limiteContatos', 'features', 'destaque', 'ativo', 'ordem', 'checkoutUrl'],
  },
  agent_config: {
    scope: 'company', read: true, create: true, update: true, remove: false,
    writeRoles: ['owner', 'admin'],
    columns: ['nomeAgente', 'nomeEmpresa', 'papelObjetivo', 'estiloComunicacao', 'sobreEmpresa', 'produtosServicos', 'podeFazer', 'naoPodeFazer', 'telefoneTransferencia', 'palavraPausar', 'palavraDespausar', 'segmento', 'descricaoNegocio', 'diferenciais', 'publicoAlvo', 'regiaoHorario', 'ofertas', 'cupom', 'comoVender', 'objecoes', 'formasPagamento', 'ticketMedio', 'faq', 'politicas', 'posvendaMsg', 'pedirAvaliacao', 'reativarCliente', 'tom', 'horariosAtendimento', 'mensagemForaHorario', 'responderEmPartes', 'segundosBuffer', 'personalidade', 'focoAtendimento', 'emojiIntensidade', 'usarGirias', 'chamarPorNome', 'perguntarUmaPorVez', 'podeBrincar', 'assinarMensagens', 'proatividade', 'velocidadeResposta', 'evitarPalavras', 'idioma', 'aiProvider', 'aiModel'],
  },
  crm_cards: {
    scope: 'company', read: true, create: true, update: true, remove: true,
    writeRoles: ['owner', 'admin', 'atendente'],
    columns: ['numero', 'nome', 'status', 'ultimaMensagem', 'ultimaEm', 'observacao', 'stageId', 'valor', 'origem', 'ownerId', 'tags', 'proximaAcao', 'followUp', 'utmSource', 'utmMedium', 'utmCampaign'],
  },
  crm_stage: {
    scope: 'company', read: true, create: true, update: true, remove: true,
    writeRoles: ['owner', 'admin'],
    columns: ['nome', 'ordem', 'cor', 'tipo'],
  },
  mensagens: {
    scope: 'company', read: true, create: true, update: false, remove: false,
    writeRoles: ['owner', 'admin', 'atendente'],
    columns: ['numero', 'contatoNome', 'direcao', 'autor', 'texto', 'whatsappMessageId'],
  },
  contact_pause: {
    scope: 'company', read: true, create: true, update: true, remove: false,
    writeRoles: ['owner', 'admin', 'atendente'],
    columns: ['numero', 'pausado'],
  },
  whatsapp_instances: {
    scope: 'company', read: true, create: true, update: true, remove: false,
    writeRoles: ['owner', 'admin'],
    columns: ['instanceName', 'numero', 'status', 'webhookToken', 'webhookConfiguredAt'],
  },
  lead_evento: { scope: 'company', read: true, create: true, update: false, remove: false, writeRoles: ['owner', 'admin', 'atendente'], columns: ['cardId', 'tipo', 'descricao'] },
  lead_nota: { scope: 'company', read: true, create: true, update: true, remove: true, writeRoles: ['owner', 'admin', 'atendente'], columns: ['cardId', 'autorId', 'texto'] },
  produto: { scope: 'company', read: true, create: true, update: true, remove: true, writeRoles: ['owner', 'admin'], columns: ['nome', 'preco', 'descricao', 'ativo', 'ordem'] },
  message_template: { scope: 'company', read: true, create: true, update: true, remove: true, writeRoles: ['owner', 'admin', 'atendente'], columns: ['atalho', 'texto'] },
  agendamento: { scope: 'company', read: true, create: true, update: true, remove: true, writeRoles: ['owner', 'admin', 'atendente'], columns: ['cardId', 'titulo', 'inicio', 'fim', 'googleEventId', 'status'] },
  fin_categoria: { scope: 'company', read: true, create: true, update: true, remove: true, writeRoles: ['owner', 'admin'], columns: ['nome', 'tipo', 'cor', 'ativo'] },
  fin_lancamento: { scope: 'company', read: true, create: true, update: true, remove: true, writeRoles: ['owner', 'admin'], columns: ['categoriaId', 'cardId', 'tipo', 'descricao', 'valor', 'vencimento', 'pagamentoEm', 'status', 'competencia', 'observacao'] },
}

export const getBlink = (env: Env) => createClient({ projectId: env.BLINK_PROJECT_ID, secretKey: env.BLINK_SECRET_KEY })
export const errorResponse = (message: string, status = 400, code?: string) => new Response(JSON.stringify({ error: message, ...(code ? { code } : {}) }), { status, headers: { 'Content-Type': 'application/json' } })
export const camelizeKey = (key: string) => key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
export const camelize = (value: any): any => Array.isArray(value) ? value.map(camelize) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k, v]) => [camelizeKey(k), camelize(v)])) : value
export const safeLimit = (value: unknown) => Math.min(500, Math.max(1, Number(value || 100) || 100))

export async function authContext(c: any): Promise<AuthContext | Response> {
  const blink = getBlink(c.env as Env)
  const auth = await blink.auth.verifyToken(c.req.header('Authorization'))
  if (!auth.valid) return errorResponse('Unauthorized', 401)
  const memberships = blink.db.table<any>('company_user')
  const rows = await memberships.list({ where: { userId: auth.userId, ativo: true }, orderBy: { createdAt: 'asc' }, limit: 1 })
  const membership = rows[0] ?? null
  const roles = await blink.db.table<any>('user_roles').list({ where: { userId: auth.userId }, limit: 20 })
  return { blink, auth: auth as AuthContext['auth'], membership, isSuperAdmin: roles.some((row: any) => row.role === 'super_admin') }
}

export function canWrite(policy: typeof TABLE_POLICIES[string], role?: string | null) {
  return !!policy.writeRoles?.includes(String(role))
}

export async function recordForScope(blink: Blink, tableName: string, id: string, ctx: AuthContext) {
  const row = await blink.db.table<any>(tableName).get(id)
  if (!row) return null
  const policy = TABLE_POLICIES[tableName]
  if (ctx.isSuperAdmin && policy?.scope === 'public') return row
  if (policy?.scope === 'companyRow') return row.id === ctx.membership?.companyId ? row : null
  if (policy?.scope === 'company') return row.companyId === ctx.membership?.companyId ? row : null
  if (policy?.scope === 'user') return row.userId === ctx.auth.userId ? row : null
  return row
}

export function sanitizePayload(tableName: string, body: any) {
  const policy = TABLE_POLICIES[tableName]
  const input = camelize(body ?? {})
  const out: Record<string, unknown> = {}
  for (const key of policy.columns) if (Object.prototype.hasOwnProperty.call(input, key)) out[key] = input[key]
  if (typeof input.id === 'string') out.id = input.id
  return out
}

export function requireOwnerEmail(env: Env) {
  return String(env.OWNER_EMAIL || env.BLINK_OWNER_EMAIL || '').trim().toLowerCase()
}

export async function createAuthUser(env: Env, email: string, password: string, displayName?: string) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetch('https://blink.new/api/auth/signup', {
      method: 'POST', signal: controller.signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.BLINK_SECRET_KEY}` },
      body: JSON.stringify({ projectId: env.BLINK_PROJECT_ID, email, password, metadata: displayName ? { displayName } : undefined }),
    })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok || !payload.user) throw new Error(payload.error || `Não foi possível criar o usuário (${response.status})`)
    return payload.user
  } finally { clearTimeout(timeout) }
}
