# Arquitetura e Estrutura do Produto Final (App SaaS)

O aplicativo será um **SaaS fechado de acompanhamento hormonal para menopausa**, desenhado para retenção mensal, upsell interno e baixo custo operacional (sem consumir tokens de IA dentro do app).

A lógica central do produto é:
**Quiz na Inlead → Compra → Criação automática via n8n → App Personalizado no 1º login → Acompanhamento Diário → Recuperação/Recorrência**

---

## 1. Arquitetura Ideal, Simples e Estável
* **Frontend:** Next.js / React (PWA)
* **Backend / Banco / Auth:** Supabase
* **Automação (Middleware):** n8n
* **Quiz Externo (Top of Funnel):** Inlead
* **Checkout:** Kiwify/Yampi/PerfectPay (A definir)

**Regra Principal:** O app depende de poucas automações externas. O n8n cuida estritamente de acessos (criação de conta após compra), sincronização do diagnóstico do quiz com o Supabase e disparo de webhook de renovação/bloqueio de pagamento. O restante das mecânicas roda internamente.

---

## 2. Funções Completas do App

### Acesso e Segurança
* **Login Mínimo:** Apenas email, senha e botão "Entrar". **Não há botão de Criar Conta** (conta só existe se comprar o produto).
* **Recuperação de Senha:** Botão "Esqueci minha senha" que verifica o email e envia link de redefinição com trava de 60 segundos para evitar spam.

### Personalização Inicial (O Efeito "Uau")
* A usuária **não entra zerada**. A automação do n8n injeta as respostas da Inlead atreladas ao email da compra direto no Supabase.
* No primeiro login, o painel já carrega o Nome, Fase/Perfil Hormonal diagnosticado, Sintoma Principal e a Rotina Inicial parametrizada.

### Dashboard (Home)
* Saudação personalizada ("Olá, Ana. Hoje sua fase principal é Fogacho Intenso").
* Indicador visual de equilíbrio.
* Atalhos rápidos e mini-resumo de progresso semanal.

### A Rotina Diária
* Geração de 3 a 5 ações por dia (Manhã, Tarde, Noite) baseadas na Fase/Perfil atual.
* Cada item tem um "Check" (✅).
* Gamificação via **Ofensiva Diária** (dias seguidos de check completos), criando hábito.

### Registro e Evolução (Retenção)
* **Sintomas:** Mapeamento diário simples (ex: 1 a 5 ou Leve/Moderado/Intenso) focado no humor, fogacho, sono e energia.
* **Evolução:** Gráficos visuais mostrando a melhora em porcentagem (Diária, Semanal, Mensal ou Comparativo Mês X vs Y). "Seus fogachos reduziram 28%". É a principal ferramenta de retenção de LTV.
* **Resumo Semanal:** Pop-up ou aba que resume o desempenho dela (Sintomas que melhoraram, fórmulas mais usadas).

### SOS Sintoma (Resposta Imediata)
* Botão na home correspondente ao perfil dela. Se perfil = Ansiedade, o botão é "SOS Ansiedade" e carrega um áudio de respiração ou orientação prática quase instantânea.

### Protocolos, Fórmulas e Receitas
* O app não fala em "dietas". Usa termos proprietários: **Fórmulas Naturais** ou **Protocolos**.
* **Banco Fixo em Supabase:** Cerca de 50+ receitas/protocolos cadastrados com TAGS (ex: anti-inchaço, sono, fogacho). O dashboard dela apenas prioriza/filtra a exibição baseada na tag do perfil dela, sem gastar com IA gerativa.

### Complementos Terapêuticos e Diário
* **Desafios:** Trilhas gamificadas de 7 ou 15 dias (ex: Desafio Anti-Fogacho).
* **Áudios Terapêuticos:** Player Mínimo (MP3 direto do bucket) com sons para dormir, ruído marrom ou meditação.
* **Diário Emocional:** Caixa de texto com "Prompts" do dia (journaling) para gerar acolhimento.

### Novo Diagnóstico (Mantendo o App Vivo)
* De tempos em tempos, o App libera a função "Refazer Diagnóstico". Um reteste rápido interno para recalcular a fase atual da usuária e alterar os protocolos exibidos.

### LTV e Fricção de Cobrança
* **Área Premium:** Módulos de Upsell (Comunidade, Biblioteca extra) visíveis mas trancados com cadeado. Clicar leva ao checkout interno (One-Click/Pix) pra elevar o LTV.
* **Tela de Assinatura:** Aba no perfil listando o Plano, Data de Vencimento e Botão de Regularização. Sem botão nativo fácil de "Cancelar Assinatura" (cancelamento fica por conta do Gateway de Pagamento, reduzindo impulsos).

---

## 3. Gestão de Recuperação e Inadimplência (O "Rescue" Flow)

A estratégia de cancelamento por não-pagamento no fim do ciclo / chargeback é desenhada para **Recuperar** antes de Chutar.

1. **Período de Carência (Pendente):** Assinatura venceu e não rodou. O n8n altera o status no Supabase de "ativo" para "pendente". A usuária **não perde o acesso de imediato**. O App exibe banners como *"Seu pagamento está pendente. Seu acesso será limitado em X dias."*
2. **Aviso Fixo / Recuperação Interna:** Mensagens in-app com botão "Regularizar agora" chamando para a página de checkout.
3. **Bloqueio Hard (A Ideia do Desconto):** Passando a carência (ex: 7 dias), o acesso é bloqueado. Quando ela tenta logar no App com a assinatura vencida, ela não entra no Dashboard. A **tela de login redireciona obrigatoriamente para uma Tela de Regularização**. 
4. **Trigger de Conversão:** Essa tela de Regularização Bloqueada deve disparar uma oferta agressiva: *"Sentimos sua falta! Retome sua jornada hormonal hoje com [30% de desconto] na renovação anual."* (Elevando consideravelmente a repescaria).
