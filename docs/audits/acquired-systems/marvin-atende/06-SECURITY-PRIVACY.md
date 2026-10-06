# 06 — SECURITY & PRIVACY
## Auditoria: Marvin Atende (AtendeZap)

**Data:** 2026-10-06  
**Branch auditada:** `main` (HEAD: `53da509`)

---

## CLASSIFICAÇÃO DE RISCOS

| Nível | Descrição | Encontrados |
|---|---|---|
| **P0** | Crítico — exploração remota imediata possível | 0 |
| **P1** | Alto — superfície de ataque significativa | 1 |
| **P2** | Médio — risco real mas mitigado por outros controles | 3 |
| **P3** | Baixo — melhoria de hardening | 2 |

---

## ACHADOS DE SEGURANÇA

### [P1] CORS Aberto

**Localização:** `server/index.ts`

```typescript
app.use('*', cors({origin: '*'}))
```

**Impacto:** Qualquer origem pode fazer requisições autenticadas ao backend. Um atacante com um JWT válido (obtido de qualquer forma) pode chamar qualquer endpoint a partir de qualquer domínio, incluindo via XSS em outros sites.

**Mitigação recomendada:** Restringir `origin` ao domínio do frontend em produção:
```typescript
cors({origin: ['https://app.meudominio.com']})
```

**Confiança:** CONFIRMED — código fonte verificado.

---

### [P2] Hardcoded Fallback IDs no Cliente

**Localização:** `src/blink/client.ts`

```typescript
projectId: import.meta.env.VITE_BLINK_PROJECT_ID || 'proj_fallback_xyz'
publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'pk_fallback_...'
```

**Impacto:** Em deploy com env vars não configuradas, o frontend conecta ao projeto Blink original do vendedor. Usuários cadastrados no tenant errado; dados potencialmente misturados.

**Mitigação:** Remover fallbacks hardcoded; fazer build falhar se env vars não estiverem definidas.

**Confiança:** CONFIRMED — código fonte verificado.

---

### [P2] Ausência de Rate Limiting

**Localização:** `server/index.ts` — nenhum middleware de rate limit identificado.

**Impacto:** Endpoint `/api/rpc` pode ser abusado para enumeração de funções ou DDoS de aplicação. Endpoint de auth pode ser atacado via credential stuffing.

**Mitigação:** Adicionar rate limiting via Hono middleware ou à camada de Cloudflare Workers (WAF Blink/Cloudflare).

**Confiança:** CONFIRMED via ausência no código.

---

### [P2] Ausência de Content Security Policy (CSP)

**Impacto:** XSS em frontend sem CSP tem impacto ampliado — scripts injetados podem exfiltrar tokens de auth.

**Mitigação:** Configurar CSP headers no servidor.

**Confiança:** INFERRED — não verificado se CDN/proxy adiciona CSP externamente.

---

### [P3] `npm audit` — 1 Vulnerabilidade HIGH

**Pacote:** `source-map-js` (dependência transitiva de Vite/esbuild)  
**Ambiente afetado:** Build tools (desenvolvimento), não runtime de produção.  
**Risco efetivo:** BAIXO — não executa em produção.  
**Ação:** `npm audit fix` após fim da fase de auditoria.

**Confiança:** CONFIRMED via `npm audit`.

---

### [P3] Logging de Erros Sem Redação de Dados Sensíveis

**Localização:** Múltiplos arquivos — `console.error(err)` sem filtro.

**Impacto:** Em ambiente de produção com acesso a logs, um erro que inclua o objeto de request pode logar tokens de auth, IDs de empresa ou dados de usuário.

**Mitigação:** Substituir `console.error(err)` por logger estruturado que redige campos sensíveis.

**Confiança:** INFERRED — padrão observado no código, impacto depende do ambiente de log.

---

## PRIVACIDADE E LGPD

### Dados Pessoais Processados

| Categoria | Dados | Localização |
|---|---|---|
| Identificação | nome, email, telefone | tabela `contact`, `company_user` |
| Comunicação | mensagens WhatsApp completas | tabela `message` |
| Comportamento | histórico de interações, CRM | `lead_evento`, `conversation` |
| Financeiro | dados de pagamento (via webhook) | tabela `payment` |
| Sensíveis (empresa) | chaves de API | `integration_config` (protegido no DB) |

### Controles de Privacidade Identificados

**Positivo:**
- Isolamento multi-tenant garante que empresa A não acessa dados de empresa B
- Campos de API keys protegidos na Database class (não expostos em queries)
- Roles (atendente não vê dados financeiros ou de outras empresas)

**Gaps:**
- Sem mecanismo de exclusão de dados de titular (LGPD Art. 18 — direito de exclusão)
- Sem política de retenção de dados de mensagens
- Sem log de auditoria de acesso a dados pessoais (além do credit_ledger para IA)
- Sem DPA (Data Processing Agreement) identificado para Evolution API

---

## ASSINATURA DE WEBHOOKS

**Mecanismo:** HMAC-SHA256 via `@noble/hashes`

```typescript
// src/lib/webhooks.server.ts
const signature = hmac(sha256, secret, payload);
header: 'X-MarvinAtende-Signature: <hex>'
```

**Avaliação:** Implementação correta de HMAC para webhooks de saída. Proteção adequada contra falsificação.

**Billing webhooks:** Kiwify/Cakto/Perfectpay — verificação de HMAC na recepção implementada.

---

## EVOLUÇÃO API — CONSIDERAÇÕES DE SEGURANÇA

Evolution API v2 (self-hosted) requer:
- Chave de API por instância (armazenada em `integration_config`)
- O servidor Evolution API precisa de exposição pública para receber webhooks do WhatsApp
- Risco de rate limiting e bloqueio pelo WhatsApp Business API

**Risco operacional:** Um servidor Evolution API comprometido expõe todas as conversas WhatsApp dos tenants que usam aquela instância.

---

## SECRETS MANAGEMENT

### Blink
- `BLINK_PROJECT_ID`, `BLINK_SECRET_KEY` via env vars do Cloudflare Workers
- Chaves de AI por empresa em `integration_config` (DB, campo protegido)

### Emergent
- `.env` gerado pelo `setup/install.sh` com secrets aleatórios
- JWT secret, GoTrue keys, PostgREST secret gerados na instalação
- Sem cofre de secrets (Vault, AWS Secrets Manager) identificado

---

## SUMMARY

Sem vulnerabilidades P0. Um P1 crítico: CORS aberto que deve ser fechado antes de qualquer deploy em produção. Campos sensíveis protegidos no Database class é um padrão defensivo correto. Gaps de LGPD requerem atenção para compliance antes de go-live comercial. A assinatura de webhooks é implementada corretamente.
