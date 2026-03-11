'use client';

import { useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';

const sosOptions = [
  {
    id: 'fogacho', emoji: '🔥', title: 'SOS Fogacho',
    subtitle: 'Estou com onda de calor agora',
    color: '#C8587A',
    steps: [
      'Pare o que está fazendo e sente (ou fique em pé quieta).',
      'Respire fundo pelo nariz por 4 segundos.',
      'Segure por 7 segundos e solte lentamente em 8.',
      'Coloque água fria no pulso ou nuca se possível.',
      'Repita 3 ciclos. O pico passa em ~4 minutos.',
    ],
  },
  {
    id: 'ansiedade', emoji: '💓', title: 'SOS Ansiedade',
    subtitle: 'Coração acelerado e nervosismo',
    color: '#7E5C8E',
    steps: [
      'Pressione levemente o centro do peito com a mão.',
      'Respire lentamente, sentindo a mão subir e descer.',
      'Nomeie 5 coisas que você vê ao redor.',
      'Tome um copo de água devagar.',
      'Repita a si mesma: "Isso vai passar. Eu estou segura."',
    ],
  },
  {
    id: 'madrugada', emoji: '🌒', title: 'SOS Madrugada',
    subtitle: 'Acordei e não consigo dormir',
    color: '#4A9B8E',
    steps: [
      'Não pegue o celular ou acenda a luz.',
      'Coloque os pés no chão frio por 30 segundos.',
      'Beba 1 copo de água em temperatura ambiente.',
      'Volte à cama e deite no lado esquerdo.',
      'Faça 3 respirações profundas e lentas.',
    ],
  },
  {
    id: 'humor', emoji: '😢', title: 'SOS Choro / Tristeza',
    subtitle: 'Me sinto mal sem saber por quê',
    color: '#D4A56A',
    steps: [
      'Permita o choro — ele é liberação de cortisol.',
      'Não tente "controlar" o sentimento, apenas observe.',
      'Escreva 1 frase no diário sobre o que está sentindo.',
      'Tome um chá quente e ligue para alguém de confiança.',
      'Lembre: isso é hormonal, não é fraqueza.',
    ],
  },
];

export default function SOSPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const current = sosOptions.find(s => s.id === selected);

  if (current) {
    return (
      <div style={{ minHeight: '100vh', padding: '24px' }}>
        <button
          onClick={() => setSelected(null)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', marginBottom: '28px' }}
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>{current.emoji}</div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>{current.title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{current.subtitle}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {current.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '16px', background: `${current.color}10`, borderRadius: '14px', border: `1px solid ${current.color}30` }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: current.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', fontWeight: '800', color: 'white' }}>
                {i + 1}
              </div>
              <p style={{ fontSize: '15px', lineHeight: '1.6', paddingTop: '3px' }}>{step}</p>
            </div>
          ))}
        </div>

        <button
          className="btn-primary"
          style={{ background: `linear-gradient(135deg, ${current.color}, ${current.color}aa)` }}
          onClick={() => setSelected(null)}
        >
          Estou melhor ✓
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px' }}>🆘 Precisa de ajuda?</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Selecione o que está sentindo agora:</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {sosOptions.map(s => (
          <button
            key={s.id}
            onClick={() => setSelected(s.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '16px', padding: '20px',
              background: `${s.color}10`, borderRadius: '16px', border: `1px solid ${s.color}40`,
              cursor: 'pointer', textAlign: 'left', width: '100%',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '32px', flexShrink: 0 }}>{s.emoji}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: '700', fontSize: '16px', color: s.color, marginBottom: '4px' }}>{s.title}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{s.subtitle}</p>
            </div>
            <ChevronRight size={18} color={s.color} />
          </button>
        ))}
      </div>

      <button
        onClick={() => window.location.href = '/dashboard'}
        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '14px', display: 'block', margin: '28px auto 0', textAlign: 'center' }}
      >
        Voltar ao painel
      </button>
    </div>
  );
}
