// Auto-generated from your database schema — do not edit by hand.
// Regenerates automatically whenever a table is created or altered.

export type AgendamentoRow = {
  id: string
  companyId: string | null
  cardId: string | null
  titulo: string | null
  inicio: string | null
  fim: string | null
  googleEventId: string | null
  status: string | null
  createdAt: string
}

export type AgentConfigRow = {
  id: string
  userId: string | null
  companyId: string | null
  nomeAgente: string | null
  nomeEmpresa: string | null
  papelObjetivo: string | null
  estiloComunicacao: string | null
  sobreEmpresa: string | null
  produtosServicos: string | null
  podeFazer: string | null
  naoPodeFazer: string | null
  telefoneTransferencia: string | null
  palavraPausar: string | null
  palavraDespausar: string | null
  segmento: string | null
  descricaoNegocio: string | null
  diferenciais: string | null
  publicoAlvo: string | null
  regiaoHorario: string | null
  ofertas: string | null
  cupom: string | null
  comoVender: string | null
  objecoes: string | null
  formasPagamento: string | null
  ticketMedio: string | null
  faq: string | null
  politicas: string | null
  posvendaMsg: string | null
  pedirAvaliacao: boolean | null
  reativarCliente: boolean | null
  tom: string | null
  horariosAtendimento: string | null
  mensagemForaHorario: string | null
  responderEmPartes: boolean | null
  segundosBuffer: number | string | null
  personalidade: string | null
  focoAtendimento: string | null
  emojiIntensidade: string | null
  usarGirias: boolean | null
  chamarPorNome: boolean | null
  perguntarUmaPorVez: boolean | null
  podeBrincar: boolean | null
  assinarMensagens: boolean | null
  proatividade: number | string | null
  velocidadeResposta: string | null
  evitarPalavras: string | null
  idioma: string | null
  aiProvider: string | null
  aiModel: string | null
  openaiApiKey: string | null
  anthropicApiKey: string | null
  updatedAt: string
}

export type ApiTokenRow = {
  id: string
  companyId: string | null
  label: string | null
  token: string | null
  criadoPor: string | null
  ultimoUsoEm: string | null
  revogado: boolean | null
  createdAt: string
  updatedAt: string
}

export type AppConfigRow = {
  id: string
  superAdminEmails: string | null
  updatedAt: string
}

export type AuditLogRow = {
  id: string
  companyId: string | null
  userId: string | null
  actorEmail: string | null
  acao: string | null
  recurso: string | null
  detalhes: string | null
  ip: string | null
  userAgent: string | null
  createdAt: string
}

export type BillingEventLogRow = {
  id: string
  provider: string | null
  eventType: string | null
  externalId: string | null
  buyerEmail: string | null
  matchedCompanyId: string | null
  processed: boolean | null
  error: string | null
  payload: string | null
  eventKey: string | null
  createdAt: string
}

export type CampaignRow = {
  id: string
  companyId: string | null
  createdBy: string | null
  nome: string | null
  mensagem: string | null
  mediaUrl: string | null
  status: string | null
  agendadoPara: string | null
  filtroTags: string | null
  intervaloMin: number | string | null
  intervaloMax: number | string | null
  pausaApos: number | string | null
  pausaMinutos: number | string | null
  totalDestinatarios: number | string | null
  enviados: number | string | null
  falhas: number | string | null
  proximoEnvioEm: string | null
  iniciadoEm: string | null
  concluidoEm: string | null
  createdAt: string
  updatedAt: string
}

export type CampaignTargetRow = {
  id: string
  campaignId: string | null
  companyId: string | null
  contatoNumero: string | null
  contatoNome: string | null
  status: string | null
  enviadoEm: string | null
  erro: string | null
  processingToken: string | null
  processingStartedAt: string | null
  createdAt: string
}

export type CompanyRow = {
  id: string
  nome: string | null
  slug: string | null
  primaryColor: string | null
  logoUrl: string | null
  telefone: string | null
  statusCobranca: string | null
  trialAte: string | null
  createdBy: string | null
  createdAt: string
  updatedAt: string
  tipoPessoa: string | null
  cnpjCpf: string | null
  razaoSocial: string | null
  nomeFantasia: string | null
  inscricaoEstadual: string | null
  segmento: string | null
  porte: string | null
  site: string | null
  emailCorporativo: string | null
  cep: string | null
  rua: string | null
  numero: string | null
  complemento: string | null
  bairro: string | null
  cidade: string | null
  estado: string | null
  pais: string | null
  onboardingCompleted: boolean | null
  onboardingStep: number | string | null
  selectedPlanSlug: string | null
  financeiroAtivo: boolean | null
  financeiroDiasVencimentoPadrao: number | string | null
  creditosSaldo: number | string | null
  creditosResetamEm: string | null
  creditosOrigem: string | null
}

export type CompanyBillingRow = {
  id: string
  companyId: string | null
  tipoPessoa: string | null
  cnpjCpf: string | null
  razaoSocial: string | null
  nomeResponsavel: string | null
  emailCobranca: string | null
  telefone: string | null
  inscricaoEstadual: string | null
  cep: string | null
  rua: string | null
  numero: string | null
  complemento: string | null
  cidade: string | null
  estado: string | null
  pais: string | null
  createdAt: string
  updatedAt: string
}

export type CompanyUserRow = {
  id: string
  userId: string | null
  companyId: string | null
  role: string | null
  ativo: boolean | null
  forcarTrocaSenha: boolean | null
  conviteToken: string | null
  createdAt: string
  updatedAt: string
}

