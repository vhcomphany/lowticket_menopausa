'use client';

import { AlertTriangle, CreditCard } from 'lucide-react';

export default function InadimplentePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>

      <div style={{ fontSize: '64px', marginBottom: '24px' }}>💔</div>

      <h1 style={{ fontSize: '26px', fontWeight: '900', marginBottom: '12px', lineHeight: '1.3' }}>
        Seu acesso está <span style={{ background: 'linear-gradient(135deg, #C8587A, #7E5C8E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>pausado</span>
      </h1>

      <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.7', marginBottom: '32px', maxWidth: '340px', margin: '0 auto 32px' }}>
        Parece que houve um problema com o seu pagamento. Sua jornada hormonal está esperando por você — regularize agora e ganhe um desconto especial de retorno.
      </p>

      {/* Desconto card */}
      <div style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(200,88,122,0.15), rgba(126,92,142,0.15))', borderRadius: '20px', border: '2px solid rgba(200,88,122,0.4)', marginBottom: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Oferta exclusiva de retorno</p>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'line-through', marginBottom: '4px' }}>De R$ 147,00/ano</p>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '4px', marginBottom: '4px' }}>
          <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--brand-rose)', marginTop: '10px' }}>R$</span>
          <span style={{ fontSize: '56px', fontWeight: '900', color: 'var(--brand-rose)', lineHeight: '1' }}>97</span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>30% de desconto · somente agora</p>

        <button
          style={{
            background: 'linear-gradient(135deg, var(--brand-rose), var(--brand-purple))',
            color: 'white', border: 'none', borderRadius: '14px',
            padding: '16px 32px', fontSize: '16px', fontWeight: '800',
            cursor: 'pointer', width: '100%', letterSpacing: '0.3px',
            boxShadow: '0 8px 24px rgba(200,88,122,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          <CreditCard size={18} /> Regularizar agora com 30% OFF
        </button>
      </div>

      {/* Aviso */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '14px 16px', background: 'rgba(212,165,106,0.1)', borderRadius: '12px', border: '1px solid rgba(212,165,106,0.3)', textAlign: 'left', marginBottom: '24px' }}>
        <AlertTriangle size={18} color="var(--brand-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          Seu histórico de sintomas e progresso estão salvos. Assim que regularizar, você continua de onde parou.
        </p>
      </div>

      <button
        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px' }}
      >
        Entrar em contato com suporte
      </button>
    </div>
  );
}
