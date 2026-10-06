# 01 — PROVENANCE
## Auditoria: Marvin Atende (AtendeZap)

**Data:** 2026-10-06  
**Branch auditada:** `main` (HEAD: `53da509`)

---

## ORIGEM E HISTÓRIA DA PLATAFORMA

### Linha do Tempo Reconstruída

| Fase | Plataforma | Evidência |
|---|---|---|
| **Fase 1** | Lovable (plataforma no-code) | `MANUAL.md`: "Esse projeto foi desenvolvido no Lovable"; `LOVABLE_API_KEY` nas instruções de env |
| **Fase 2** | Emergent (Python/FastAPI + PostgreSQL) | `_migration/plan.json`: `"source": "emergent"`, `"portTarget": "hono"` em arquivos Python |
| **Fase 3** | Blink (Hono/TypeScript + SQLite) | `BLINK_ALUNOS.md`: validado em 16/09/2026; 32 testes passando |
| **Fase 4 (atual)** | Repo adquirido pela Marvin | Commit `53da509`: "feat: import Marvin Atende project" |

**Confiança:** CONFIRMED — evidência direta em múltiplos arquivos.

---

## NOME COMERCIAL

- **Nome no código:** `Marvin Atende` (rebrandado)  
- **Nome original:** `AtendeZap`  
- **Fonte:** `src/config/brand.ts` — `name: "Marvin Atende"` (já com rebranding); tagline: "Atendimento inteligente para WhatsApp"

O repositório foi adquirido e rebrandado antes da importação. O nome "AtendeZap" ainda aparece na documentação de operação (`BLINK_ALUNOS.md`, `EMERGENT_ALUNOS.md`).

---

## PLATAFORMAS DE DEPLOYMENT IDENTIFICADAS

### Plataforma 1 — Blink
- **Tipo:** Cloudflare Workers + Blink SDK
- **Banco:** SQLite gerenciado pelo Blink
- **Auth:** Blink Auth (JWT próprio)
- **Backend:** Hono compilado via esbuild → `backend/index.ts`
- **Status:** Versão primária (docs de validação existem)
- **Portabilidade:** BAIXA — dependência total em `@blinkdotnew/sdk`

### Plataforma 2 — Emergent
- **Tipo:** Container Linux self-hosted
- **Banco:** PostgreSQL 15
- **Auth:** GoTrue (Supabase-compatible)
- **Backend:** FastAPI (Python) → migrado para Hono
- **Status:** Versão para alunos replicarem
- **Portabilidade:** ALTA — stack aberta

### Plataforma 3 — Lovable (obsoleta)
- **Tipo:** Plataforma no-code / IA builder
- **Status:** Origem histórica; não operacional; documentado apenas
- **Evidência:** `MANUAL.md` instrui criação manual de conexões da plataforma Lovable

---

## ARQUIVO `_migration/plan.json`

```
source: "emergent"
portTarget: "hono"
```

Confirma que:
1. O projeto **originou no Emergent** (Python/FastAPI)
2. Foi migrado para Blink com backend em Hono/TypeScript
3. Arquivos Python legados ainda existem no repo como artefatos de migração

---

## PROVENIÊNCIA DO SCHEMA

O schema de 31 tabelas existe em duas formas:
- `scripts/native/schema.sql` — SQLite (Blink)
- `setup/bootstrap.sql` + Emergent platform — PostgreSQL (via PostgREST)

Ambos representam o mesmo modelo de negócio. A lógica de isolamento multi-tenant (`scope()`) foi portada fielmente.

---

## HARDCODED FALLBACKS NO CLIENTE

`src/blink/client.ts` contém IDs hardcoded como fallback:
```typescript
projectId: import.meta.env.VITE_BLINK_PROJECT_ID || 'proj_fallback_xyz'
```
Estes são valores do template original do AtendeZap. Em um deploy com env vars não configuradas, o app se conectaria ao projeto original do vendedor.

**Risco:** MEDIUM — requer config correta para não vazar dados do tenant original.

---

## COMMIT HISTORY

Apenas 1 commit no repositório adquirido: `53da509 feat: import Marvin Atende project`

Histórico git anterior (do AtendeZap original) não foi preservado na importação. Decisões de design, iterações de produto e histórico de segurança anteriores **não estão acessíveis via git log**.

---

## SUMMARY

O sistema tem três fases de vida: Lovable (no-code) → Emergent (Python/FastAPI + PostgreSQL) → Blink (Hono/TypeScript + SQLite). A Marvin adquiriu o produto já na fase Blink, com o repositório importado como commit único. A fase Emergent prova que o sistema já funcionou com stack aberta, o que é o caminho de migração recomendado.
