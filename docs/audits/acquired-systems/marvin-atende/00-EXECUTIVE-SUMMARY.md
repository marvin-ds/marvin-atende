# 00 — EXECUTIVE SUMMARY
## Auditoria: Marvin Atende (AtendeZap)

**Auditoria realizada em:** 2026-10-06  
**Auditor:** Claude Code (SKILL-ENG-01 + SKILL-GOV-01)  
**Projeto:** `marvin-ds/marvin-atende`  
**Branch auditada:** `main` (HEAD: `53da509`)

---

## O QUE É

SaaS multiempresa de atendimento via WhatsApp com IA generativa, CRM Kanban, campanhas em massa, gestão de equipe, financeiro e relatórios. Comercializado como "AtendeZap" para alunos replicarem como próprios negócios. Adquirido pela Marvin para avaliação de adoção.

---

## ACHADO CENTRAL

O repositório contém **dois produtos distintos sobre a mesma base de código**:

| Versão | Plataforma | Banco | Auth | Status |
|---|---|---|---|---|
| **Blink** | Cloudflare Workers via Blink SDK | SQLite gerenciado pelo Blink | Blink Auth | Produção original |
| **Emergent** | Container Linux (Emergent platform) | PostgreSQL 15 + GoTrue + PostgREST | GoTrue self-hosted | Versão para alunos |

A versão Blink é **não portável sem o Blink** — se a conta Blink for desligada hoje, autenticação, banco e backend param completamente.

A versão Emergent demonstra que o sistema **já foi independizado uma vez** e funciona com stack aberta. Esse é o caminho para a Marvin.

---

## DECISÃO RECOMENDADA

```
ADAPT
```

**Por quê:** O problema é real e o mercado é validado (WhatsApp + IA para micro negócios brasileiros). O domínio de negócio está bem modelado — 31 tabelas, isolamento multi-tenant com testes, módulos claros. A versão Emergent prova que a independência de plataforma já foi feita. A Marvin não precisa reconstruir do zero; precisa migrar o Blink para Supabase/Vercel, o que é um esforço M-L, não XXL.

---

## NÚMEROS RÁPIDOS

| Métrica | Valor |
|---|---|
| MARVIN_OPPORTUNITY_SCORE | **73 / 100** |
| PORTABILITY_SCORE (Blink) | **48 / 100** — HIGH_LOCK_IN |
| PORTABILITY_SCORE (Emergent path) | **72 / 100** — MIGRATION_REQUIRED |
| Build local | **PASS** (10.94s) |
| Testes automatizados | **BLOCKED** (bundles faltando; lógica validada via database.test.mjs) |
| Qualidade de engenharia | **GOOD** |
| Risco de segurança P0/P1 | **0 P0 / 1 P1** |

---

## OS 3 MAIORES RISCOS

1. **Lock-in Blink** — toda a camada de auth, DB e backend hosting depende do `@blinkdotnew/sdk`. Desligar a conta Blink = sistema morto.
2. **Sem observabilidade** — em produção, `console.error` é o único mecanismo de detecção de falhas. Não há alertas, não há tracing, não há health monitoring.
3. **Evolution API externa obrigatória** — sem servidor Evolution API próprio (custo, manutenção, risco de bloqueio WhatsApp), o produto não funciona.

---

## O QUE VALE MANTER

- Todo o domínio de negócio: schema de 31 tabelas, lógica de isolamento por empresa, triggers de bootstrap
- Frontend React 19 + TanStack Router + shadcn/ui — robusto, bem estruturado
- Lógica de autorização por camadas (owner/admin/atendente + super_admin)
- Integração Evolution API (WhatsApp Gateway)
- Sistema de campanhas com worker autenticado e idempotência
- Webhooks de billing multi-provider (Kiwify, Cakto, Perfectpay)
- Sistema de créditos de IA com ledger de auditoria
- Configuração de agente de IA (Gemini default, OpenAI/Anthropic opcionais)

---

## O QUE PRECISA SER SUBSTITUÍDO

- `@blinkdotnew/sdk` → `@supabase/supabase-js` real
- `src/blink/client.ts` e `src/blink/backend.ts` → chamadas diretas ao Supabase
- `src/integrations/supabase/compat.ts` → cliente Supabase real
- Backend hosting: Cloudflare Workers via Blink → Vercel Edge ou Hono/Node
- Banco: SQLite Blink → PostgreSQL (Supabase)
- Auth: Blink Auth → Supabase Auth/GoTrue

---

## PRÓXIMA AÇÃO RECOMENDADA

Antes de qualquer decisão de adoção, validar uma hipótese comercial:

> "Existe demanda real de clientes Marvin por um produto de atendimento WhatsApp + IA a R$97–197/mês, que a Marvin operaria como SaaS white-label?"

Se SIM → iniciar migração Blink → Supabase+Vercel usando o schema do Emergent como base.  
Se NÃO → REFERENCE_ONLY.
