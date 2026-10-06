# 11 — RISKS & GAPS
## Auditoria: Marvin Atende (AtendeZap)

**Data:** 2026-10-06  
**Branch auditada:** `main` (HEAD: `53da509`)

---

## REGISTRO COMPLETO DE RISCOS

### RISCO 1 — Lock-in Blink [CRÍTICO]

**Categoria:** Dependência de Plataforma  
**Probabilidade:** ALTA (o risco existe hoje, não é hipotético)  
**Impacto:** CATASTRÓFICO — sistema para completamente  
**Status:** ATIVO

**Descrição:** Toda a camada de autenticação, banco de dados e AI gateway depende do `@blinkdotnew/sdk`. Se a conta Blink for desligada, o produto morre. Não há fallback.

**Evidência:** `server/native/context.ts` — `createClient({projectId: env.BLINK_PROJECT_ID, secretKey: env.BLINK_SECRET_KEY})`. Sem estas credenciais válidas e com o serviço Blink ativo, autenticação e banco são inacessíveis.

**Mitigação:** Migração para Supabase+Vercel (detalhada em `07-PORTABILITY.md`). Esforço M-L.

---

### RISCO 2 — Sem Observabilidade [ALTO]

**Categoria:** Operações  
**Probabilidade:** N/A (gap existente)  
**Impacto:** ALTO — falhas em produção são invisíveis  
**Status:** ATIVO

**Descrição:** Toda a detecção de erros em produção depende de `console.error`. Não há:
- Alertas automáticos
- Distributed tracing
- Health monitoring com threshold
- Dashboards de status
- Log estruturado com search

**Impacto prático:** Um bug afetando 20% dos tenants pode ficar horas sem ser detectado.

**Mitigação:** Sentry (erro tracking) + Grafana/Datadog (métricas). Implementável em 1-2 dias.

---

### RISCO 3 — Evolution API Externa Obrigatória [ALTO]

**Categoria:** Dependência Externa  
**Probabilidade:** MÉDIA (instabilidades são comuns)  
**Impacto:** ALTO — produto não funciona sem WhatsApp  
**Status:** ATIVO

**Descrição:** Sem servidor Evolution API rodando e saudável, atendimento via WhatsApp é impossível. A Marvin precisará:
1. Hospedar infra Evolution API própria
2. Gerenciar sessões por tenant
3. Monitorar saúde das instâncias
4. Lidar com bans e reconexões

**Mitigação:** SLA realista com clientes; monitoring de instâncias Evolution; processo documentado de recuperação de ban.

---

### RISCO 4 — Testes Bloqueados [MÉDIO]

**Categoria:** Qualidade de Engenharia  
**Probabilidade:** N/A (estado atual)  
**Impacto:** MÉDIO — regressões em mudanças de código  
**Status:** ATIVO

**Descrição:** Os dois arquivos de teste (`database.test.mjs`, `domain.test.mjs`) requerem bundles pré-compilados (`database.bundle.mjs`, `domain.bundle.mjs`) que não existem no repositório.

**Impacto:** Qualquer mudança de código não pode ser validada automaticamente sem antes executar o processo de build.

**Mitigação:** Commitar bundles no repo ou adicionar build step ao CI; resolver em 1 dia de trabalho.

---

### RISCO 5 — CORS Aberto [P1 Segurança] [MÉDIO-ALTO]

**Categoria:** Segurança  
**Probabilidade:** ALTA (qualquer origem já pode acessar)  
**Impacto:** MÉDIO (requer JWT válido para exploração real)  
**Status:** ATIVO

**Descrição:** `cors({origin: '*'})` — qualquer domínio pode fazer chamadas ao backend.

**Mitigação:** Restringir origin ao domínio do frontend. Fix de 5 minutos.

---

### RISCO 6 — Backup de Banco Blink [MÉDIO]

**Categoria:** Continuidade de Negócio  
**Probabilidade:** DESCONHECIDA  
**Impacto:** ALTO — perda de dados de clientes  
**Status:** UNKNOWN

**Descrição:** O banco SQLite é gerenciado pelo Blink. Não foi possível verificar se há backup automático, exportação periódica ou SLA de durabilidade de dados.

**Mitigação:** Verificar SLA de dados do Blink; implementar export periódico via API se disponível.

---

### RISCO 7 — Ausência de CI/CD [MÉDIO]

**Categoria:** Engenharia  
**Probabilidade:** N/A (gap existente)  
**Impacto:** MÉDIO — deploys manuais, sem gate de qualidade  
**Status:** ATIVO

**Descrição:** Nenhum arquivo `.github/workflows/` identificado. Deploys são manuais.

**Mitigação:** GitHub Actions básico (build + test + deploy) — 1-2 dias de setup.

---

### RISCO 8 — Compliance LGPD [MÉDIO]

**Categoria:** Legal / Regulatório  
**Probabilidade:** BAIXA-MÉDIA a curto prazo  
**Impacto:** ALTO se acionado  
**Status:** ATIVO

**Descrição:** Gaps identificados:
- Sem mecanismo de exclusão de dados de titular (Art. 18)
- Sem política de retenção de mensagens
- Sem DPA com Evolution API

**Mitigação:** Implementar endpoint de exclusão de dados; documentar política de retenção; obter DPA do provider Evolution API ou substituir.

---

### RISCO 9 — Hardcoded Fallback IDs [BAIXO-MÉDIO]

**Categoria:** Segurança / Configuração  
**Probabilidade:** BAIXA (requer misconfiguration)  
**Impacto:** MÉDIO (vazamento para tenant errado)  
**Status:** LATENTE

**Mitigação:** Remover fallbacks hardcoded em `src/blink/client.ts`.

---

### RISCO 10 — WhatsApp Policy Risk [BAIXO] 

**Categoria:** Plataforma  
**Probabilidade:** BAIXA (mas acontece)  
**Impacto:** ALTO se ocorrer  
**Status:** LATENTE

**Descrição:** Meta/WhatsApp pode banir números que usam automação (especialmente via Evolution API unofficial). Um ban em massa afetaria todos os tenants simultaneamente.

**Mitigação:** Migrar para WhatsApp Business API oficial à medida que a base escala.

---

## GAPS TÉCNICOS PRIORIZADOS

| # | Gap | Esforço de Resolução | Prioridade |
|---|---|---|---|
| 1 | Migração Blink → Supabase | 4-6 semanas | CRÍTICA |
| 2 | Observabilidade (Sentry + métricas) | 1-2 dias | ALTA |
| 3 | CORS fix | 5 minutos | ALTA |
| 4 | CI/CD básico | 1-2 dias | MÉDIA |
| 5 | Bundles de teste commitados | 1 dia | MÉDIA |
| 6 | Backup strategy banco | 1-2 dias pesquisa | MÉDIA |
| 7 | LGPD — endpoint de exclusão | 2-3 dias | MÉDIA |
| 8 | Remover hardcoded IDs | 30 minutos | BAIXA |
| 9 | npm audit fix | 1 hora | BAIXA |

---

## SUMMARY

10 riscos registrados: 1 Crítico (lock-in Blink), 2 Altos (observabilidade, Evolution API), 4 Médios, 3 Baixos. Nenhum risco P0 de segurança. Os riscos são conhecidos, documentados e mitigáveis. O risco crítico (Blink lock-in) tem caminho de migração claro e esforço quantificado.
