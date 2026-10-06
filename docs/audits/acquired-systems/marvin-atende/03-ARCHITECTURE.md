# 03 — ARCHITECTURE
## Auditoria: Marvin Atende (AtendeZap)

**Data:** 2026-10-06  
**Branch auditada:** `main` (HEAD: `53da509`)

---

## VISÃO GERAL

Sistema SaaS multiempresa de atendimento via WhatsApp com IA generativa. Dois alvos de deployment sobre a mesma base de código:

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React 19)                │
│         TanStack Start + TanStack Router             │
│         shadcn/ui + Tailwind 4 + Zustand             │
└─────────────────────────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
    ┌─────────▼──────────┐   ┌───────▼──────────────┐
    │    Blink Backend   │   │   Emergent Backend    │
    │  (Cloudflare Worker)   │  (Node/Hono container) │
    │  Hono + esbuild    │   │  Hono + Docker/Linux   │
    └─────────┬──────────┘   └───────┬───────────────┘
              │                       │
    ┌─────────▼──────────┐   ┌───────▼──────────────┐
    │   Blink SDK        │   │  PostgreSQL 15         │
    │   SQLite managed   │   │  GoTrue (Auth)         │
    │   Blink Auth       │   │  PostgREST (API)       │
    └────────────────────┘   └──────────────────────┘
```

---

## CAMADAS DA APLICAÇÃO

### 1. Camada de Apresentação (Frontend)

**TanStack Start** provê SSR + file-based routing. As rotas são definidas em `src/routes/` seguindo convenção de arquivo.

**State management:** Zustand para estado global; TanStack Query para cache de dados do servidor.

**UI:** shadcn/ui sobre Radix UI — componentes acessíveis, sem CSS framework proprietário.

**Auth flow:** `src/integrations/supabase/client.ts` expõe interface Supabase, mas internamente chama `blink.auth.*` na versão Blink.

### 2. Camada de Backend (API)

**Hono** como HTTP framework com 6 grupos de rotas:

```
/health                    — liveness probe
/api/bootstrap             — inicialização de empresa
/api/query                 — leitura genérica via Database class
/api/rpc                   — chamadas de negócio (allowlist de 70 funções)
/api/database-operation    — operações de escrita
public routes              — webhooks, billing, evolution callbacks
```

**CORS:** `origin: '*'` — aberto. Risco P1 (sem restrição de origem).

**Compilação Blink:** `esbuild server/index.ts → backend/index.ts` (single file, externaliza SDK).

### 3. Camada de Dados (Database)

**`server/native/database.ts`** — ORM-like query builder:
- `scope(companyId)` — enforça isolamento multi-tenant em TODAS as queries
- Campos protegidos: secrets de API, tokens de auth
- Tabelas read-only para atendentes
- Tabelas de escrita restrita por role

**Multi-tenancy:** enforçado a nível de banco (scope na query), não apenas no middleware da API.

**Schema:** 31 tabelas. Trigger `native_company_defaults` bootstrapa cada nova empresa:
- 4 estágios CRM padrão
- 1 `agent_config`
- Créditos iniciais de IA

### 4. Camada de Autenticação

**Blink:** `blink.auth.verifyToken()` em cada request. Auth totalmente gerenciada pelo SDK.

**Emergent:** GoTrue self-hosted. JWT verificado via chave pública.

**Roles:** owner / admin / atendente / super_admin — verificadas em runtime via `user_roles` table.

### 5. Camada de Integrações

**Evolution API v2:** WebSocket + REST para envio/recebimento de mensagens WhatsApp. Webhooks recebidos em `/api/evolution/webhook`.

**Campaign Worker:** cron independente. Atomic reservation de mensagens via SQL + idempotência por `campaign_job_id`.

**Billing Webhooks:** Kiwify, Cakto, Perfectpay via HMAC-SHA256 (`@noble/hashes`).

**AI Layer:** `src/lib/lovable-ai.server.ts` — Blink AI gateway (padrão) ou OpenAI/Anthropic direto.

---

## MODELO DE DADOS — 31 TABELAS

Agrupamento lógico:

| Grupo | Tabelas |
|---|---|
| **Tenancy** | company, subscription, plan |
| **Usuários** | company_user, user_roles |
| **CRM** | lead, crm_stage, crm_card, lead_nota, lead_evento |
| **Atendimento** | conversation, message, contact, contact_pause |
| **Agente IA** | agent_config, ai_session |
| **Créditos** | credit_ledger, credit_balance |
| **Campanhas** | campaign, campaign_contact, campaign_job |
| **Financeiro** | payment, invoice |
| **Agendamento** | agendamento, calendar_config |
| **Templates** | message_template, quick_reply |
| **Equipe** | team_metric, attendance_report |
| **Config** | company_config, integration_config |
| **CSAT** | csat_response |
| **Webhooks** | webhook_config, webhook_log |

---

## PADRÕES ARQUITETURAIS NOTÁVEIS

### RPC Allowlist (70 funções)
Todas as chamadas de negócio passam pelo endpoint `/api/rpc` com verificação contra allowlist explícita em `domain.ts`. Chamadas fora do allowlist são rejeitadas com 403. Padrão defensivo correto.

### Compat Layer (Supabase Interface)
`src/integrations/supabase/compat.ts` implementa `.from().select().eq()` mock que internamente roteia para o backend Blink. Isso indica que o código foi originalmente escrito para Supabase e o Blink foi sobreposto depois — confirmado por `_migration/plan.json`.

### sql-adapter.ts
Reverse-maps o camelCase do Blink SDK para snake_case do SQL. Necessário porque o SDK transforma automaticamente nomes de coluna. Em migração para Supabase real, este adapter pode ser removido.

### Security Policy JSON
`scripts/native/security-policy.json` — política Blink que nega acesso direto do SDK a TODAS as 31 tabelas. Força o tráfego pelo backend Hono. Mecanismo inexistente fora do Blink — precisaria ser substituído por RLS PostgreSQL na migração.

---

## PONTOS DE ACOPLAMENTO CRÍTICOS

| Componente | Acoplamento | Impacto de remoção |
|---|---|---|
| `@blinkdotnew/sdk` | Auth + DB + AI gateway | Sistema para completamente |
| `blink.auth.verifyToken` | Toda autenticação | Todas as requests falham |
| `blink.db` | Todo o banco de dados | Perda total de dados |
| `backend.blink.new` URL check | Frontend hardcoded | Frontend não conecta a outro backend |
| Evolution API | Envio/recebimento WhatsApp | Produto não funciona sem WA |

---

## SUMMARY

Arquitetura de duas camadas (frontend SPA + backend API) com isolamento multi-tenant robusto. O design do backend (RPC allowlist, scope(), campos protegidos) demonstra engenharia defensiva sólida. O acoplamento ao Blink é profundo mas concentrado em três pontos: auth, banco e AI gateway — todos substituíveis por Supabase na migração.
