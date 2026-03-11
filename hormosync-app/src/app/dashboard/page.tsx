'use client';

import { useState } from 'react';
import { Flame, Moon, Zap, Heart, ChevronRight, Star, Lock, Bell } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

// Dados mockados — virão do Supabase depois
const userData = {
  name: 'Ana',
  profile: 'Cortisol Alto',
  phase: 'Insônia e Ansiedade',
  completedDays: 14,
  streakDays: 5,
  weekProgress: 68,
};

const symptoms = [
  { icon: <Flame size={16} />, label: 'Fogachos', value: 3, maxValue: 10, color: '#C8587A' },
  { icon: <Moon size={16} />, label: 'Qualidade do Sono', value: 6, maxValue: 10, color: '#7E5C8E' },
  { icon: <Zap size={16} />, label: 'Energia', value: 5, maxValue: 10, color: '#D4A56A' },
];

const todayTasks = [
  { id: 1, time: 'Manhã', task: 'Shot de limão + sal rosa (3 min)', done: true },
  { id: 2, time: 'Manhã', task: 'Respiração 4-7-8 ao acordar (3 min)', done: true },
  { id: 3, time: 'Tarde', task: 'Chá de Camomila com Mulungu (5 min)', done: false },
  { id: 4, time: 'Noite', task: 'Protocolo Noturno Anti-Cortisol (7 min)', done: false },
];

export default function Dashboard() {
  const [tasks, setTasks] = useState(todayTasks);
  const completedCount = tasks.filter(t => t.done).length;
  const progressPct = (completedCount / tasks.length) * 100;

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '90px' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '4px' }}>Olá, {userData.name} 👋</p>
            <h1 style={{ fontSize: '22px', fontWeight: '800', lineHeight: '1.2' }}>
              Seu painel de<br />
              <span className="gradient-text">acompanhamento</span>
            </h1>
          </div>
          <button style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Bell size={18} color="var(--text-muted)" />
          </button>
        </div>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Profile Card */}
        <div className="card-glow" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-rose">Perfil: {userData.profile}</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Seu diagnóstico identificou desequilíbrio em Cortisol e Estradiol. Seu protocolo está personalizado para essa fase.
              </p>
            </div>
          </div>

          {/* Streak */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, padding: '14px', background: 'rgba(200,88,122,0.08)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(200,88,122,0.2)' }}>
              <p style={{ fontSize: '24px', fontWeight: '800', color: 'var(--brand-rose)' }}>🔥 {userData.streakDays}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Dias seguidos</p>
            </div>
            <div style={{ flex: 1, padding: '14px', background: 'rgba(126,92,142,0.08)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(126,92,142,0.2)' }}>
              <p style={{ fontSize: '24px', fontWeight: '800', color: 'var(--brand-purple)' }}>{userData.completedDays}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Dias completados</p>
            </div>
            <div style={{ flex: 1, padding: '14px', background: 'rgba(74,155,142,0.08)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(74,155,142,0.2)' }}>
              <p style={{ fontSize: '24px', fontWeight: '800', color: 'var(--brand-teal)' }}>{userData.weekProgress}%</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Esta semana</p>
            </div>
          </div>
        </div>

        {/* Rotina de Hoje */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '700' }}>Rotina de hoje</h2>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{completedCount}/{tasks.length}</span>
          </div>

          {/* Progress */}
          <div className="progress-bar" style={{ marginBottom: '14px' }}>
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tasks.map(task => (
              <div
                key={task.id}
                className={`check-item ${task.done ? 'checked' : ''}`}
                onClick={() => toggleTask(task.id)}
              >
                <div className="check-circle">
                  {task.done && <span style={{ fontSize: '12px', color: 'white' }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '2px' }}>{task.time}</p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: task.done ? 'var(--text-muted)' : '#F0EAF5', textDecoration: task.done ? 'line-through' : 'none' }}>
                    {task.task}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visão Rápida de Sintomas */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '700' }}>Sintomas de hoje</h2>
            <a href="/evolucao" style={{ fontSize: '13px', color: 'var(--brand-rose)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
              Ver gráfico <ChevronRight size={14} />
            </a>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {symptoms.map((s, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: s.color }}>
                    {s.icon}
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#F0EAF5' }}>{s.label}</span>
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>{s.value}/10</span>
                </div>
                <div className="progress-bar">
                  <div style={{ height: '100%', width: `${(s.value / s.maxValue) * 100}%`, borderRadius: '100px', background: s.color, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SOS Button */}
        <div style={{ padding: '18px', background: 'linear-gradient(135deg, rgba(200,88,122,0.15), rgba(126,92,142,0.15))', borderRadius: '16px', border: '1px solid rgba(200,88,122,0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => window.location.href = '/sos'}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '18px' }}>🆘</span>
              <span style={{ fontWeight: '700', fontSize: '15px' }}>SOS Ansiedade / Sono</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Protocolo rápido para o seu perfil</p>
          </div>
          <ChevronRight size={20} color="var(--brand-rose)" />
        </div>

        {/* Premium Locked */}
        <div style={{ position: 'relative' }}>
          <div className="card" style={{ opacity: 0.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(212,165,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star size={20} color="var(--brand-gold)" />
                </div>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '15px' }}>Comunidade VIP</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>+1.200 mulheres • Suporte diário</p>
                </div>
              </div>
              <Lock size={18} color="var(--brand-gold)" />
            </div>
          </div>
          <div
            style={{ position: 'absolute', inset: 0, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(1px)' }}
            onClick={() => window.location.href = '/premium'}
          >
            <div style={{ background: 'linear-gradient(135deg, var(--brand-gold), #b8893a)', padding: '10px 20px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={14} color="white" />
              <span style={{ color: 'white', fontWeight: '700', fontSize: '13px' }}>Desbloquear Premium</span>
            </div>
          </div>
        </div>

      </div>

      <BottomNav active="home" />
    </div>
  );
}
