# 08 — FUNCTIONAL AUDIT
## Auditoria: Marvin Atende (AtendeZap)

**Data:** 2026-10-06  
**Branch auditada:** `main` (HEAD: `53da509`)

---

## MÓDULOS FUNCIONAIS

### 1. Atendimento WhatsApp

**Status:** EXISTS  
**Evidência:** `conversation`, `message` tables; Evolution API integration; webhook handlers

**Funcionalidades identificadas:**
- Inbox de conversas por empresa
- Atribuição de atendente por conversa
- Histórico de mensagens (texto, mídia via Evolution API)
- Pausa de contato (`contact_pause` table)
- CSAT (Customer Satisfaction) ao fechar conversa

**Dependência crítica:** Evolution API v2. Sem servidor Evolution rodando, atendimento é não-funcional.

---

### 2. CRM Kanban

**Status:** EXISTS  
**Evidência:** `crm_stage`, `crm_card`, `lead`, `lead_nota`, `lead_evento` tables; RPC functions `moveLead`, `createLead`, `updateLead`

**Funcionalidades identificadas:**
- Estágios configuráveis por empresa (default: 4 estágios)
- Leads com notas e eventos
- Movimentação entre estágios (com tracking de histórico)
- Integração CRM ↔ Atendimento (lead criado a partir de contato)

---

### 3. Agente IA

**Status:** EXISTS  
**Evidência:** `agent_config` table; `src/lib/lovable-ai.server.ts`; `ai_session` table; credit_ledger

**Funcionalidades identificadas:**
- Configuração de persona por empresa (`agent_config`)
- Suporte a Gemini (padrão), OpenAI e Anthropic
- Histórico de sessões de IA por conversa
- Sistema de créditos com ledger de auditoria
- Saldo de créditos por empresa

**Configuração do agente:** nome, personalidade, instruções, modelo, temperatura

---

### 4. Campanhas em Massa

**Status:** EXISTS  
**Evidência:** `campaign`, `campaign_contact`, `campaign_job` tables; worker com reservation atômica

**Funcionalidades identificadas:**
- Criação de campanha com lista de contatos
- Worker de envio com atomic job reservation (sem duplicação)
- Idempotência por `campaign_job_id`
- Status de cada mensagem da campanha
- Agendamento de envio

**Arquitetura do worker:** reserva atômica via SQL (`UPDATE ... WHERE status='pending' LIMIT 1 RETURNING *`) — pattern correto para concorrência.

---

### 5. Gestão de Equipe

**Status:** EXISTS  
**Evidência:** `company_user`, `user_roles`, `team_metric`, `attendance_report` tables

**Funcionalidades identificadas:**
- Multi-usuário por empresa
- Roles: owner, admin, atendente
- Métricas de equipe (tempo de resposta, volume)
- Relatório de atendimento

---

### 6. Financeiro e Billing

**Status:** EXISTS  
**Evidência:** `payment`, `invoice` tables; `subscription`, `plan` tables; webhook handlers para Kiwify/Cakto/Perfectpay

**Funcionalidades identificadas:**
- Planos configurados: Starter R$97/mês, Pro R$197/mês, Business R$497/mês
- Billing via webhooks de plataformas externas
- HMAC-SHA256 verification nos webhooks recebidos
- Checkout com idempotência (testado em `domain.test.mjs`)

---

### 7. Agendamento

**Status:** EXISTS  
**Evidência:** `agendamento`, `calendar_config` tables; Google Calendar integration

**Funcionalidades identificadas:**
- Agendamento de compromissos via chat
- Integração Google Calendar (configurável por empresa)
- Confirmação/cancelamento de agendamentos

---

### 8. Relatórios

**Status:** EXISTS_INCOMPLETE  
**Evidência:** `attendance_report`, `team_metric` tables presentes; frontend de relatórios inferido

**Funcionalidades identificadas:** estrutura de dados existe; UI de relatórios não auditada em detalhe.

---

### 9. Templates e Quick Replies

**Status:** EXISTS  
**Evidência:** `message_template`, `quick_reply` tables; RPC functions

**Funcionalidades identificadas:**
- Templates de mensagem por empresa
- Quick replies para atendentes
- Atendente com escrita limitada a próprios templates (RBAC)

---

### 10. Webhooks de Saída

**Status:** EXISTS  
**Evidência:** `webhook_config`, `webhook_log` tables; `src/lib/webhooks.server.ts`

**Funcionalidades identificadas:**
- 6 tipos de evento: `message.received`, `message.sent`, `lead.created`, `lead.won`, `lead.lost`, `csat.responded`
- HMAC-SHA256 nos webhooks enviados
- Log de entrega

---

### 11. Multi-empresa (Super Admin)

**Status:** EXISTS  
**Evidência:** `super_admin` role; cross-tenant queries no domain.ts; `company` table

**Funcionalidades identificadas:**
- Super admin com acesso cross-tenant
- Listagem de empresas (plataforma SaaS)
- Gestão de planos e créditos por empresa

---

## LACUNAS FUNCIONAIS IDENTIFICADAS

| Lacuna | Impacto | Confiança |
|---|---|---|
| Realtime desabilitado no Emergent (polling fallback) | Latência nas notificações | CONFIRMED |
| Sem mecanismo de exclusão de dados (LGPD) | Compliance gap | CONFIRMED |
| Backup de banco Blink não auto-gerenciado | Risco operacional | INFERRED |
| Observabilidade ausente (logs estruturados, alertas) | Operação às cegas | CONFIRMED |
| CI/CD ausente | Deploy manual/frágil | CONFIRMED |

---

## QUALIDADE DE ENGENHARIA

| Aspecto | Avaliação | Evidência |
|---|---|---|
| Isolamento multi-tenant | EXCELENTE | scope() em toda query |
| RBAC | BOM | 4 roles com permissões granulares |
| Idempotência (campanhas, billing) | BOM | IDs únicos + verificação |
| Separação de concerns | BOM | Rotas / Database / Domain separados |
| Testes | INCOMPLETO | Lógica boa, bundles ausentes |
| Observabilidade | FRACO | Apenas console.error |
| Documentação técnica | MÉDIO | BLINK_ALUNOS + EMERGENT_ALUNOS |

---

## SUMMARY

O produto está funcionalmente completo para os casos de uso declarados. 10 módulos identificados e classificados como EXISTS. A lacuna mais crítica não é funcional — é operacional: sem observabilidade, sem CI/CD, sem backup estratégia. A qualidade de engenharia do core (multi-tenant, RBAC, idempotência) é acima da média para um produto de seu tipo e nível de investimento.
