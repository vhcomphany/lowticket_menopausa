'use client';

import Link from 'next/link';
import { Home, TrendingUp, UtensilsCrossed, Pill, User } from 'lucide-react';

interface BottomNavProps {
  active: 'home' | 'evolucao' | 'protocolos' | 'suplementos' | 'perfil';
}

const items = [
  { key: 'home',        label: 'Início',   icon: Home,            href: '/dashboard' },
  { key: 'evolucao',    label: 'Evolução', icon: TrendingUp,      href: '/evolucao' },
  { key: 'protocolos',  label: 'Receitas', icon: UtensilsCrossed, href: '/receitas' },
  { key: 'suplementos', label: 'Cápsulas', icon: Pill,            href: '/suplementos' },
  { key: 'perfil',      label: 'Perfil',   icon: User,            href: '/perfil' },
];

export default function BottomNav({ active }: BottomNavProps) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px',
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '6px 8px max(10px, env(safe-area-inset-bottom))',
      zIndex: 100,
    }}>
      {items.map(({ key, label, icon: Icon, href }) => {
        const isActive = active === key;
        return (
          <Link
            key={key}
            href={href}
            className={`nav-item${isActive ? ' active' : ''}`}
            style={{ flex: 1 }}
          >
            {isActive ? (
              <div style={{
                background: 'linear-gradient(135deg, rgba(232,84,122,0.18), rgba(155,106,176,0.18))',
                border: '1px solid rgba(232,84,122,0.25)',
                borderRadius: '12px',
                padding: '8px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
              }}>
                <Icon size={20} strokeWidth={2.5} color="var(--brand-rose)" />
                <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--brand-rose)', letterSpacing: '0.3px' }}>
                  {label}
                </span>
              </div>
            ) : (
              <>
                <Icon size={20} strokeWidth={1.7} />
                <span>{label}</span>
              </>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
