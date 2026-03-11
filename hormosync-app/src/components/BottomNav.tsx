'use client';

import Link from 'next/link';
import { Home, TrendingUp, Book, Headphones, User } from 'lucide-react';

interface BottomNavProps {
  active: 'home' | 'evolucao' | 'protocolos' | 'audios' | 'perfil';
}

const items = [
  { key: 'home', label: 'Início', icon: Home, href: '/dashboard' },
  { key: 'evolucao', label: 'Evolução', icon: TrendingUp, href: '/evolucao' },
  { key: 'protocolos', label: 'Protocolos', icon: Book, href: '/protocolos' },
  { key: 'audios', label: 'Áudios', icon: Headphones, href: '/audios' },
  { key: 'perfil', label: 'Perfil', icon: User, href: '/perfil' },
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
      background: 'rgba(15, 10, 18, 0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '8px 0 max(12px, env(safe-area-inset-bottom))',
      zIndex: 100,
    }}>
      {items.map(({ key, label, icon: Icon, href }) => (
        <Link key={key} href={href} className={`nav-item ${active === key ? 'active' : ''}`}>
          <Icon size={22} strokeWidth={active === key ? 2.5 : 1.8} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
