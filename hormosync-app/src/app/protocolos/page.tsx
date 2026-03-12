'use client';

import { useState } from 'react';
import { ChevronRight, Droplet, Leaf, RefreshCw } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const protocols = [
  {
    id: 1, tag: 'fogacho', emoji: '🔥', title: 'Protocolo Anti-Fogacho',
    subtitle: 'Alívio rápido + Shot',
    desc: 'Sequência tática para estabilizar a temperatura do corpo de dentro para fora.',
    steps: [
      'Vá para um ambiente fresco, se possível.',
      'Respire fundo pelo nariz por 4s, segure por 7s, solte por 8s.',
      'Tome o Shot Anti-Fogacho (receita abaixo).',
      'Coloque água fria nos pulsos e nuca.',
    ],
    recipe: {
      title: 'Shot Anti-Fogacho',
      ingredients: [
        '1/2 limão espremido',
        '1 colher de café de maca peruana (pó)',
        '1 pitada de sal rosa do Himalaia',
        '50ml de água natural'
      ],
      instructions: 'Misture todos os ingredientes em um copinho. O limão alcaliniza, o sal rosa repõe os minerais perdidos no suor e a maca equilibra o eixo hormonal. Tome em jejum pela manhã ou logo no início do fogacho.',
      substitutions: 'Se não tiver maca peruana, use 1/2 colher de café curta de gengibre em pó (mas teste a tolerância, pois gengibre aquece alguns organismos).'
    }
  },
  {
    id: 2, tag: 'sono', emoji: '🌙', title: 'Protocolo Calmante Noturno',
    subtitle: 'Prepare o corpo para dormir',
    desc: 'Redutor natural de cortisol para tratar a insônia da menopausa.',
    steps: [
      'Desligue telas 30 a 60 min antes de deitar.',
      'Tome 1 xícara do Chá Anti-Cortisol morno.',
      'Leia algumas páginas de um livro físico.',
    ],
    recipe: {
      title: 'Chá Anti-Cortisol Profundo',
      ingredients: [
        '1 colher de sopa de casca de Mulungu',
        '1 colher de sopa de folhas de Maracujá (Passiflora)',
        'Fatias finas de 1/4 de maçã para adoçar naturalmente',
        '300ml de água filtrada'
      ],
      instructions: 'Ferva a água junto com o Mulungu por 3 minutos (por ser casca dura). Desligue o fogo, coloque a Passiflora e a maçã, tampe o recipiente e aguarde 10 minutos (infusão). Coe e beba 40 minutos antes de dormir.',
      substitutions: 'Se estiver difícil achar Mulungu, faça uma infusão super concentrada usando 2 sachês de Camomila + 1 sachê de Melissa.'
    }
  },
  {
    id: 3, tag: 'inchaço', emoji: '💧', title: 'Protocolo Drenagem Caseira',
    subtitle: 'Desinchar em 24h',
    desc: 'Estratégia para reduzir o aspecto de "falsa barriga" e retenção de líquidos dos membros inferiores.',
    steps: [
      'Suspenda por 24h: excesso de sal, refrigerantes e embutidos.',
      'Tome o Suco Linfático Diurético no desjejum.',
      'Faça caminhada de 15 minutos ritmada para bombear as panturrilhas.',
    ],
    recipe: {
      title: 'Suco Verde Linfático',
      ingredients: [
        '1 folha grande de Couve manteiga (sem o talo grosso)',
        '1 pedaço (2 dedos) de pepino japonês com casca',
        'Sumo puro de 1 limão',
        '5 folhas e galhos de hortelã',
        '200ml de água bem gelada'
      ],
      instructions: 'Bata tudo vigorosamente no liquidificador. Beba imediatamente. Recomenda-se não coar para não perder as fibras (mas se o intestino estiver solto, pode coar).',
      substitutions: 'Se não tiver pepino, uma fatia grossa de Abacaxi ou Melão funciona muito bem como acelerador diurético.'
    }
  },
  {
    id: 4, tag: 'energia', emoji: '⚡', title: 'Protocolo Ativação Matinal',
    subtitle: 'Pico de disposição em 10min',
    desc: 'Com o tempo, estrógeno baixo tira energia. Acorde o seu corpo da forma certa para evitar o cansaço das 15h.',
    steps: [
      'Ao acordar, não pegue o celular.',
      'Tome seu shot matinal em jejum.',
      'Exponha seus olhos e pele à claridade do sol por 5 a 10 min (fixa seu ciclo circadiano).',
      'Pule corda ou faça 15 agachamentos rápidos.',
    ]
  },
  {
    id: 5, tag: 'libido', emoji: '💜', title: 'Protocolo Conexão Íntima',
    subtitle: 'Restaure o desejo',
    desc: 'Lubrificação externa e ações práticas para reativar os canais hormonais da libido.',
    steps: [
      'Tome banho morno pingando 2 gotas de óleo essencial de Ylang-Ylang no chão do box quente.',
      'Utilize hidratantes íntimos todos os dias (não confunda hidratante com lubrificante). Dê preferência a produtos à base de ácido hialurônico.',
      'Alimente-se de cacau (chocolate 70% ou mais) que auxilia na produção natural de feniletilamina (hormônio da paixão).',
    ]
  }
];

