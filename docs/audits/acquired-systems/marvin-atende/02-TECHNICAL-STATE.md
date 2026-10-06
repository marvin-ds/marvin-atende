# 02 — TECHNICAL STATE
## Auditoria: Marvin Atende (AtendeZap)

**Data:** 2026-10-06  
**Branch auditada:** `main` (HEAD: `53da509`)

---

## AUDIT-TECHNICAL-STATE RESULT

```
SCOPE: Repositório completo marvin-ds/marvin-atende
GIT_BRANCH: main
GIT_HEAD: 53da509
DATE: 2026-10-06
```

---

## BUILD

| Etapa | Status | Tempo | Comando |
|---|---|---|---|
| `npm install` | PASS | — | deps instaladas |
| `npm run build` (frontend) | PASS | 10.94s | TanStack Start + Vite 7 |
| `npm run build:backend` | NÃO EXECUTADO | — | requer esbuild; AUDIT_FIRST |
| `node scripts/native/port-domain.mjs` | NÃO EXECUTADO | — | gera domain.ts; AUDIT_FIRST |

**Confiança:** CONFIRMED (frontend build executado; backend inferido de docs)

---

## TESTES AUTOMATIZADOS

| Arquivo | Status | Bloqueio |
|---|---|---|
| `tests/database.test.mjs` | BLOCKED | `./database.bundle.mjs` ausente |
| `tests/domain.test.mjs` | BLOCKED | `./domain.bundle.mjs` ausente |

Os bundles de teste são artefatos de build gerados por `port-domain.mjs`. Não foram commitados no repositório. A lógica dos testes foi revisada inline — cobre: escopo multi-tenant, bloqueio de cross-company write, SQL injection prevention, RBAC.

**`BLINK_ALUNOS.md` afirma:** "32 testes automatizados passando" (validado em 16/09/2026).

---

## SEGURANÇA DE DEPENDÊNCIAS

```
npm audit: 1 vulnerabilidade HIGH
Pacote: source-map-js
Severidade: HIGH
```

Detalhe completo em `06-SECURITY-PRIVACY.md`.

---

## MÓDULOS — CLASSIFICAÇÃO

```
MODULES:
  Frontend / React:                EXISTS
    src/components/                EXISTS
    src/pages/                     EXISTS
    src/routes/                    EXISTS
    src/hooks/                     EXISTS
    src/store/                     EXISTS

  Backend / Hono:                  EXISTS
    server/index.ts                EXISTS
    server/native/context.ts       EXISTS
    server/native/database.ts      EXISTS
    server/native/domain.ts        EXISTS (gerado)
    server/native/sql-adapter.ts   EXISTS

  Blink Integration:               EXISTS
    src/blink/client.ts            EXISTS
    src/blink/backend.ts           EXISTS
    src/integrations/supabase/     EXISTS

  Scripts / Build:                 EXISTS
    scripts/native/schema.sql      EXISTS
    scripts/native/bootstrap.sql   EXISTS
    scripts/native/security-policy.json  EXISTS
    scripts/native/port-domain.mjs EXISTS

  Emergent Platform:               EXISTS
    setup/install.sh               EXISTS
    setup/bootstrap.sql            EXISTS
    setup/gotrue.yaml              EXISTS
    setup/postgrest.conf           EXISTS

  Tests:                           EXISTS_INCOMPLETE
    tests/database.test.mjs        EXISTS
    tests/domain.test.mjs          EXISTS
    tests/database.bundle.mjs      MISSING (artefato de build)
    tests/domain.bundle.mjs        MISSING (artefato de build)

  Migration Artifacts:             EXISTS
    _migration/plan.json           EXISTS
    _migration/ (arquivos Python)  EXISTS

  CI/CD:                           MISSING
  Dockerfile:                      MISSING
  .github/workflows/:              MISSING
```

---

## DISCREPANCIES_VS_CURRENT_MD

```
CURRENT.md: AUSENTE no repositório
```

O repositório não contém `CURRENT.md`. Não é possível verificar discrepâncias. O estado operacional foi inferido dos arquivos `BLINK_ALUNOS.md` e `EMERGENT_ALUNOS.md`.

---

## STACK COMPLETA

### Frontend
| Tecnologia | Versão | Papel |
|---|---|---|
| React | 19.1.0 | UI framework |
| TanStack Start | 1.167.50 | SSR + routing |
| TanStack Router | via Start | Client routing |
| Vite | 7.3.1 | Build tool |
| Tailwind CSS | 4.2.1 | Styling |
| shadcn/ui | — | Component library |
| Radix UI | — | Primitives |
| Zustand | — | State management |
| TanStack Query | — | Data fetching |
| lucide-react | — | Icons |

### Backend
| Tecnologia | Versão | Papel |
|---|---|---|
| Hono | 4.13.8 | HTTP framework |
| TypeScript | — | Linguagem |
| esbuild | — | Compilação para Workers |
| @blinkdotnew/sdk | ^2.9.0 | Auth + DB + AI (Blink) |
| @noble/hashes | ^2.4.0 | HMAC-SHA256 |
| qrcode | — | QR code geração |

### Banco de Dados
| Plataforma | Banco | Driver |
|---|---|---|
| Blink | SQLite (gerenciado) | `blink.db` via SDK |
| Emergent | PostgreSQL 15 | PostgREST (auto REST) |

### Integrações Externas
| Serviço | Tipo | Obrigatoriedade |
|---|---|---|
| Evolution API v2 | WhatsApp Gateway | OBRIGATÓRIA |
| Gemini (Google AI) | LLM padrão | OBRIGATÓRIA (IA) |
| OpenAI | LLM alternativa | OPCIONAL |
| Anthropic | LLM alternativa | OPCIONAL |
| Kiwify / Cakto / Perfectpay | Billing webhooks | OPCIONAL (monetização) |
| Google Calendar | Agendamento | OPCIONAL |

---

## SUMMARY

Build do frontend passa. Backend requer build step não executado por constraint AUDIT_FIRST. Testes estão BLOCKED por ausência de bundles pré-compilados. Stack técnica é moderna e bem estruturada — React 19, TanStack, Hono. Principal risco técnico é a dependência total do Blink SDK para auth, banco e AI na versão primária.
