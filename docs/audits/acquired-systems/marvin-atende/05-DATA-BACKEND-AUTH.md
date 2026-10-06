# 05 — DATA, BACKEND & AUTH
## Auditoria: Marvin Atende (AtendeZap)

**Data:** 2026-10-06  
**Branch auditada:** `main` (HEAD: `53da509`)

---

## BANCO DE DADOS

### Versão Blink (SQLite)

**Schema:** `scripts/native/schema.sql` — 31 tabelas.

**Características:**
- Todas as PKs são TEXT (UUIDs como strings), não SERIAL/BIGSERIAL
- Sem FK constraints declaradas no SQLite (validação implícita na aplicação)
- Trigger `native_company_defaults` bootstrapa empresa no INSERT:
  - 4 estágios CRM padrão (Novo Lead, Em Atendimento, Aguardando, Fechado)
  - 1 `agent_config` padrão
  - Créditos iniciais configuráveis

**Banco gerenciado pelo Blink:** sem acesso direto ao arquivo SQLite, sem dumps, sem backup self-managed visível.

### Versão Emergent (PostgreSQL)

**Bootstrap:** `setup/bootstrap.sql` — cria roles Supabase-compatíveis:
- `anon`, `authenticated`, `service_role`, `authenticator`, `supabase_auth_admin`
- Schema `auth` ownership no GoTrue
- Publicação `supabase_realtime` stub

**RLS:** declarado em arquivos de setup. Políticas por empresa.

**Realtime:** desabilitado por padrão na versão Emergent (`VITE_REALTIME_ENABLED=false`). Polling fallback implementado.

---

## ISOLAMENTO MULTI-TENANT

### Mecanismo Principal: `scope()`

```typescript
// server/native/database.ts
scope(companyId: string) {
  this.currentScope = companyId;
  return this;
}
```

Todas as queries passam por:
```typescript
WHERE company_id = :currentScope
```

**Escopo de proteção:** todas as 31 tabelas têm `company_id`. O scope é aplicado na classe `Database`, não apenas no middleware HTTP — o que significa que mesmo chamadas internas respeitam o isolamento.

### Tabelas Read-Only para Atendentes

As tabelas sensíveis têm write protegida:
- `company_user` — não pode ser modificada por atendente
- `user_roles` — apenas owner/admin podem alterar
- `subscription` — apenas sistema pode alterar
- `credit_ledger` — append-only via função de negócio

### Campos Protegidos

O `Database` class filtra campos sensíveis de SELECT responses:
- `openai_api_key`
- `anthropic_api_key`
- `access_token`
- `refresh_token`
- `evolution_api_key`

**Estes campos nunca aparecem em respostas de query** — apenas a camada de backend os lê diretamente via função específica.

---

## BACKEND (HONO)

### Estrutura de Rotas

```
server/index.ts
├── /health                    GET — liveness (sem auth)
├── /api/bootstrap             POST — criação de empresa (auth obrigatória)
├── /api/query                 POST — leitura genérica com scope
├── /api/rpc                   POST — funções de negócio (allowlist)
├── /api/database-operation    POST — escrita com scope
└── public/                    — webhooks externos (Evolution, billing)
```

### Middleware de Autenticação

```typescript
// server/native/context.ts
const token = request.headers.get('Authorization')?.split('Bearer ')[1];
const user = await blink.auth.verifyToken(token);
if (!user) return Response.json({error: 'Unauthorized'}, {status: 401});
```

Auth verificada em todas as rotas exceto `/health` e rotas públicas de webhook.

### RPC Allowlist (70 funções)

Todas as chamadas de negócio passam por verificação explícita:
```typescript
const ALLOWED_RPC = new Set([
  'createLead', 'updateLead', 'moveLead', ...70 funções
]);
if (!ALLOWED_RPC.has(functionName)) {
  return Response.json({error: 'Not allowed'}, {status: 403});
}
```

**Proteção adicional:** mesmo que um atacante envie um nome de função válido, o scope de company_id é enforçado na execução.

### CORS

```typescript
app.use('*', cors({origin: '*'}))
```

CORS aberto — qualquer origem pode chamar o backend. Risco P1 (documentado em `06-SECURITY-PRIVACY.md`).

---

## AUTENTICAÇÃO

### Versão Blink

| Operação | Mecanismo |
|---|---|
| Login | `blink.auth.signInWithEmail(email, password)` |
| Registro | `blink.auth.signUp(email, password)` |
| Verificação | `blink.auth.verifyToken(token)` |
| Logout | `blink.auth.signOut()` |
| Refresh | Gerenciado pelo SDK |
| Auth state | `blink.auth.onAuthStateChanged(callback)` |

**Compat layer:** `src/integrations/supabase/client.ts` expõe interface Supabase, mas internamente chama Blink. Frontend nunca chama Blink diretamente — sempre via compat layer. Isso facilita migração futura.

### Versão Emergent

- GoTrue self-hosted (porta 9999)
- JWT tokens compatíveis com Supabase
- Email/senha padrão; magic link configurável

### Roles e Autorização

```
super_admin  → acesso cross-tenant (operador Marvin)
owner        → todas as operações dentro da empresa
admin        → gestão de equipe e configurações
atendente    → atendimento, CRM limitado
```

Roles verificadas em runtime via tabela `user_roles`. A lógica está em `domain.ts` — cada função RPC verifica o role do usuário antes de executar.

---

## STORAGE

**Blink:** Storage gerenciado pelo SDK (armazenamento de arquivos via `blink.storage`). Sem evidência de uso extensivo no código auditado.

**Emergent:** Não identificado storage dedicado além do PostgreSQL. Uploads de mídia do WhatsApp presumivelmente passam pela Evolution API.

**Risco:** MEDIUM — sem storage strategy clara para mídia de conversas em produção.

---

## LEDGER DE CRÉDITOS IA

Implementação robusta:
- Tabela `credit_ledger` é append-only (sem UPDATE/DELETE permitido)
- Cada uso de IA debita do saldo da empresa
- Saldo agregado via `credit_balance` (materialized ou calculado)
- Auditoria completa: quem usou, quando, quanto, qual modelo

---

## SUMMARY

Isolamento multi-tenant robusto com `scope()` enforçado na camada de dados. Auth completamente gerenciada pelo Blink SDK — ponto de falha único mas bem abstraído via compat layer. A compat layer Supabase facilita migração para GoTrue real. Campos sensíveis protegidos no Database class. Principal gap: CORS aberto e ausência de backup strategy visível para o banco Blink.
