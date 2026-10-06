# 04 — DEPENDENCIES
## Auditoria: Marvin Atende (AtendeZap)

**Data:** 2026-10-06  
**Branch auditada:** `main` (HEAD: `53da509`)

---

## DEPENDÊNCIAS CRÍTICAS (Runtime)

### `@blinkdotnew/sdk` — RISCO ALTO
- **Versão:** `^2.9.0`
- **Papel:** Auth + Database (SQLite) + AI gateway + Backend hosting
- **Lock-in:** TOTAL — sem esta dependência, autenticação, banco e backend param
- **Substituição:** Supabase JS SDK (`@supabase/supabase-js`) + GoTrue auth
- **Esforço de substituição:** M-L (semanas, não meses)

### `hono` — RISCO BAIXO
- **Versão:** `4.13.8`
- **Papel:** HTTP framework do backend
- **Portabilidade:** Alta — roda em Node, Cloudflare Workers, Deno, Bun
- **Dependência de plataforma:** Nenhuma

### `react` + `react-dom` — RISCO BAIXO
- **Versão:** `19.1.0`
- **Papel:** UI framework
- **Notas:** React 19 é versão recente; API estável, sem breaking changes esperados de curto prazo

### `@tanstack/start` — RISCO MÉDIO
- **Versão:** `1.167.50`
- **Papel:** SSR framework + routing
- **Notas:** TanStack Start ainda em fase de estabilização (v1). Pode ter breaking changes em minor versions.

### `@noble/hashes` — RISCO BAIXO
- **Versão:** `^2.4.0`
- **Papel:** HMAC-SHA256 para assinatura de webhooks e billing
- **Notas:** Biblioteca auditada de criptografia; sem dependências; bem mantida

---

## DEPENDÊNCIAS DE UI

| Pacote | Papel | Risco |
|---|---|---|
| `@radix-ui/*` | Primitivos acessíveis | BAIXO |
| `tailwindcss` v4 | CSS utility | BAIXO |
| `lucide-react` | Ícones | BAIXO |
| `class-variance-authority` | Variantes de componente | BAIXO |
| `clsx` / `tailwind-merge` | Utilitários CSS | BAIXO |

---

## DEPENDÊNCIAS DE DADOS/STATE

| Pacote | Papel | Risco |
|---|---|---|
| `@tanstack/react-query` | Server state cache | BAIXO |
| `zustand` | Client state | BAIXO |
| `react-hook-form` | Formulários | BAIXO |
| `zod` | Validação de schema | BAIXO |

---

## DEPENDÊNCIAS DE BUILD

| Pacote | Papel | Risco |
|---|---|---|
| `vite` v7 | Build frontend | BAIXO |
| `esbuild` | Bundle backend | BAIXO |
| `typescript` | Linguagem | BAIXO |

---

## VULNERABILIDADES NPM AUDIT

```
Vulnerabilidades encontradas: 1
Severidade: HIGH
Pacote afetado: source-map-js
```

`source-map-js` é uma dependência transitiva de ferramentas de build (Vite/esbuild). Não é executado em produção — afeta apenas o ambiente de desenvolvimento/build.

**Risco efetivo:** BAIXO-MÉDIO (dependência de build, não runtime).  
**Ação recomendada:** `npm audit fix` após encerramento da fase de auditoria.

---

## DEPENDÊNCIAS EXTERNAS (SERVIÇOS)

| Serviço | Tipo | Gerenciamento | Custo estimado |
|---|---|---|---|
| **Blink** | Plataforma PaaS | Conta Blink (vendedor?) | DESCONHECIDO |
| **Evolution API v2** | WhatsApp Gateway | Self-hosted obrigatório | Infra + manutenção |
| **Gemini (Google AI)** | LLM | Chave por empresa | Pay-per-token |
| **OpenAI** (opcional) | LLM | Chave por empresa | Pay-per-token |
| **Anthropic** (opcional) | LLM | Chave por empresa | Pay-per-token |
| **Kiwify/Cakto/Perfectpay** | Billing | Webhook externo | % da transação |

---

## DEPENDÊNCIAS DE RUNTIME NÃO-NPM

### Plataforma Emergent
- PostgreSQL 15 (instalado via `setup/install.sh`)
- GoTrue (binário baixado pelo installer)
- PostgREST (binário baixado pelo installer)
- Supervisor (process manager Linux)
- Node.js 22 (instalado via NVM)

### Plataforma Blink
- Cloudflare Workers (infra Blink)
- SQLite (gerenciado pelo SDK)
- Edge runtime compatível com browser APIs

---

## AVALIAÇÃO DE PORTABILIDADE DE DEPENDÊNCIAS

```
Dependências portáveis (sem lock-in):      ~90% do total
Dependências com lock-in (Blink):           ~3 pacotes centrais
Dependências de serviço externo obrigatório: Evolution API
Dependências de serviço externo opcional:   LLM providers, billing
```

A carga de dependências é razoável para a complexidade do sistema. O lock-in é concentrado e substituível.

---

## SUMMARY

Dependências bem escolhidas para a maioria das funcionalidades. O único lock-in crítico é `@blinkdotnew/sdk`, que é profundo mas concentrado. A única vulnerabilidade HIGH é em dependência de build (não runtime). Evolution API como dependência externa obrigatória é o segundo maior risco operacional.
