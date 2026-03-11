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

### 4. Tracker de Sintomas (A Ferramenta de Retenção)
* Uma funcionalidade onde ela arrasta sliders (barrinhas de 1 a 10) toda semana:
  * Intensidade do Fogacho: 8/10
  * Qualidade do Sono: 4/10
  * Nível de Energia: 5/10
* O app gera um gráfico mostrando a evolução dela com o passar das semanas. **Isso é o que vai mantê-la pagando a recorrência.**

---

## Como o App se conecta com a Oferta de Upsell (Acesso Vitalício)
Como o usuário mencionou, o modelo principal da empresa é de assinaturas/recorrência. 
Portanto:
* O produto Front-End (R$ 27) dá acesso **Anual ou Semestral** ao App.
* O Upsell 1 (A Oferta Principal de R$ 147) é a venda do **Acesso PREMIUM VITALÍCIO**, que desbloqueia abas extras dentro do próprio App (ex: Aba "Comunidade VIP", Aba "Imersão Zero Reposição Guias Completos"). 
* Se ela não compra o Upsell, essas abas ficam com um cadeado visual dentro do App, gerando desejo futuro.

## Requisitos Técnicos Mínimos (Construção via IA)
* **Frontend:** PWA (Progressive Web App) gerado via Lovable ou v0.dev. Ele roda direto no navegador (Safari/Chrome), mas ela pode "Adicionar à Tela de Início" para parecer um App nativo, sem precisarmos passar pela aprovação burocrática da Apple Store/Play Store (que rejeita muitos apps de saúde/DR).
* **Backend:** Supabase (Como mencionado pelo Xisto). Vai guardar a autenticação, os perfis cruzados do Inlead e salvar o progresso dos Checklists Diários.
* **Automação:** Webhook direto do Checkout (Kiwify ou similar) -> Cria usuário no Supabase -> Envia e-mail ou WhatsApp com o "Link Mágico" de login do App.
