# 10 — FINANCIAL VIABILITY
## Auditoria: Marvin Atende (AtendeZap)

**Data:** 2026-10-06  
**Branch auditada:** `main` (HEAD: `53da509`)

---

## AVISO

**Todos os números neste arquivo são estimativas baseadas em benchmarks de mercado público e estrutura do código. Nenhum dado financeiro real foi fornecido pelo vendedor ou encontrado no repositório. Classificação: INFERRED.**

---

## MODELO DE RECEITA

O produto opera como SaaS com cobrança por empresa (tenant):

| Plano | Preço/mês | Limite implícito |
|---|---|---|
| Starter | R$97 | Básico |
| Pro | R$197 | Mais usuários/features |
| Business | R$497 | Volume / white-label |

**Fonte:** `scripts/native/bootstrap.sql` — estes valores estão seedados no banco e representam a precificação original do AtendeZap.

---

## CUSTOS DE MIGRAÇÃO (ESTIMADOS)

### Desenvolvimento

| Fase | Esforço | Custo estimado (dev sênior R$15k-20k/mês) |
|---|---|---|
| Auth migration (Blink → Supabase) | 1-2 semanas | R$7.5k - R$15k |
| Database migration (SQLite → PostgreSQL) | 2-3 semanas | R$15k - R$22.5k |
| AI gateway migration | 0.5 semana | R$3.75k - R$5k |
| Backend hosting (→ Vercel/Node) | 1-2 semanas | R$7.5k - R$15k |
| QA e testes | 1-2 semanas | R$7.5k - R$15k |
| **Total** | **4-6 semanas** | **~R$40k - R$72k** |

---

## CUSTOS OPERACIONAIS MENSAIS (ESTIMADOS, POR 50 EMPRESAS)

| Componente | Custo/mês estimado | Notas |
|---|---|---|
| Supabase (banco + auth) | R$150-500 | Pro plan; escala com volume |
| Vercel (hosting) | R$100-300 | Pro plan; escala com requests |
| Evolution API (self-hosted, VPS) | R$100-300 | 1-2 VPS DigitalOcean/Hetzner |
| Gemini API (LLM) | R$200-800 | Depende do uso dos clientes |
| Total infra | **R$550-1.900/mês** | Para ~50 empresas ativas |

**Custo por empresa:** R$11-38/mês de infra para base de 50 empresas.

---

## UNIT ECONOMICS (ESTIMADOS)

| Métrica | Estimativa | Premissa |
|---|---|---|
| ARPU (Average Revenue Per User) | R$130/mês | Mix de planos |
| COGS (infra + suporte) | R$30-50/mês/empresa | Inclui Evolution + LLM |
| Gross Margin | ~65-75% | Típico de SaaS |
| CAC payback | 3-6 meses | Via canal Marvin (baixo CAC) |
| Churn mensal esperado | 3-8% | Segmento micro-empresa; alto churn típico |

---

## BREAK-EVEN (ESTIMADO)

Assumindo:
- Custo de migração: R$50k (ponto médio)
- Custo operacional: R$1.200/mês (50 empresas)
- Headcount suporte: 1 pessoa 1/4 tempo = R$1.500/mês
- Total mensal de overhead: R$2.700/mês

**Break-even de desenvolvimento:**
- Receita por empresa: R$130/mês × margem 70% = R$91/mês contribuição
- Para cobrir R$50k de desenvolvimento: ~550 empresa-meses = ~11 empresas por 4 anos, ou 50 empresas em ~11 meses

**Break-even operacional:**
- 30+ empresas pagando cobrem o overhead mensal de operação

---

## PROJEÇÃO DE RECEITA (CENÁRIOS)

| Cenário | Empresas (12 meses) | Receita anual bruta |
|---|---|---|
| Pessimista | 30 | R$46.800 |
| Base | 100 | R$156.000 |
| Otimista | 300 | R$468.000 |

**Premissa:** distribuição via canal Marvin com conversão de 2-5% da base de alunos.

---

## RISCOS FINANCEIROS

### Risco 1: LLM Costs Escalation
Custos de LLM são variáveis e dependem do uso dos clientes. Um cliente "heavy user" de IA pode consumir R$20-50/mês em tokens, destruindo a margem daquele tenant.

**Mitigação:** Sistema de créditos já implementado — limitar créditos por plano.

### Risco 2: Evolution API Instabilidade
Bloqueio de números WhatsApp pode causar churn em cascata. Eventos de instabilidade da Evolution API afetam toda a base de clientes simultaneamente.

**Mitigação:** SLA claro de que WhatsApp é infraestrutura não garantida; diversificação de provider.

### Risco 3: Ticket Médio Baixo × Alto Suporte
Micro-empresas têm alto consumo de suporte. R$97/mês não sustenta suporte 1:1.

**Mitigação:** Self-service obrigatório; vídeo-aulas de onboarding; comunidade de usuários.

### Risco 4: Custo Blink Desconhecido
Não foi possível identificar o custo atual da conta Blink onde o produto roda. Se a conta Blink for desligada ou o custo for significativo, há impacto imediato.

**Mitigação:** Migrar do Blink é a recomendação principal deste relatório.

---

## RETORNO DE INVESTIMENTO

Para um investimento de R$50-72k em migração:

| Retorno | Condição |
|---|---|
| ROI positivo em 12 meses | 100+ empresas pagando |
| ROI positivo em 18 meses | 70+ empresas pagando |
| ROI negativo | < 50 empresas em 18 meses |

**Recomendação:** Validar com 10 clientes pagantes (R$0 desenvolvimento) antes de comprometer o investimento de migração.

---

## SUMMARY

[Chutando em partes] Os números são estimativas baseadas em benchmarks de mercado, não em dados reais do negócio. A viabilidade financeira é plausível se o canal de distribuição Marvin converter bem. O produto tem unit economics positivos em escala de 50-100 empresas — alcançável via base de alunos Marvin. O risco principal não é o modelo de negócio, é a validação da demanda real.
