# 07 — PORTABILITY
## Auditoria: Marvin Atende (AtendeZap)

**Data:** 2026-10-06  
**Branch auditada:** `main` (HEAD: `53da509`)

---

## SCORES

| Dimensão | Score | Classificação |
|---|---|---|
| **PORTABILITY_SCORE (Blink — estado atual)** | **48 / 100** | HIGH_LOCK_IN |
| **PORTABILITY_SCORE (Emergent path — migrado)** | **72 / 100** | MIGRATION_REQUIRED |

---

## ANÁLISE DE LOCK-IN — BLINK

### Dependências que criam lock-in

| Componente | Arquivo | Impacto | Substituível? |
|---|---|---|---|
| `@blinkdotnew/sdk` | package.json | Auth + DB + AI | SIM → Supabase JS |
| `blink.auth.verifyToken` | server/native/context.ts | Toda autenticação | SIM → GoTrue |
| `blink.db` | server/native/context.ts | Banco de dados completo | SIM → Supabase client |
| `blink.ai.generateText` | src/lib/lovable-ai.server.ts | AI gateway padrão | SIM → Gemini direto |
| `*.backend.blink.new` URL check | src/blink/backend.ts | Frontend hardcoded | SIM → remoção |
| `security-policy.json` | scripts/native/ | Mecanismo Blink-only | SIM → PostgreSQL RLS |
| Cloudflare Workers runtime | package.json build | Browser API compat | SIM → Node runtime |

### O que NÃO tem lock-in

- Todo o domínio de negócio em `domain.ts` (lógica pura)
- Frontend React 19 / TanStack Start (portável)
- Hono framework (portável — roda em Node, Deno, Bun, Workers)
- Schema de 31 tabelas (portável para PostgreSQL com ajustes de tipo)
- Lógica de campanhas, créditos, webhooks (pura TypeScript)
- Integração Evolution API (API externa, independente de plataforma)

---

## CAMINHO DE MIGRAÇÃO: BLINK → SUPABASE

### Fase 1 — Substituição de Auth (1-2 semanas)

**De:** `blink.auth.*`  
**Para:** `@supabase/supabase-js` auth real

Arquivos a modificar:
- `src/integrations/supabase/client.ts` — remover compat layer, usar Supabase real
- `server/native/context.ts` — substituir `blink.auth.verifyToken` por `supabase.auth.getUser`

A compat layer já existe e expõe a interface Supabase — a migração é trocar a implementação, não reescrever o consumidor.

### Fase 2 — Substituição de Banco (2-3 semanas)

**De:** `blink.db` (SQLite) via `adaptBlinkSql`  
**Para:** Supabase PostgreSQL direto

Arquivos a modificar:
- `server/native/context.ts` — substituir `adaptBlinkSql(blink.db)` por cliente Supabase
- `server/native/sql-adapter.ts` — pode ser removido (PostgreSQL retorna snake_case nativo)
- `server/native/database.ts` — adaptar query builder para PostgreSQL syntax

Schema migration: `scripts/native/schema.sql` (SQLite) → PostgreSQL (ajustar tipos TEXT para UUID, adicionar NOT NULL constraints, adicionar FK constraints explícitas).

**Referência:** `setup/bootstrap.sql` do Emergent já tem o schema PostgreSQL equivalente.

### Fase 3 — Substituição de AI Gateway (0.5 semana)

**De:** `blink.ai.generateText()`  
**Para:** chamada direta Gemini (já implementada como fallback)

`src/lib/lovable-ai.server.ts` já tem código para Gemini direto — é o path do Emergent.

### Fase 4 — Substituição de Backend Hosting (1-2 semanas)

**De:** Cloudflare Workers via Blink  
**Para:** Vercel Edge Functions ou Node/Hono container

Hono já é portável — o `server/index.ts` pode rodar em Node com `@hono/node-server` sem modificações no código de rota.

A única mudança é o adapter de entrada e saída do runtime. Em Workers: `export default { fetch: app.fetch }`. Em Node: `serve(app, {port: 3000})`.

### Fase 5 — Remover URL Hardcode (0.5 semana)

**Arquivo:** `src/blink/backend.ts`

```typescript
// Remover esta verificação:
if (!url.endsWith('.backend.blink.new')) {
  throw new Error('Invalid backend URL');
}
```

Substituir por validação de env var genérica.

---

## TIMELINE ESTIMADA DE MIGRAÇÃO

| Fase | Esforço | Parallelizável? |
|---|---|---|
| Auth | 1-2 semanas | Com Fase 3 |
| Banco | 2-3 semanas | Não (bloqueado pela Auth) |
| AI Gateway | 0.5 semana | Com Fase 1 |
| Backend Hosting | 1-2 semanas | Com Fase 2 |
| URL hardcode | 0.5 semana | Com qualquer fase |
| Testes + QA | 1-2 semanas | Após todas as fases |

**Total estimado:** 4-6 semanas (1 dev sênior full-time)  
**Classificação:** Esforço M-L, não XXL

---

## DEPENDÊNCIA EVOLUTION API

Evolution API não é lock-in de plataforma — é um serviço externo self-hosted. A Marvin precisará:
1. Hospedar servidor Evolution API próprio (VPS, ~R$50-100/mês)
2. Ou contratar Evolution API como serviço gerenciado
3. Gerenciar sessões WhatsApp por empresa (cada empresa tem sua instância Evolution)

**Risco operacional:** Bloqueio pelo WhatsApp Business se número for suspeito de automação.

---

## ESTADO DA VERSÃO EMERGENT (CAMINHO RECOMENDADO)

A versão Emergent demonstra que a stack aberta já funciona:
- PostgreSQL 15 ✓
- GoTrue self-hosted ✓  
- PostgREST para API ✓
- Hono backend ✓
- Frontend React 19 ✓

O trabalho de migração é essencialmente portar a versão Blink para usar a stack da versão Emergent como base.

---

## SUMMARY

[Provável] O sistema é portável com esforço M-L. A compat layer Supabase que já existe no código é o ativo mais valioso da migração — o frontend não precisa mudar. A versão Emergent prova que o caminho funciona. Estimativa de 4-6 semanas para um dev sênior migrar completamente do Blink para Supabase+Vercel.
