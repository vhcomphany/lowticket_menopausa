'use client';

import { useState } from 'react';
import { ChevronRight, LogOut, CreditCard, RefreshCw, Lock, Star, Bell, User } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const userData = {
  name: 'Ana Souza',
  email: 'ana@email.com',
  plan: 'Anual',
  status: 'ativo',
  expiresAt: '11/03/2027',
  profile: 'Cortisol Alto',
  joinedAt: '11/03/2026',
  daysActive: 14,
};

export default function PerfilPage() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '90px' }}>
      <div style={{ padding: '20px 20px 0' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>Perfil</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Suas informações e assinatura</p>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* User card */}
        <div className="card-glow" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand-rose), var(--brand-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '36px' }}>
            🌸
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>{userData.name}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '12px' }}>{userData.email}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-rose">Perfil: {userData.profile}</span>
            <span className="badge badge-teal">Membro desde {userData.joinedAt}</span>
          </div>
        </div>

        {/* Subscription card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Minha Assinatura</h3>
            <span style={{ padding: '4px 12px', borderRadius: '100px', background: 'rgba(74,155,142,0.15)', color: 'var(--brand-teal)', fontSize: '12px', fontWeight: '700', border: '1px solid rgba(74,155,142,0.3)' }}>
              ● {userData.status.toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Plano', value: userData.plan },
              { label: 'Próxima cobrança', value: userData.expiresAt },
              { label: 'Dias de uso', value: `${userData.daysActive} dias` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{label}</span>
                <span style={{ fontWeight: '600', fontSize: '14px' }}>{value}</span>
              </div>
            ))}
          </div>

          <button className="btn-secondary" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <CreditCard size={16} /> Gerenciar assinatura
          </button>
        </div>

        {/* Premium upsell */}
        <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(212,165,106,0.15), rgba(200,88,122,0.1))', borderRadius: '16px', border: '1px solid rgba(212,165,106,0.3)', cursor: 'pointer' }}
          onClick={() => window.location.href = '/premium'}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Star size={22} color="var(--brand-gold)" fill="var(--brand-gold)" />
              <div>
                <p style={{ fontWeight: '700', fontSize: '15px' }}>Upgrade para Premium</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Comunidade VIP + Biblioteca Completa</p>
              </div>
            </div>
            <ChevronRight size={18} color="var(--brand-gold)" />
          </div>
        </div>

        {/* Settings */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Preferências</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Bell size={18} color="var(--text-muted)" />
              <span style={{ fontSize: '14px' }}>Notificações diárias</span>
            </div>
            <div
              onClick={() => setNotifications(!notifications)}
              style={{
                width: '48px', height: '26px', borderRadius: '100px', cursor: 'pointer',
                background: notifications ? 'linear-gradient(135deg, var(--brand-rose), var(--brand-purple))' : 'var(--border)',
                position: 'relative', transition: 'background 0.2s',
              }}
            >
              <div style={{
                position: 'absolute', top: '3px', left: notifications ? '25px' : '3px',
                width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                transition: 'left 0.2s',
              }} />
            </div>
          </div>
        </div>

        {/* Refazer diagnóstico */}
        <button
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          onClick={() => window.location.href = '/diagnostico'}
        >
          <RefreshCw size={16} /> Refazer meu Diagnóstico Hormonal
        </button>

        {/* Logout */}
        <button
          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px' }}
          onClick={() => window.location.href = '/'}
        >
          <LogOut size={16} /> Sair da conta
        </button>

      </div>

      <BottomNav active="perfil" />
    </div>
  );
}
