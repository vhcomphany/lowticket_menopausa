'use client';

import { useState } from 'react';
import { Flame, Moon, Zap, ChevronRight, Star, Lock, Bell } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useProfile, useTodayChecklist, useTodaySymptoms } from '@/hooks/useSupabase';

const getTaskTime = (taskId: string) => {
  if (taskId.startsWith('morning_')) return 'Manhã';
  if (taskId.startsWith('afternoon_')) return 'Tarde';
  if (taskId.startsWith('night_')) return 'Noite';
  return 'Qualquer hora';
};

export default function Dashboard() {
  const { profile, user, loading: profileLoading } = useProfile();
  const { entries, loading: checklistLoading, toggleTask } = useTodayChecklist(user?.id);
  const { symptoms, saveSymptoms } = useTodaySymptoms(user?.id);
  const [showSymptomsModal, setShowSymptomsModal] = useState(false);
  const [tempValues, setTempValues] = useState({ fogacho: 5, sono: 5, energia: 5, humor: 5 });

  const completedCount = entries.filter(e => e.completed).length;
  const progressPct = entries.length > 0 ? (completedCount / entries.length) * 100 : 0;

  // Use profile data or friendly fallbacks
  const displayName = profile?.name?.split(' ')[0] || 'bem-vinda';
  const displayProfile = profile?.hormonal_profile && profile.hormonal_profile !== 'pending'
    ? profile.hormonal_profile
    : 'Em análise';

  const symptomBars = [
    { icon: <Flame size={16} />, label: 'Fogachos', value: symptoms?.fogacho ?? null, color: '#C8587A' },
    { icon: <Moon size={16} />, label: 'Qualidade do Sono', value: symptoms?.sono ?? null, color: '#7E5C8E' },
    { icon: <Zap size={16} />, label: 'Energia', value: symptoms?.energia ?? null, color: '#D4A56A' },
  ];

  if (profileLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🌸</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Carregando seu painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '90px' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '4px' }}>Olá, {displayName} 👋</p>
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
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span className="badge badge-rose">Perfil: {displayProfile}</span>
            {profile?.is_premium && <span className="badge" style={{ background: 'rgba(212,165,106,0.15)', color: 'var(--brand-gold)', border: '1px solid rgba(212,165,106,0.3)' }}>👑 Premium</span>}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
            {profile?.phase
              ? `Fase atual: ${profile.phase}. Seu protocolo está personalizado para esse momento.`
              : 'Seu protocolo está personalizado com base no seu diagnóstico hormonal.'}
          </p>

          {/* Streak metrics */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, padding: '14px', background: 'rgba(200,88,122,0.08)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(200,88,122,0.2)' }}>
              <p style={{ fontSize: '24px', fontWeight: '800', color: 'var(--brand-rose)' }}>🔥 {profile?.streak_days ?? 0}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Dias seguidos</p>
            </div>
            <div style={{ flex: 1, padding: '14px', background: 'rgba(126,92,142,0.08)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(126,92,142,0.2)' }}>
              <p style={{ fontSize: '24px', fontWeight: '800', color: 'var(--brand-purple)' }}>{profile?.completed_days ?? 0}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Dias completados</p>
            </div>
            <div style={{ flex: 1, padding: '14px', background: 'rgba(74,155,142,0.08)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(74,155,142,0.2)' }}>
              <p style={{ fontSize: '24px', fontWeight: '800', color: 'var(--brand-teal)' }}>{Math.round(progressPct)}%</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Hoje</p>
            </div>
          </div>
        </div>

        {/* Rotina de Hoje */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '700' }}>Rotina de hoje</h2>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {checklistLoading ? '...' : `${completedCount}/${entries.length}`}
            </span>
          </div>

          <div className="progress-bar" style={{ marginBottom: '14px' }}>
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {checklistLoading
              ? [1, 2, 3, 4].map(i => (
                  <div key={i} style={{ height: '64px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid var(--border)', animation: 'pulse 1.5s infinite' }} />
                ))
              : entries.map(entry => (
                  <div
                    key={entry.id}
                    className={`check-item ${entry.completed ? 'checked' : ''}`}
                    onClick={() => toggleTask(entry.task_id, entry.completed)}
                  >
                    <div className="check-circle">
                      {entry.completed && <span style={{ fontSize: '12px', color: 'white' }}>✓</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                        {getTaskTime(entry.task_id)}
                      </p>
                      <p style={{
                        fontSize: '14px', fontWeight: '500',
                        color: entry.completed ? 'var(--text-muted)' : '#F0EAF5',
                        textDecoration: entry.completed ? 'line-through' : 'none',
                      }}>
                        {entry.task_label}
                      </p>
                    </div>
                  </div>
                ))
            }
          </div>
        </div>

        {/* Sintomas de Hoje */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '700' }}>Sintomas de hoje</h2>
            <a href="/evolucao" style={{ fontSize: '13px', color: 'var(--brand-rose)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
              Ver gráfico <ChevronRight size={14} />
            </a>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {symptoms === null ? (
              <div style={{ textAlign: 'center', padding: '8px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '12px' }}>
                  Você ainda não registrou seus sintomas hoje.
                </p>
                <button
                  className="btn-primary"
                  style={{ fontSize: '13px', padding: '10px 20px' }}
                  onClick={() => setShowSymptomsModal(true)}
                >
                  + Registrar agora
                </button>
              </div>
            ) : (
              <>
                {symptomBars.map((s, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: s.color }}>
                        {s.icon}
                        <span style={{ fontSize: '13px', fontWeight: '500', color: '#F0EAF5' }}>{s.label}</span>
                      </div>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        {s.value ?? '—'}/10
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div style={{ height: '100%', width: `${((s.value ?? 0) / 10) * 100}%`, borderRadius: '100px', background: s.color, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                ))}
                <button
                  style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  onClick={() => setShowSymptomsModal(true)}
                >
                  ✏️ Editar registro de hoje
                </button>
              </>
            )}
          </div>
        </div>

        {/* SOS Button */}
        <div
          style={{ padding: '18px', background: 'linear-gradient(135deg, rgba(200,88,122,0.15), rgba(126,92,142,0.15))', borderRadius: '16px', border: '1px solid rgba(200,88,122,0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => window.location.href = '/sos'}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '18px' }}>🆘</span>
              <span style={{ fontWeight: '700', fontSize: '15px' }}>
                SOS {profile?.main_symptom ? profile.main_symptom : 'Sintoma'}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Protocolo rápido para o seu perfil</p>
          </div>
          <ChevronRight size={20} color="var(--brand-rose)" />
        </div>

        {/* Premium Locked (only if not premium) */}
        {!profile?.is_premium && (
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
        )}

      </div>

      {/* Modal: Registro de Sintomas */}
      {showSymptomsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowSymptomsModal(false)}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '24px 24px 0 0', padding: '28px', width: '100%', maxWidth: '430px', margin: '0 auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: '40px', height: '4px', background: 'var(--border)', borderRadius: '100px', margin: '0 auto 24px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Como você está hoje?</h3>
            {[
              { key: 'fogacho', label: '🔥 Intensidade dos Fogachos' },
              { key: 'sono', label: '🌙 Qualidade do Sono' },
              { key: 'energia', label: '⚡ Nível de Energia' },
              { key: 'humor', label: '💜 Humor Geral' },
            ].map(({ key, label }) => (
              <div key={key} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{label}</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--brand-rose)' }}>
                    {tempValues[key as keyof typeof tempValues]}/10
                  </span>
                </div>
                <input
                  type="range" min="1" max="10"
                  className="symptom-slider"
                  value={tempValues[key as keyof typeof tempValues]}
                  onChange={e => setTempValues(prev => ({ ...prev, [key]: +e.target.value }))}
                />
              </div>
            ))}
            <button
              className="btn-primary"
              onClick={async () => {
                await saveSymptoms(tempValues);
                setShowSymptomsModal(false);
              }}
            >
              Salvar registro ✓
            </button>
          </div>
        </div>
      )}

      <BottomNav active="home" />
    </div>
  );
}
