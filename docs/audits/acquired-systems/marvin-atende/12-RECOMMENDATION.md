# 12 — RECOMMENDATION
## Auditoria: Marvin Atende (AtendeZap)

**Data:** 2026-10-06  
**Branch auditada:** `main` (HEAD: `53da509`)

---

## DECISÃO RECOMENDADA

```
ADAPT
```

---

## JUSTIFICATIVA

### Por que ADAPT e não REBUILD?

O sistema já provou independência de plataforma uma vez (migrou de Lovable → Emergent → Blink). A versão Emergent demonstra que a stack aberta (PostgreSQL + GoTrue + Hono) funciona. O caminho de migração do Blink para Supabase+Vercel não é reconstrução — é substituição de três pontos concentrados de lock-in com a interface já abstraída.

Reconstruir do zero desperdiçaria:
- 31 tabelas de schema validado em produção
- Lógica multi-tenant com isolamento correto
- RBAC com 4 roles e permissões granulares
- Sistema de campanhas com idempotência
- Ledger de créditos IA com auditoria completa
- Integração Evolution API funcional
- Sistema de webhooks com assinatura HMAC
- Frontend React 19 + TanStack (bem estruturado, reutilizável)

### Por que ADAPT e não REJECT?

O problema é real. O mercado existe. O domínio de negócio está bem modelado. A qualidade de engenharia do core é acima do esperado para este tipo de produto. A compat layer Supabase que já existe no código é evidência de que o autor antecipou migração futura.

REJECT seria correto se: a qualidade de código fosse má, o domínio estivesse mal modelado, ou não existisse caminho de portabilidade. Nenhuma dessas condições é verdadeira.

### Por que ADAPT e não ADOPT (imediato)?

Adoção imediata na versão Blink seria um erro operacional. A conta Blink é um ponto único de falha externo que a Marvin não controla. Antes de qualquer go-live comercial, o lock-in precisa ser resolvido.

---

## CONDIÇÃO PRÉVIA OBRIGATÓRIA

**Antes de qualquer decisão de adoção ou investimento em migração, validar:**

> "Existe demanda real de clientes Marvin por um produto de atendimento WhatsApp + IA a R$97–197/mês, que a Marvin operaria como SaaS white-label?"

**Metodologia:**
1. Survey com 100 alunos Marvin (1 semana)
2. Landing page com lista de espera (2 semanas)
3. Beta fechado com 10 clientes pagantes (4-8 semanas)

**Critério de go:**
- ≥ 10 clientes pagantes no beta → iniciar migração Blink → Supabase
- < 10 clientes → REFERENCE_ONLY (manter código, não investir em migração)

---

## PLANO DE AÇÃO (SE GO)

### Fase 0 — Validação Comercial (sem desenvolvimento)
- [ ] Survey com base Marvin
- [ ] Landing page com lista de espera
- [ ] Beta fechado com 10 clientes

### Fase 1 — Fixes Urgentes (paralelos à validação comercial)
- [ ] CORS fix: `cors({origin: '*'})` → domínio específico (30 min)
- [ ] Remover hardcoded fallback IDs (30 min)
- [ ] npm audit fix (1 hora)
- [ ] Commitar bundles de teste ou adicionar build step (1 dia)

### Fase 2 — Infraestrutura (pré-migração)
- [ ] Provisionar projeto Supabase
- [ ] Configurar Evolution API self-hosted
- [ ] Setup CI/CD básico (GitHub Actions)
- [ ] Sentry para observabilidade

### Fase 3 — Migração Técnica (se validação comercial aprovada)
- [ ] Auth: Blink Auth → Supabase Auth
- [ ] Database: SQLite Blink → PostgreSQL Supabase
- [ ] AI: blink.ai → Gemini direto
- [ ] Backend: Cloudflare Workers → Vercel Edge / Node container
- [ ] Remove backend URL hardcode

### Fase 4 — Go-Live e Operação
- [ ] Migrar beta clients para infraestrutura própria
- [ ] Documentar runbook operacional
- [ ] Definir SLA e política de suporte
- [ ] Implementar exclusão de dados (LGPD)

---

## SE NÃO-GO (REFERENCE_ONLY)

Manter o repositório como referência de implementação para:
- Padrões de multi-tenant com scope()
- Schema de CRM/atendimento validado
- Sistema de créditos com ledger
- Integração Evolution API
- Webhooks com HMAC

Nenhum investimento de migração. Acesso ao código para aprendizado e reuso de componentes.

---

## ASSETS QUE VÃO DIRETO PARA PRODUÇÃO

Independente da decisão, estes componentes podem ser reutilizados imediatamente em outros projetos Marvin:

| Asset | Uso potencial |
|---|---|
| Schema de 31 tabelas | Base para qualquer CRM/atendimento |
| `database.ts` com scope() | Padrão multi-tenant para qualquer SaaS Marvin |
| Sistema de créditos IA | Produto de IA da Marvin |
| Lógica de campanhas com idempotência | Automação de marketing |
| Billing webhooks (Kiwify/Cakto/Perfectpay) | Qualquer produto SaaS Marvin |

---

## MATRIZ DE DECISÃO

| Cenário | Recomendação |
|---|---|
| Validação comercial positiva (≥10 pagantes) | ADAPT → iniciar migração Fase 3 |
| Validação comercial negativa (< 10 pagantes) | REFERENCE_ONLY |
| Urgência de lançamento antes da validação | NÃO RECOMENDADO — risco de investimento sem demanda confirmada |

---

## SUMMARY

ADAPT é a recomendação correta. O produto tem substância técnica real, domínio bem modelado e caminho de portabilidade claro. A condição prévia é validação comercial com 10 clientes pagantes antes de qualquer investimento de migração. O único bloqueador para adoção é o lock-in Blink, que tem solução conhecida e esforço quantificado.