export type ContactPauseRow = {
  id: string
  userId: string | null
  companyId: string | null
  numero: string | null
  pausado: boolean | null
  updatedAt: string
}

export type CreditLedgerRow = {
  id: string
  companyId: string | null
  delta: number | string | null
  saldoApos: number | string | null
  motivo: string | null
  ref: string | null
  createdBy: string | null
  createdAt: string
}

export type CrmCardsRow = {
  id: string
  userId: string | null
  companyId: string | null
  numero: string | null
  nome: string | null
  status: string | null
  ultimaMensagem: string | null
  ultimaEm: string | null
  observacao: string | null
  updatedAt: string
  createdAt: string
  stageId: string | null
  valor: number | string | null
  origem: string | null
  ownerId: string | null
  tags: string | null
  proximaAcao: string | null
  followUp: string | null
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
}

export type CrmStageRow = {
  id: string
  companyId: string | null
  nome: string | null
  ordem: number | string | null
  cor: string | null
  tipo: string | null
  createdAt: string
}

export type CsatResponseRow = {
  id: string
  companyId: string | null
  numero: string | null
  contatoNome: string | null
  token: string | null
  score: number | string | null
  comentario: string | null
  enviadoPor: string | null
  enviadoEm: string | null
  respondidoEm: string | null
  createdAt: string
  updatedAt: string
}

export type FinCategoriaRow = {
  id: string
  companyId: string | null
  nome: string | null
  tipo: string | null
  cor: string | null
  ativo: boolean | null
  createdAt: string
}

export type FinLancamentoRow = {
  id: string
  companyId: string | null
  categoriaId: string | null
  cardId: string | null
  tipo: string | null
  descricao: string | null
  valor: number | string | null
  vencimento: string | null
  pagamentoEm: string | null
  status: string | null
  competencia: string | null
  observacao: string | null
  createdAt: string
  updatedAt: string
}

export type GoogleIntegrationRow = {
  companyId: string
  email: string | null
  accessToken: string | null
  refreshToken: string | null
  expiry: string | null
  calendarId: string | null
  conectado: boolean | null
  updatedAt: string
}

export type LeadEventoRow = {
  id: string
  companyId: string | null
  cardId: string | null
  tipo: string | null
  descricao: string | null
  createdAt: string
}

export type LeadNotaRow = {
  id: string
  companyId: string | null
  cardId: string | null
  autorId: string | null
  texto: string | null
  createdAt: string
}

export type MensagensRow = {
  id: string
  userId: string | null
  companyId: string | null
  numero: string | null
  contatoNome: string | null
  direcao: string | null
  autor: string | null
  texto: string | null
  whatsappMessageId: string | null
  createdAt: string
}

export type MessageTemplateRow = {
  id: string
  companyId: string | null
  userId: string | null
  atalho: string | null
  texto: string | null
  createdAt: string
  updatedAt: string
}

export type PlanRow = {
  id: string
  slug: string | null
  nome: string | null
  descricao: string | null
  precoCents: number | string | null
  moeda: string | null
  intervalo: string | null
  trialDays: number | string | null
  limiteMensagens: number | string | null
  limiteInstancias: number | string | null
  limiteUsuarios: number | string | null
  limiteContatos: number | string | null
  features: string | null
  destaque: boolean | null
  ativo: boolean | null
  ordem: number | string | null
  paddleProductId: string | null
  paddlePriceId: string | null
  stripeProductId: string | null
  stripePriceId: string | null
  checkoutUrl: string | null
  creditosMensais: number | string | null
  creditosTrial: number | string | null
  createdAt: string
  updatedAt: string
}

export type ProdutoRow = {
  id: string
  companyId: string | null
  nome: string | null
  preco: number | string | null
  descricao: string | null
  ativo: boolean | null
  ordem: number | string | null
  createdAt: string
}

export type ProfilesRow = {
  userId: string
  email: string | null
  nome: string | null
  nomeCompleto: string | null
  cpf: string | null
  cargo: string | null
  telefone: string | null
  createdAt: string
  updatedAt: string
}

export type SubscriptionRow = {
  id: string
  companyId: string | null
  planId: string | null
  status: string | null
  provider: string | null
  externalSubscriptionId: string | null
  externalCustomerId: string | null
  buyerEmail: string | null
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
  trialStart: string | null
  trialEnd: string | null
  canceledAt: string | null
  cancelAtPeriodEnd: boolean | null
  nextBillingAmountCents: number | string | null
  metadata: string | null
  createdAt: string
  updatedAt: string
}

export type UserRolesRow = {
  id: string
  userId: string | null
  role: string | null
  createdAt: string
}

export type UsersRow = {
  id: string
  email: string
  emailVerified: number | string | null
  displayName: string | null
  avatarUrl: string | null
  phone: string | null
  phoneVerified: number | string | null
  role: string | null
  metadata: string | null
  createdAt: string
  updatedAt: string
  lastSignIn: string
}

export type WebhookDeliveryLogRow = {
  id: string
  companyId: string | null
  endpointId: string | null
  evento: string | null
  statusCode: number | string | null
  erro: string | null
  createdAt: string
}

export type WebhookEndpointRow = {
  id: string
  companyId: string | null
  nome: string | null
  url: string | null
  secret: string | null
  eventos: string | null
  ativo: boolean | null
  createdAt: string
  updatedAt: string
}

export type WhatsappInstancesRow = {
  id: string
  userId: string | null
  companyId: string | null
  instanceName: string | null
  numero: string | null
  status: string | null
  webhookToken: string | null
  webhookConfiguredAt: string | null
  updatedAt: string
}
