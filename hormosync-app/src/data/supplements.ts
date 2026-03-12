export interface Supplement {
  id: string;
  group: 'fogacho' | 'sono' | 'energia' | 'libido' | 'cabelo' | 'ossos' | 'coracao' | 'humor';
  name: string;
  scientificName?: string;
  forWhat: string;
  dose: string;
  timing: string;
  timeToResult: string;
  whereToBuy: string;
  costRange: string;
  contraindications: string[];
  safeFor?: string;
  tip?: string;
  manipulationFormula: string; // texto para copiar e mandar no WhatsApp da farmácia
}

export const SUPPLEMENTS: Supplement[] = [
  {
    id: 'SUP01', group: 'fogacho',
    name: 'Extrato de Amora', scientificName: 'Morus nigra',
    forWhat: 'Reduz intensidade e frequência dos fogachos e suores noturnos.',
    dose: '160mg de extrato seco padronizado, 2x ao dia',
    timing: 'Após o café da manhã e após o almoço',
    timeToResult: '3 a 8 semanas de uso contínuo',
    whereToBuy: 'Farmácia de manipulação ou lojas de suplementos',
    costRange: 'R$40–60/mês',
    contraindications: ['Diabetes — pode reduzir levemente a glicemia'],
    safeFor: 'Histórico de câncer de mama (não estimula receptores de estrogênio diretamente)',
    manipulationFormula: `PEDIDO DE MANIPULAÇÃO — EXTRATO DE AMORA:
Extrato seco de Morus nigra (folhas de amora preta) 160mg
Excipiente vegetal q.s.p. 1 cápsula HPMC (vegana)
Quantidade: 60 cápsulas
Posologia: 1 cápsula 2x ao dia (manhã e tarde) com alimento
Durabilidade: 30 dias
Custo estimado: R$40–60

✅ Segura para histórico de câncer de mama
⚠️ Diabéticas: monitorar glicemia`,
  },
  {
    id: 'SUP02', group: 'fogacho',
    name: 'Isoflavonas de Soja', scientificName: 'Genisteína + Daidzeína',
    forWhat: 'Fitoestrogênio que ocupa receptores de estrogênio — alivia fogachos, secura vaginal e oscilações de humor.',
    dose: '',
    timing: '',
    timeToResult: '4 a 12 semanas',
    whereToBuy: 'Farmácias (Isofitol, Nattoflor) ou manipulação',
    costRange: 'R$30–70/mês',
    contraindications: ['Histórico de câncer de mama ER+ — CONSULTAR MÉDICO', 'Hipotireoidismo — tomar 4h separado da levotiroxina'],
    tip: 'Não adianta tomar mais que 80mg/dia — receptores ficam saturados.',
    manipulationFormula: `PEDIDO DE MANIPULAÇÃO — ISOFLAVONAS:
Isoflavonas de soja padronizadas (mínimo 40% isoflavonas totais) 40mg
Excipiente vegetal q.s.p. 1 cápsula
Quantidade: 30 cápsulas
Posologia: 1 cápsula ao dia com o café da manhã
Durabilidade: 30 dias
Custo estimado: R$35–55

⚠️ Câncer de mama ER+: consultar médico obrigatório`,
  },
  {
    id: 'SUP03', group: 'fogacho',
    name: 'Extrato de Sálvia',
    forWhat: 'Anti-sudorífero natural. Reduz especificamente os suores noturnos.',
    dose: '280–300mg de extrato seco, 1x ao dia',
    timing: 'À noite, antes de dormir',
    timeToResult: '2 a 4 semanas',
    whereToBuy: 'Farmácia de manipulação',
    costRange: 'R$25–45/mês',
    contraindications: ['Epilepsia', 'Gravidez', 'Amamentação'],
    manipulationFormula: `PEDIDO DE MANIPULAÇÃO — EXTRATO DE SÁLVIA:
Extrato seco de Salvia officinalis (folhas) 280mg
Excipiente vegetal q.s.p. 1 cápsula
Quantidade: 30 cápsulas
Posologia: 1 cápsula à noite
Durabilidade: 30 dias
Custo estimado: R$25–45

⚠️ Contraindicada em epilepsia`,
  },
  {
    id: 'SUP04', group: 'sono',
    name: 'Magnésio Bisglicinato',
    forWhat: 'Regula sono (especialmente acordar às 3h), reduz cãibras, ansiedade e tensão muscular — o "anti-estresse" mineral.',
    dose: '300mg de magnésio elemento à noite. NUNCA usar óxido de magnésio — má absorção.',
    timing: 'Com o jantar ou antes de dormir',
    timeToResult: '1 a 2 semanas para sono; ansiedade melhora em dias',
    whereToBuy: 'Farmácia de manipulação (pedir bisglicinato ou glicinato)',
    costRange: 'R$40–80/mês',
    contraindications: ['Doença renal grave'],
    tip: 'O óxido de magnésio que vem em produtos baratos tem absorção de apenas 4% — praticamente inútil.',
    manipulationFormula: `PEDIDO DE MANIPULAÇÃO — MAGNÉSIO BISGLICINATO:
Magnésio bisglicinato quelato, fornecer 300mg de magnésio elemento
Excipiente vegetal q.s.p. 1 cápsula
Quantidade: 30 cápsulas
Posologia: 1 cápsula à noite com o jantar
Durabilidade: 30 dias
Custo estimado: R$40–65

⚠️ IMPORTANTE: Pedir especificamente 'bisglicinato' ou 'glicinato'.
NÃO substituir por Magnésio Óxido (absorção ruim, causa diarreia)`,
  },
  {
    id: 'SUP05', group: 'sono',
    name: 'Melatonina',
    forWhat: 'Induz o início do sono. Ideal para quem demora para pegar no sono.',
    dose: '0,5mg a 1mg sublingual. Começar com a menor dose.',
    timing: '',
    timeToResult: 'Primeira noite já apresenta resultado',
    whereToBuy: 'Farmácias e manipulação',
    costRange: 'R$15–35/mês',
    contraindications: ['Não combinar com antidepressivos sedativos sem orientação médica'],
    tip: 'Mais não é melhor. 0,5mg já é eficaz. Dose alta deixa grogue de manhã.',
    manipulationFormula: `PEDIDO DE MANIPULAÇÃO — MELATONINA:
Melatonina 1mg
Excipiente sublingual q.s.p. 1 comprimido sublingual (SLIC)
Quantidade: 30 unidades
Posologia: 1 unidade sublingual 30 min antes de dormir
Durabilidade: 30 dias
Custo estimado: R$15–30

💡 Se quiser começar com dose menor: pedir 0,5mg`,
  },
  {
    id: 'SUP06', group: 'sono',
    name: 'Valeriana + Passiflora',
    forWhat: 'Para quem acorda de madrugada e não consegue voltar a dormir. Manutenção do sono.',
    dose: 'Valeriana 300mg + Passiflora 150mg antes de dormir',
    timing: '',
    timeToResult: '2 a 4 semanas de uso contínuo (efeito acumula)',
    whereToBuy: 'Farmácia de manipulação ou Valdispert (pronto)',
    costRange: 'R$30–60/mês',
    contraindications: ['Não dirigir após tomar', 'Não combinar com álcool'],
    manipulationFormula: `PEDIDO DE MANIPULAÇÃO — SONO REPARADOR:
Extrato seco de Valeriana officinalis (0,8% ácido valerénico) 300mg
Extrato seco de Passiflora incarnata 150mg
Excipiente vegetal q.s.p. 1 cápsula
Quantidade: 30 cápsulas
Posologia: 1 cápsula 45 min antes de dormir
Durabilidade: 30 dias
Custo estimado: R$35–55

⚠️ Não dirigir após tomar. Não combinar com álcool.`,
  },
  {
    id: 'SUP07', group: 'energia',
    name: 'Complexo B Ativo',
    forWhat: 'Combate cansaço, depressão leve e névoa mental (brain fog) da menopausa.',
    dose: 'B6: 50mg/dia | B12: 1000mcg sublingual',
    timing: 'Com o café da manhã',
    timeToResult: '1 a 3 semanas',
    whereToBuy: 'Qualquer farmácia ou manipulação',
    costRange: 'R$20–60/mês',
    contraindications: ['B6 acima de 200mg/dia por meses pode causar neuropatia — manter dose recomendada'],
    tip: 'Pedir Metilcobalamina (B12 ativa) e Metilfolato (B9 ativa) para maior eficácia.',
    manipulationFormula: `PEDIDO DE MANIPULAÇÃO — COMPLEXO B ATIVO:
Vitamina B1 (Tiamina HCl) 50mg
Vitamina B2 (Riboflavina) 25mg
Vitamina B3 (Niacinamida) 100mg
Vitamina B5 (Pantotenato de cálcio) 50mg
Vitamina B6 (Piridoxina HCl) 50mg
Vitamina B7 (Biotina) 5.000mcg
Vitamina B9 (Metilfolato) 400mcg
Vitamina B12 (Metilcobalamina) 1.000mcg
Excipiente vegetal q.s.p. 1 cápsula
Quantidade: 30 cápsulas
Posologia: 1 cápsula ao dia com o café da manhã
Custo estimado: R$45–65`,
  },
  {
    id: 'SUP08', group: 'energia',
    name: 'Vitamina D3 + K2 MK7',
    forWhat: 'Essencial para ossos, imunidade, humor e músculos. 80% das brasileiras têm deficiência.',
    dose: '5.000 UI de D3 com 100mcg de K2 MK7 ao dia',
    timing: 'Com a refeição mais gordurosa do dia (vitamina D é lipossolúvel)',
    timeToResult: '4 a 8 semanas; fazer exame de 25(OH)D para confirmar',
    whereToBuy: 'Farmácias e manipulação',
    costRange: 'R$30–70/mês',
    contraindications: ['Hipercalcemia — fazer exame de cálcio a cada 6 meses em dose alta'],
    tip: 'A K2 direciona o cálcio para os ossos e evita calcificação das artérias. NUNCA tomar D3 alta dose sem K2.',
    manipulationFormula: `PEDIDO DE MANIPULAÇÃO — VITAMINA D3 + K2:
Vitamina D3 (Colecalciferol) 5.000 UI
Vitamina K2 (Menaquinona MK7) 100mcg
Excipiente oleoso q.s.p. 1 cápsula softgel
Quantidade: 30 cápsulas
Posologia: 1 cápsula ao dia com a refeição mais gordurosa
Custo estimado: R$30–50

⚠️ Pedir obrigatoriamente MK7 (não MK4 — absorção menor)`,
  },
  {
    id: 'SUP09', group: 'libido',
    name: 'Maca Peruana Preta',
    forWhat: 'Versão mais potente da maca para libido e desejo sexual. Sem estimular o estrogênio diretamente.',
    dose: '500mg de extrato 4:1, 1x ao dia',
    timing: 'Pela manhã (evitar à noite — dá energia)',
    timeToResult: '2 a 6 semanas',
    whereToBuy: 'Farmácia de manipulação ou lojas de suplementos',
    costRange: 'R$40–80/mês',
    contraindications: ['Hipertensão descontrolada', 'Se piorar fogacho, reduzir dose ou parar'],
    tip: 'Maca Amarela = mais suave, uso geral. Maca Preta = mais potente para libido e memória.',
    manipulationFormula: `PEDIDO DE MANIPULAÇÃO — MACA PERUANA PRETA:
Extrato seco de Maca Peruana preta (Lepidium meyenii) 4:1 — 500mg
Excipiente vegetal q.s.p. 1 cápsula
Quantidade: 30 cápsulas
Posologia: 1 cápsula pela manhã com o café
Custo estimado: R$40–70

💡 Para uso geral e energia: pedir Maca AMARELA
Para libido e memória: pedir Maca PRETA`,
  },
  {
    id: 'SUP10', group: 'libido',
    name: 'Vitamina E (Tocoferóis Mistos)',
    forWhat: 'Hidratação vaginal interna. Melhora mucosa íntima de dentro para fora. Também antioxidante para pele.',
    dose: '',
    timing: 'Com a refeição gordurosa',
    timeToResult: '4 a 8 semanas para mucosa vaginal',
    whereToBuy: 'Farmácias e manipulação',
    costRange: 'R$20–40/mês',
    contraindications: ['Acima de 1.000 UI/dia pode interferir na coagulação'],
    manipulationFormula: `PEDIDO DE MANIPULAÇÃO — VITAMINA E:
Tocoferóis mistos (vitamina E) 400 UI
Excipiente oleoso q.s.p. 1 cápsula softgel
Quantidade: 30 cápsulas
Posologia: 1 cápsula ao dia com o almoço
Custo estimado: R$20–38`,
  },
  {
    id: 'SUP11', group: 'cabelo',
    name: 'Biotina + Zinco + Selênio',
    forWhat: 'Combate queda hormonal de cabelo e fragilidade das unhas. Biotina fortalece; zinco inibe DHT; selênio protege o folículo.',
    dose: 'Biotina 10.000mcg + Zinco 15mg + Selênio 100mcg, 1x ao dia',
    timing: 'Com o café da manhã',
    timeToResult: '3 a 6 meses (cabelo cresce devagar — persistência!)',
    whereToBuy: 'Farmácia de manipulação (juntos fica muito mais barato)',
    costRange: 'R$45–75/mês (os 3 juntos em 1 cápsula)',
    contraindications: ['Biotina em dose alta interfere em TSH e troponina — avisar médico antes de exames'],
    tip: 'Resultados fotográficos em 90 dias. Marque antes e depois para se motivar.',
    manipulationFormula: `PEDIDO DE MANIPULAÇÃO — CABELO E UNHAS:
Biotina (Vitamina B7) 10.000mcg
Zinco quelato (bisglicinato) 15mg
Selênio (L-selenometionina) 100mcg
Excipiente vegetal q.s.p. 1 cápsula
Quantidade: 30 cápsulas
Posologia: 1 cápsula ao dia com o café
Custo estimado: R$50–75

⚠️ Avisar médico sobre biotina antes de fazer exames de sangue`,
  },
  {
    id: 'SUP12', group: 'cabelo',
    name: 'Colágeno Hidrolisado Tipo 1 e 3',
    forWhat: 'Aminoácidos da matriz do cabelo, pele e unhas. A vitamina C é obrigatória junto!',
    dose: '',
    timing: 'No café da manhã misturado no suco de laranja (vitamina C obrigatória)',
    timeToResult: '2 a 4 meses',
    whereToBuy: 'Farmácias e lojas de suplementos (pó ou sachê)',
    costRange: 'R$40–80/mês',
    contraindications: ['Verificar origem: marinho (peixe) ou bovino — alergia específica'],
    tip: 'Sem vitamina C junto, o colágeno não é sintetizado. O suco de laranja é obrigatório.',
    manipulationFormula: `PEDIDO DE MANIPULAÇÃO — COLÁGENO + VITAMINA C:
Colágeno hidrolisado tipo 1 e 3 (pó) 5g por dose
Vitamina C (ácido ascórbico) 500mg
Quantidade: 30 sachês de 5g
Posologia: 1 sachê ao dia misturado no suco de laranja
Custo estimado: R$60–90/mês

💡 Pode pedir somente o pó de colágeno (10g) e tomar com suco de laranja natural`,
  },
  {
    id: 'SUP13', group: 'ossos',
    name: 'Cálcio Citrato + D3 + K2',
    forWhat: 'Prevenção de osteoporose — risco sobe 50% no primeiro ano de menopausa. A tríade direciona o cálcio ao osso.',
    dose: 'Cálcio citrato 500mg 2x ao dia + D3 5.000UI + K2 100mcg',
    timing: 'Com as refeições (almoço e jantar). Dividir as doses.',
    timeToResult: 'Densitometria a cada 2 anos para confirmar; sintomas em 3-6 meses',
    whereToBuy: 'Farmácia de manipulação',
    costRange: 'R$60–90/mês',
    contraindications: ['Pedra nos rins de oxalato — usar citrato (mais seguro)', 'Hipercalcemia'],
    tip: 'NUNCA tomar mais de 500mg de cálcio de uma vez — absorção é limitada. Dividir sempre.',
    manipulationFormula: `PEDIDO DE MANIPULAÇÃO — STACK ÓSSEO COMPLETO:
Cálcio citrato 600mg (fornecendo ~130mg de Ca elemento)
Vitamina D3 (Colecalciferol) 5.000 UI
Vitamina K2 (Menaquinona MK7) 100mcg
Magnésio bisglicinato (150mg de magnésio elemento)
Boro 3mg
Excipiente oleoso/vegetal q.s.p. 1 cápsula
Quantidade: 30 cápsulas
Posologia: 1 cápsula ao dia com o almoço
Custo estimado: R$70–100

⚠️ Histórico de pedra nos rins: confirmar citrato com médico`,
  },
  {
    id: 'SUP14', group: 'coracao',
    name: 'Ômega-3 EPA + DHA',
    forWhat: 'Anti-inflamatório sistêmico (articulações, coração, pele), melhora humor, reduz triglicerídeos e ressecamento vaginal.',
    dose: '2–3g de EPA+DHA combinados ao dia. Ler rótulo — não conta o total de óleo de peixe!',
    timing: 'Com as refeições, dividido em 2 doses',
    timeToResult: '4 a 8 semanas',
    whereToBuy: 'Farmácias e lojas de suplementos',
    costRange: 'R$50–120/mês',
    contraindications: ['Anticoagulantes (varfarina, heparina)', 'Suspender 7 dias antes de cirurgias'],
    manipulationFormula: `PEDIDO DE MANIPULAÇÃO — ÔMEGA-3 CONCENTRADO:
Óleo de peixe concentrado fornecendo:
- EPA (ácido eicosapentaenoico) 900mg
- DHA (ácido docosaexaenoico) 600mg
Total EPA+DHA por cápsula: 1.500mg
Excipiente: óleo de peixe q.s.p. 1 cápsula softgel
Quantidade: 60 cápsulas (2 ao dia)
Posologia: 1 cápsula no almoço + 1 no jantar
Custo estimado: R$55–85/mês

⚠️ Em uso de anticoagulante: consultar médico`,
  },
  {
    id: 'SUP15', group: 'humor',
    name: 'Ashwagandha KSM-66',
    forWhat: 'Adaptógeno — reduz cortisol estruturalmente. Melhora sono, ansiedade, resistência ao estresse e libido.',
    dose: '300–600mg de extrato KSM-66 ou Sensoril, 1x ao dia',
    timing: 'À noite com o jantar (tem efeito sedativo suave)',
    timeToResult: '4 a 8 semanas',
    whereToBuy: 'Farmácia de manipulação ou lojas de suplementos premium',
    costRange: 'R$55–100/mês',
    contraindications: ['Gravidez — absolutamente proibido', 'Doenças autoimunes ativas', 'Hipertireoide'],
    tip: 'Pedir padronização KSM-66 ou Sensoril — são as únicas formas com estudo clínico. Genérica tem menos resultado.',
    manipulationFormula: `PEDIDO DE MANIPULAÇÃO — ASHWAGANDHA:
Extrato seco de Ashwagandha (Withania somnifera) KSM-66 padronizado 300mg
(ou Sensoril 200mg — ambos têm estudo clínico)
Excipiente vegetal q.s.p. 1 cápsula
Quantidade: 60 cápsulas
Posologia: 1 cápsula 2x ao dia (manhã e noite com as refeições)
Custo estimado: R$55–90

⚠️ Pedir especificamente KSM-66 ou Sensoril`,
  },
];