const tags = [
  { key: 'todos', label: 'Todos' },
  { key: 'fogacho', label: '🔥 Fogacho' },
  { key: 'sono', label: '🌙 Sono/Insônia' },
  { key: 'inchaço', label: '💧 Inchaço' },
  { key: 'energia', label: '⚡ Exaustão' },
  { key: 'libido', label: '💜 Libido' },
];

export default function ProtocolosPage() {
  const [filter, setFilter] = useState('todos');
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = filter === 'todos' ? protocols : protocols.filter(p => p.tag === filter);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '90px' }}>
      <div style={{ padding: '20px 20px 0' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>Protocolos e Receitas</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>O que comer, tomar e fazer.</p>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Tags filter */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {tags.map(t => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              style={{
                whiteSpace: 'nowrap', padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: '600',
                border: filter === t.key ? 'none' : '1px solid var(--border)',
                background: filter === t.key ? 'linear-gradient(135deg, var(--brand-rose), var(--brand-purple))' : 'transparent',
                color: filter === t.key ? 'white' : 'var(--text-muted)', cursor: 'pointer', flexShrink: 0,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Protocol cards */}
        {filtered.map(p => (
          <div key={p.id} className="card" style={{ padding: '0', overflow: 'hidden', cursor: 'pointer', border: expanded === p.id ? '1px solid var(--brand-rose)' : '1px solid var(--border)', transition: 'all 0.3s ease' }} onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
            <div style={{ padding: '18px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: expanded === p.id ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(200,88,122,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                  {p.emoji}
                </div>
                <div>
                  <p style={{ fontWeight: '700', fontSize: '15px', marginBottom: '2px', color: expanded === p.id ? 'white' : 'inherit' }}>{p.title}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.subtitle}</p>
                </div>
              </div>
              <ChevronRight size={18} color={expanded === p.id ? "var(--brand-rose)" : "var(--text-muted)"} style={{ transform: expanded === p.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            {expanded === p.id && (
              <div style={{ borderTop: '1px solid var(--border)', padding: '20px' }} onClick={e => e.stopPropagation()}>
                
                <p style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '20px', lineHeight: '1.6', background: 'var(--bg-glass)', padding: '12px', borderRadius: '8px' }}>
                  {p.desc}
                </p>
                
                {/* Passo a Passo de Ações */}
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--brand-rose)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>O que você deve fazer</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {p.steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand-rose), var(--brand-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '11px', fontWeight: '700', color: 'white' }}>
                        {i + 1}
                      </div>
                      <p style={{ fontSize: '14px', lineHeight: '1.5', paddingTop: '1px' }}>{step}</p>
                    </div>
                  ))}
                </div>

                {/* Bloco da Receita Específica (Se existir) */}
                {p.recipe && (
                  <div style={{ background: 'var(--bg-glass2)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
                    
                    {/* Cabeçalho Receita */}
                    <div style={{ background: 'linear-gradient(90deg, rgba(200,88,122,0.15) 0%, rgba(126,92,142,0.15) 100%)', padding: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>🥣</span>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'white' }}>{p.recipe.title}</h4>
                    </div>

                    <div style={{ padding: '20px' }}>
                      {/* Ingredientes */}
                      <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                         <Droplet size={14} color="var(--brand-teal)" />
                         INGREDIENTES
                      </p>
                      <ul style={{ paddingLeft: '22px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {p.recipe.ingredients.map((ing, idx) => (
                           <li style={{ fontSize: '14px', lineHeight: '1.5' }} key={idx}>{ing}</li>
                        ))}
                      </ul>

                      {/* Modo de Preparo */}
                      <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                         📝 MODO DE PREPARO E USO
                      </p>
                      <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                        {p.recipe.instructions}
                      </p>

                      {/* Substituições */}
                      <div style={{ background: 'rgba(212,165,106,0.1)', borderLeft: '3px solid var(--brand-gold)', padding: '12px 14px', borderRadius: '0 8px 8px 0' }}>
                        <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--brand-gold)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                           <RefreshCw size={12} />
                           OPÇÕES DE SUBSTITUIÇÃO
                        </p>
                        <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-primary)' }}>
                          {p.recipe.substitutions}
                        </p>
                      </div>
                    </div>

                  </div>
                )}
                
              </div>
            )}
          </div>
        ))}
      </div>

      <BottomNav active="protocolos" />
    </div>
  );
}
