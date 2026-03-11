# Estrutura do Produto Final (O "App" SaaS)

Com base no áudio, o entregável não será um PDF estático ou um Notion. Será um **Aplicativo real (Web App / SaaS)** construído via IA (Lovable, Cursor, Bolt, etc.), projetado para rodar no modelo de **Recorrência (Assinatura)**. 

Para que a promessa do Quiz ("Descubra seu Perfil Hormonal e receba um plano de 15 minutos") seja cumprida com alta percepção de valor, o App precisa ter funcionalidades visuais e de acompanhamento claras.

## Nome Provisório do App
* **"HormoSync"** ou **"Reage 40+"** ou **"BalanceApp"** (A definir)

## Core Features (O que a usuária recebe no Front-End de R$ 27)
A usuária paga o ticket baixo inicial para *desbloquear* o resultado detalhado do Quiz e acessar a rotina diária dela.

### 1. Dashboard Personalizado (O "Uau" instantâneo)
* Quando ela loga pela primeira vez, a tela inicial não pode ser genérica. Tem que dizer: *"Bem-vinda, [Nome]. Seu perfil é **Cortisol Alto**. Aqui está o seu plano de hoje."*
* Deve haver um gráfico visual ou barra de progresso mostrando "Nível de Desequilíbrio Atual" vs "Meta em 30 dias".

### 2. A Rotina Diária de 15 Minutos (Checklist Interativo)
* **O que é:** Uma lista de 3 a 5 tarefas simples por dia, focadas no perfil dela, que ela pode marcar um "Check" (✅).
* **Exemplo (Perfil Insônia/Cortisol):**
  * Manhã (3 min): Shot matinal de limão + pitada de sal integral (Apoio adrenal).
  * Tarde (5 min): Respiração 4-7-8 (Redução de pico de stress).
  * Noite (7 min): Chá de Mulungu e desligar telas 30 min antes de dormir.
* **Gatilho de Dopamina:** Toda vez que ela completa o checklist, um tracker de "Ofensiva" (Streak, igual Duolingo) aumenta. Isso força ela a abrir o app todo dia.

### 3. Banco de Refeições "Pró-Hormônio" (Filtro por Perfil)
* Uma aba simples com receitas ágeis (Café, Almoço, Jantar).
* **O diferencial:** As receitas devem indicar para qual sintoma elas são boas. Ex: *"Suco Verde Anti-Fogacho"*, *"Sopa Leve Indutora de Sono"*, *"Chá da Libido"*.

### 4. Novo Diagnóstico (Re-Aferição de Perfil)
* Por mais que o quiz inicial tenha dado "Cortisol Alto", a mulher pode melhorar isso e passar a se incomodar mais com o peso com o passar dos meses. 
* O App permitirá que ela **refaça o Quiz/Diagnóstico** após um certo período para reajustar o seu "Perfil Atual" e mudar a trilha de rotinas e receitas dela para a nova realidade. Isso evita que ela fique presa num diagnóstico obsoleto e abandone o uso.

### 5. Tracker de Sintomas e Histórico (A Ferramenta de Retenção)
* Uma funcionalidade onde ela entra todo dia (ou semana) para registrar como estão os controles:
  * Como você acordou? (Energia)
  * Como foi a qualidade do sono?
  * Teve fogachos hoje ou alguma observação específica?
* **Gráficos de Evolução:** O App consolida esses inputs num gráfico de fácil visualização. Ela consegue puxar o histórico "Mês Anterior vs. Mês Atual" ou "Semana Anterior vs. Semana Atual" para ver em uma linha de tendência clara que ela **está melhorando**. 
* **Por que isso importa:** Sem ver resultado tangível (o gráfico descendo na dor), ela cancela a assinatura. Essa visualização gráfica dos próprios dados é o maior gerador de LTV do SaaS.

---

## Como o App se conecta com a Oferta de Upsell (Maximização de LTV Interno)
Como o usuário mencionou, o modelo principal da empresa é construir um MVP validado para rodar em assinaturas/recorrência e aumentar o "Ganho por Lead" ao máximo.
Portanto, a monetização não para no funil inicial:

* O produto Front-End (R$ 27) dá acesso ao App base.
* Se ela **não comprou** o Upsell (As Mentorias, Guias Avançados ou a Comunidade VIP) no checkout inicial, essas áreas aparecerão no App com um **Cadeado Visual**.
* **Compra in-app (Fricção Zero):** Ao clicar no cadeado, a usuária é direcionada para um link de checkout interno direto do App. Mesmo que seja um pouco mais caro ou mais barato dependendo da promoção, a oferta vive ali.
* **Automação de Descontos:** O sistema deve estar preparado para identificar as usuárias que não compraram o produto "X" (ex: Acesso Vitalício) e, em dias específicos da semana, enviar uma mensagem in-app ou notificação oferecendo aquele módulo extra com um desconto relâmpago para forçar a nova conversão e elevar o LTV.

## Requisitos Técnicos Mínimos (Construção via IA)
* **Frontend:** PWA (Progressive Web App) gerado via Lovable ou v0.dev. Ele roda direto no navegador (Safari/Chrome), mas ela pode "Adicionar à Tela de Início" para parecer um App nativo, sem precisarmos passar pela aprovação burocrática da Apple Store/Play Store (que rejeita muitos apps de saúde/DR).
* **Backend:** Supabase (Como mencionado pelo Xisto). Vai guardar a autenticação, os perfis cruzados do Inlead e salvar o progresso dos Checklists Diários.
* **Automação:** Webhook direto do Checkout (Kiwify ou similar) -> Cria usuário no Supabase -> Envia e-mail ou WhatsApp com o "Link Mágico" de login do App.