// Stacks prontos (combinações de múltiplos suplementos em 1 cápsula)
export const SUPPLEMENT_STACKS = [
  {
    id: 'STACK1',
    name: 'Termostato Hormonal',
    description: 'Anti-fogacho por 3 vias simultâneas. A combinação mais potente.',
    symptoms: ['fogacho'],
    manipulationFormula: `FÓRMULA PARA MANIPULAÇÃO — STACK TERMOSTATO HORMONAL:
Extrato seco de Morus nigra (amora preta, folhas) 160mg
Isoflavonas de soja padronizadas (40% isoflavonas totais) 40mg
Extrato seco de Salvia officinalis (sálvia) 150mg
Excipiente vegetal q.s.p. 1 cápsula HPMC
Quantidade: 60 cápsulas
Posologia: 1 cápsula 2x ao dia (manhã e tarde) com alimento
Duração: 30 dias
Custo estimado na manipulação: R$65–90

Ataca fogachos por 3 vias: fitoestrogênio (amora+soja) + anti-sudorese (sálvia).
✅ Seguro para histórico de câncer de mama (isoflavonas isoladas de soja têm estudos de segurança)`,
  },
  {
    id: 'STACK2',
    name: 'Noite de Paz',
    description: 'Sono profundo sem acordar de madrugada.',
    symptoms: ['sono'],
    manipulationFormula: `FÓRMULA PARA MANIPULAÇÃO — STACK NOITE DE PAZ:
Extrato seco de Valeriana officinalis (0,8% ácido valerénico) 300mg
Extrato seco de Passiflora incarnata 150mg
Magnésio bisglicinato (fornecer 200mg de magnésio elemento)
L-Teanina 100mg
Melatonina 1mg
Excipiente vegetal q.s.p. 1 cápsula
Quantidade: 30 cápsulas
Posologia: 1 cápsula 40 minutos antes de dormir
Duração: 30 dias
Custo estimado na manipulação: R$70–100

NÃO DIRIGIR após tomar.
Para insônia grave: pode aumentar melatonina para 3mg`,
  },
  {
    id: 'STACK3',
    name: 'Fios de Ouro',
    description: 'Cabelo, unhas e pele em 1 cápsula diária.',
    symptoms: ['cabelo'],
    manipulationFormula: `FÓRMULA PARA MANIPULAÇÃO — STACK FIOS DE OURO:
Biotina (Vitamina B7) 10.000mcg
Zinco quelato (bisglicinato) 15mg
Selênio (L-selenometionina) 100mcg
Silício orgânico (ácido ortossilícico estabilizado) 10mg
Vitamina C (ácido ascórbico) 500mg
Excipiente vegetal q.s.p. 1 cápsula
Quantidade: 30 cápsulas
Posologia: 1 cápsula + 1 sachê de 5g de colágeno no suco de laranja ao dia
Custo estimado: R$80–110/mês (cápsula + colágeno)

⚠️ Avisar médico sobre biotina antes de exames de sangue`,
  },
  {
    id: 'STACK4',
    name: 'Guerreira Total',
    description: 'Energia, memória e humor em 1 cápsula matinal.',
    symptoms: ['energia', 'humor'],
    manipulationFormula: `FÓRMULA PARA MANIPULAÇÃO — STACK GUERREIRA TOTAL:
Extrato de Maca peruana amarela 4:1 500mg
Extrato de Rhodiola rosea (3% rosavinas) 200mg
Vitamina B6 (Piridoxina) 50mg
Vitamina B12 (Metilcobalamina) 1.000mcg
Coenzima Q10 (Ubiquinol) 100mg
Excipiente vegetal q.s.p. 1 cápsula
Quantidade: 30 cápsulas
Posologia: 1 cápsula PELA MANHÃ (não à noite — estimulante)
Custo estimado: R$90–130/mês`,
  },
  {
    id: 'STACK5',
    name: 'Libido e Vitalidade Íntima',
    description: 'Desejo, lubrificação e circulação pélvica.',
    symptoms: ['libido'],
    manipulationFormula: `FÓRMULA PARA MANIPULAÇÃO — STACK LIBIDO:
Extrato de Maca peruana preta 4:1 500mg
Extrato de Tribulus terrestris (40% saponinas) 250mg
L-Arginina HCl 500mg
Vitamina E (tocoferóis mistos) 200 UI
Excipiente vegetal q.s.p. 1 cápsula
Quantidade: 30 cápsulas
Posologia: 1 cápsula ao dia com o almoço
Custo estimado: R$80–120/mês

⚠️ Se sentir aumento de acne, reduzir Tribulus pela metade`,
  },
];

export const SUPPLEMENT_GROUPS = [
  { key: 'fogacho', label: 'Fogachos', },
  { key: 'sono', label: 'Sono', },
  { key: 'energia', label: 'Energia', },
  { key: 'libido', label: 'Libido', },
  { key: 'cabelo', label: 'Cabelo e Unhas', },
  { key: 'ossos', label: 'Ossos', },
  { key: 'coracao', label: 'Coração', },
  { key: 'humor', label: 'Humor', },
];
