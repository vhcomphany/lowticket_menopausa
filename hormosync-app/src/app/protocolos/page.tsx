'use client';

import { useState } from 'react';
import { ChevronRight, Filter } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const protocols = [
  {
    id: 1, tag: 'fogacho', emoji: '🔥', title: 'Protocolo Anti-Fogacho',
    subtitle: 'Alívio em 3 minutos',
    desc: 'Sequência de 3 passos para interromper a onda de calor assim que ela começa.',
    steps: [
      'Respire fundo pelo nariz por 4 segundos.',
      'Segure o ar por 7 segundos.',
      'Solte lentamente pela boca em 8 segundos.',
      'Repita 3 vezes. Coloque uma toalha fria na nuca se disponível.',
    ],
  },
  {
    id: 2, tag: 'sono', emoji: '🌙', title: 'Protocolo Calmante Noturno',
    subtitle: 'Prepare o corpo para dormir',
    desc: 'Sequência de 15 minutos antes de dormir para baixar o Cortisol e induzir o sono.',
    steps: [
      'Desligue todas as telas 30 min antes.',
      'Tome 1 xícara do Chá Anti-Cortisol (Mulungu + Maracujá).',
      'Faça a Respiração 4-7-8 por 3 ciclos.',
      'Escreva 1 coisa boa do dia no diário.',
    ],
  },
  {
    id: 3, tag: 'sono', emoji: '😰', title: 'SOS Acordar de Madrugada',
    subtitle: 'Para quando acorda às 3h',
    desc: 'Você acordou às 3h com calor e coração acelerado. Siga este protocolo.',
    steps: [
      'Não pegue o celular.',
      'Coloque os pés no chão frio por 30 segundos.',
      'Beba um copo de água gelada lentamente.',
      'Faça 3 respirações longas e volte a deitar voltada para o lado esquerdo.',
    ],
  },
  {
    id: 4, tag: 'energia', emoji: '⚡', title: 'Protocolo Energia Hormonal',
    subtitle: 'Manhã de alta performance',
    desc: 'Rotina matinal de 5 minutos para ativar o metabolismo e combater o cansaço.',
    steps: [
      'Tome o Shot Matinal (limão + gengibre + pitada de sal rosa).',
      'Faça 10 agachamentos lentos (ativa o cortisol positivo).',
      'Tome sol por 5 minutos direto na pele.',
      'Café ou chá verde somente 1h após acordar.',
    ],
  },
  {
    id: 5, tag: 'libido', emoji: '💜', title: 'Protocolo Resgate da Vitalidade',
    subtitle: 'Reconectar com o próprio corpo',
    desc: 'Práticas semanais para restaurar o desejo e a autoimagem durante a menopausa.',
    steps: [
      'Banho morno com 2 gotas de óleo essencial de ylang-ylang.',
      'Automassagem abdominal suave por 5 minutos (melhora circulação pélvica).',
      'Hidratação íntima diária (produto à base de ácido hialurônico).',
      'Comunique ao parceiro: explore sem pressão de resultado.',
    ],
  },
  {
    id: 6, tag: 'inchaço', emoji: '💧', title: 'Protocolo Anti-Inchaço',
    subtitle: 'Desinchar em 24h',
    desc: 'Estratégia alimentar e de movimentos para reduzir retenção hídrica rápido.',
    steps: [
      'Reduza sal e alimentos ultraprocessados por 24h.',
      'Beba 2L de água com limão espremido.',
      'Suco verde: couve + pepino + limão + hortelã.',
      'Caminhe 15 minutos para ativar a drenagem linfática.',
    ],
  },
];

const tags = [
  { key: 'todos', label: 'Todos' },
  { key: 'fogacho', label: '🔥 Fogacho' },
  { key: 'sono', label: '🌙 Sono' },
  { key: 'energia', label: '⚡ Energia' },
  { key: 'libido', label: '💜 Libido' },
  { key: 'inchaço', label: '💧 Inchaço' },
];

export default function ProtocolosPage() {
  const [filter, setFilter] = useState('todos');
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = filter === 'todos' ? protocols : protocols.filter(p => p.tag === filter);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '90px' }}>
      <div style={{ padding: '20px 20px 0' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>Protocolos</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Soluções naturais por sintoma</p>
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
          <div key={p.id} className="card" style={{ padding: '0', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
            <div style={{ padding: '18px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(200,88,122,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                  {p.emoji}
                </div>
                <div>
                  <p style={{ fontWeight: '700', fontSize: '15px', marginBottom: '2px' }}>{p.title}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.subtitle}</p>
                </div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" style={{ transform: expanded === p.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            {expanded === p.id && (
              <div style={{ borderTop: '1px solid var(--border)', padding: '18px' }}>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.6' }}>{p.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {p.steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand-rose), var(--brand-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '11px', fontWeight: '700', color: 'white' }}>
                        {i + 1}
                      </div>
                      <p style={{ fontSize: '14px', lineHeight: '1.6', paddingTop: '2px' }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <BottomNav active="protocolos" />
    </div>
  );
}
