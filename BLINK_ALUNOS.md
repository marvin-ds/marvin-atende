# AtendeZap na Blink — instalação da sua cópia

Modelo: https://blink.new/project/atendezap-migra-o-ly6fytdy

## Passo a passo

1. Entre na sua conta Blink com backend disponível (no teste, plano Pro).
2. Abra o modelo e escolha **Remix**. Não é necessário incluir o histórico da conversa.
3. Cole o prompt abaixo, trocando **SEU_EMAIL_AQUI** pelo e-mail com que entrará no aplicativo.
4. Se aparecer **Adicionar Chaves Secretas**, preencha `OWNER_PROJECT_ID` com o ID DA SUA CÓPIA (último trecho da URL do editor) e `OWNER_EMAIL` com seu e-mail. Clique em **Salvar Segredos**. Esses dois valores identificam o administrador; não são chaves de serviços externos.
5. Quando a Blink terminar, abra a prévia em uma nova aba. Clique em **Entrar → Entrar com minha conta Blink**. Entre com o mesmo e-mail do prompt e confirme o link enviado por e-mail; confira também o spam.
6. O painel **Master** é sua administração. Em **Nova empresa**, cadastre sua operação de demonstração usando esse mesmo e-mail e deixe a senha vazia, pois seu usuário já existe. Em **Empresas**, use **Entrar como empresa** para acessar o atendimento e CRM.
7. Personalize a marca e configure suas integrações antes de atender clientes. Para colocar no ar em produção, use **Publicar** e confira a hospedagem apresentada pela Blink.

## Prompt para copiar

Ative esta cópia do AtendeZap sem redesenhar nem recriar o sistema. Meu e-mail de administrador é SEU_EMAIL_AQUI. Siga BLINK_ALUNOS.md. O backend completo já está em backend/index.ts; publique somente esse arquivo, sem transformar server/native ou módulos antigos em funções separadas. Aplique scripts/native/schema.sql e scripts/native/bootstrap.sql ao banco DESTA cópia de forma idempotente. Configure OWNER_PROJECT_ID com o ID deste projeto e OWNER_EMAIL com meu e-mail. Não copie OWNER_USER_ID do modelo. Configure VITE_BLINK_PROJECT_ID, VITE_BLINK_PUBLISHABLE_KEY e VITE_BLINK_BACKEND_URL com os dados DESTA cópia. Aplique scripts/native/security-policy.json para impedir acesso direto às tabelas de negócio pelo SDK público. Publique o backend, execute npm run build e disponibilize a prévia. Confirme /health com banco conectado e /api/bootstrap configurado. Não redesenhe, não gere imagens, não reescreva funções e não ative integrações sem minhas chaves. Entregue o link de entrada e indique os cliques de configuração que faltarem. A publicação em produção será feita por mim no botão Publicar, após conferir a hospedagem.

## Custos observados no teste de 16/09/2026

- Remix: 1 crédito.
- Prompt de instalação: 11,13 créditos, 4min26s de execução. É uma observação deste teste, não um preço garantido para futuras execuções.
- A publicação em produção mostrou hospedagem com 10 mil visitas/mês, primeiro mês grátis e depois 50 créditos/mês. A cópia de teste ficou na prévia, sem ativar essa assinatura.
- Plano, créditos de IA, hospedagem e serviços externos são itens diferentes. Confira os preços e condições apresentados na sua conta.

## O que configurar para usar com clientes

- WhatsApp: servidor Evolution API, URL e chave no backend; depois conectar o número pelo QR Code na tela Conexão.
- IA: o padrão Gemini usa a integração nativa Blink e consome créditos conforme o uso. OpenAI e Anthropic são alternativas opcionais com chaves próprias na configuração do agente. Não é necessário colar uma chave da Blink no chat ou no frontend.
- Google Agenda, opcional: credenciais OAuth, URL de retorno da SUA cópia e autorização da conta Google.
- Cobrança recorrente, opcional: configurar o gateway e seus webhooks. Nenhuma cobrança real é feita pelo teste de clonagem.
- Campanhas automáticas exigem configuração do processador/fila e `CAMPAIGN_WORKER_SECRET`; não ficam prontas apenas ao conectar WhatsApp.
- `PUBLIC_APP_URL` pode ser configurada no backend com seu domínio público para links de pesquisa e retorno do Google.
- Nunca cole segredos no código público. Use Segredos da Blink e as telas próprias de configuração.

## Notas do modelo

- Frontend SPA: Vite + React + TanStack Router.
- Backend Hono: fontes em server/, único artefato implantável em backend/index.ts. Gerar com `node scripts/native/port-domain.mjs` e `npm run build:backend` após mudar funções originais.
- Banco SQLite independente, com políticas de acesso direto negado. O adaptador sql-adapter restaura nomes de colunas porque o SDK Blink converte resultados SQL para camelCase.
- Administração só é instalada com o projeto correto e e-mail verificado. Não depende de ser a primeira pessoa a abrir a página.
- Alteração de senha deve ser feita pelo titular; não há reset arbitrário de senha por administrador.
- O primeiro teste foi em um projeto novo no mesmo workspace Pro, não em outra conta. Recebeu correções de compatibilidade durante a validação, depois incorporadas ao modelo. Integrações externas não foram testadas com envio ou cobrança reais.

## Resultado da validação de 16/09/2026

Login do administrador, cadastro da empresa, contato persistido após recarregar, mudança de etapa no Kanban, tela de conversas, configuração manual e uma resposta real da IA Blink verificados na cópia. 32 testes automatizados passaram. Modelo permaneceu sem empresas e contatos de teste.

## Integrações verificadas em 16/09/2026 — atualização

As credenciais Evolution e Google fornecidas pelo proprietário foram configuradas como segredos no modelo e na primeira cópia de teste; seus valores não fazem parte do código nem deste guia. A Evolution autenticou e o aplicativo gerou o QR Code. O webhook da instância de teste foi conferido separadamente. Conectar um número ainda exige escanear o QR no celular.

Para os alunos, o Remix não deve ser tratado como transferência de segredos: preencher no backend `EVOLUTION_API_URL` e `EVOLUTION_API_KEY` com os dados recebidos do curso e depois abrir **Conexão → Conectar WhatsApp**.

Google Agenda é opcional e não é a IA Gemini. Para usar a agenda, preencher `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`, cadastrar no cliente OAuth do Google a URL **do backend da própria cópia** seguida de `/api/public/google-callback` e autorizar a conta Google pelo aplicativo. Quem administra o cliente OAuth compartilhado precisa cadastrar cada nova URL de retorno; copiar somente as chaves não conclui essa integração. `PUBLIC_APP_URL` deve corresponder ao endereço em que essa cópia será aberta.
