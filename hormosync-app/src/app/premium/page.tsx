'use client';

import { ChevronRight, Star, Users, Book, Zap } from 'lucide-react';

const features = [
  {
    icon: <Users size={22} color="#D4A56A" />,
    title: 'Comunidade VIP Exclusiva',
    desc: '+1.200 mulheres compartilhando experiências, dicas e apoio diário. Moderada por especialistas.',
    bg: 'rgba(212,165,106,0.1)',
  },
  {
    icon: <Book size={22} color="#C8587A" />,
    title: 'Biblioteca Hormonal Completa',
    desc: 'Acesso a todos os protocolos avançados, guias especializados e fórmulas naturais premium.',
    bg: 'rgba(200,88,122,0.1)',
  },
  {
    icon: <Zap size={22} color="#7E5C8E" />,
    title: 'Acesso Vitalício ao App',
    desc: 'Nunca mais pague renovação. Acesso ilimitado para sempre, com todas as atualizações futuras incluídas.',
    bg: 'rgba(126,92,142,0.1)',
  },
];

export default function PremiumPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header visual */}
      <div style={{ background: 'linear-gradient(180deg, rgba(212,165,106,0.2) 0%, transparent 100%)', padding: '40px 24px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>👑</div>
        <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px', lineHeight: '1.2' }}>
          Torne-se{' '}
          <span style={{ background: 'linear-gradient(135deg, #D4A56A, #C8587A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Premium
          </span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', maxWidth: '300px', margin: '0 auto' }}>
          Sua jornada hormonal completa, com suporte de comunidade e acesso para sempre.
        </p>
      </div>

      <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>

        {/* Oferta */}
        <div style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(212,165,106,0.15), rgba(200,88,122,0.1))', borderRadius: '20px', border: '2px solid rgba(212,165,106,0.4)', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'line-through', marginBottom: '4px' }}>De R$ 347,00</p>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '4px', marginBottom: '4px' }}>
            <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--brand-gold)', marginTop: '10px' }}>R$</span>
            <span style={{ fontSize: '56px', fontWeight: '900', color: 'var(--brand-gold)', lineHeight: '1' }}>147</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>pagamento único · acesso vitalício</p>

          <button
            style={{
              background: 'linear-gradient(135deg, #D4A56A, #b8893a)',
              color: 'white', border: 'none', borderRadius: '14px',
              padding: '16px 32px', fontSize: '16px', fontWeight: '800',
              cursor: 'pointer', width: '100%', letterSpacing: '0.3px',
              boxShadow: '0 8px 24px rgba(212,165,106,0.4)',
            }}
          >
            Quero o Acesso Premium 👑
          </button>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}>
            ✓ Garantia de 7 dias · ✓ Pagamento seguro
          </p>
        </div>

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <p style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>{f.title}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Downsell */}
        <div style={{ padding: '20px', borderRadius: '16px', border: '1px dashed var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            R$ 147 não cabe no seu bolso agora?
          </p>
          <button
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 24px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', width: '100%' }}
          >
            Pegar apenas a Comunidade VIP por R$ 47
          </button>
        </div>

        <button
          onClick={() => window.history.back()}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', padding: '8px' }}
        >
          Não, obrigada. Continuar sem Premium.
        </button>
      </div>
    </div>
  );
}
