'use client';

import { useState, useEffect } from 'react';
import { Flame, Moon, Zap, ChevronRight, Bell, Sparkles, LockKeyhole } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useProfile, useTodayChecklist, useTodaySymptoms } from '@/hooks/useSupabase';
import { RECIPES, type Recipe } from '@/data/recipes';

// Theme toggle logic
function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const t = localStorage.getItem('hs_theme');
    if (t === 'light') setIsDark(false);
  }, []);
  const toggle = () => {
    const next = isDark ? 'light' : 'dark';
    localStorage.setItem('hs_theme', next);
    document.documentElement.setAttribute('data-theme', next === 'dark' ? '' : 'light');
    setIsDark(!isDark);
  };
  return (
    <button onClick={toggle} className={`theme-toggle${isDark ? '' : ' light-on'}`} aria-label="Trocar tema">
      <div className="theme-toggle-knob" style={{ left: isDark ? '3px' : '27px' }}>
        {isDark ? '🌙' : '☀️'}
      </div>
    </button>
  );
}

const getTaskTime = (taskId: string) => {
  if (taskId.startsWith('morning_')) return 'Manhã';
  if (taskId.startsWith('afternoon_')) return 'Tarde';
  if (taskId.startsWith('night_')) return 'Noite';
  return 'Qualquer hora';
};

const STATIC_PROTOCOLS: Record<string, { name: string, emoji: string, forWhat: string, instructions: string, time: string }> = {
  morning_breath: {
    name: 'Respiração 4-7-8',
    emoji: '🌬️',
    forWhat: 'Reduz instantaneamente o cortisol matinal e a ansiedade induzida pela menopausa.',
    instructions: '1. Expire completamente pela boca, fazendo um som de "woosh".\n2. Feche a boca e inspire silenciosamente pelo nariz contando até 4.\n3. Prenda a respiração contando até 7.\n4. Expire completamente pela boca, fazendo o som de "woosh", contando até 8.\n5. Repita este ciclo 4 vezes assim que acordar.',
    time: '3 min'
  },
  night_protocol: {
    name: 'Protocolo Noturno Anti-Cortisol',
    emoji: '🌙',
    forWhat: 'Prepara seu corpo para produzir melatonina, evitando acordar de madrugada (insônia de manutenção).',
    instructions: '1. Desligue telas (celular, TV) ou coloque no modo de luz amarela/noturna 30 minutos antes de deitar.\n2. Diminua as luzes da casa e evite luzes brancas no teto.\n3. Se possível, leia um livro físico ou ouça um som relaxante.\n4. Mantenha o quarto completamente escuro e fresco.',
    time: '30 min'
  },
  morning_shot: {
    name: 'Shot Anti-Inflamatório',
    emoji: '💉',
    forWhat: 'Desinflama as células e ativa o metabolismo lento da menopausa.',
    instructions: '1. Esprema 1/2 limão em um copo.\n2. Adicione 1 colher de café de açafrão-da-terra (cúrcuma).\n3. Adicione 1 pitada de pimenta-do-reino preta (essencial para absorver o açafrão).\n4. Adicione um pouco de água em temperatura ambiente.\n5. Beba tudo de uma vez logo após acordar.',
    time: '3 min'
  },
  afternoon_tea: {
    name: 'Chá da Tarde Relaxante',
    emoji: '🍵',
    forWhat: 'Quebra o pico de estresse da tarde, preparando o sistema nervoso para a noite.',
    instructions: '1. Esquente 200ml de água até ferver.\n2. Adicione 1 colher de sopa de flores de camomila e 1 colher de chá de mulungu.\n3. Abafe por 10 minutos.\n4. Coe e beba quente ou morno. Não adoce com açúcar (use um pouco de stevia se estritamente necessário).',
    time: '5 min'
  }
};

export default function Dashboard() {
  const { profile, user, loading: profileLoading } = useProfile();
  const { entries, loading: checklistLoading, toggleTask } = useTodayChecklist(user?.id);
  const { symptoms, saveSymptoms } = useTodaySymptoms(user?.id);
  const [showSymptomsModal, setShowSymptomsModal] = useState(false);
  const [tempValues, setTempValues] = useState({ fogacho: 5, sono: 5, energia: 5, humor: 5 });
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<typeof STATIC_PROTOCOLS[string] | null>(null);

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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{ position: 'relative', width: '64px', height: '64px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--grad-primary)', opacity: 0.2, animation: 'pulse-glow 2s infinite' }} />
          <div style={{ position: 'absolute', inset: '8px', borderRadius: '50%', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🌸</div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Carregando seu painel...</p>
      </div>
    );
  }

  // ─── build score ring ───
  const scoreRadius = 38;
  const scoreCircumference = 2 * Math.PI * scoreRadius;
  const dashOffset = scoreCircumference * (1 - progressPct / 100);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '100px', position: 'relative' }}>

      {/* Decorative orbs */}
      <div className="orb orb-rose" style={{ width: '260px', height: '260px', top: '-80px', right: '-60px', opacity: 0.5 }} />
      <div className="orb orb-mauve" style={{ width: '200px', height: '200px', top: '140px', left: '-80px', opacity: 0.35 }} />

      {/* ─── HEADER ─────────────────────────────────── */}
      <div style={{ padding: '56px 20px 20px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 500 }}>
              Olá, {displayName} 👋
            </p>
            <h1 style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1.2 }}>
              Seu painel de{' '}
              <span className="gradient-text">saúde</span>
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <ThemeToggle />
            <button style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-glass2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Bell size={17} color="var(--text-muted)" />
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>

        {/* ─── HERO CARD ─────────────────────────────── */}
        <div className="card-glow stagger-children" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

            {/* Score ring SVG */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <svg width="90" height="90" viewBox="0 0 90 90">
                <circle cx="45" cy="45" r={scoreRadius}
                  fill="none" stroke="var(--bg-glass2)" strokeWidth="6" />
                <circle cx="45" cy="45" r={scoreRadius}
                  fill="none"
                  stroke="url(#ringGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={scoreCircumference}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 45 45)"
                  className="score-ring"
                />
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#E8547A" />
                    <stop offset="100%" stopColor="#9B6AB0" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'Playfair Display, serif' }}>{Math.round(progressPct)}%</span>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 600 }}>hoje</span>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {profile?.is_premium && <span className="badge badge-gold">👑 Premium</span>}
                <span className="badge badge-rose">{displayProfile}</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {profile?.phase
                  ? `Fase: ${profile.phase}`
                  : 'Protocolo personalizado ativo.'}
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <div className="stat-card">
                  <div className="stat-card-num" style={{ color: 'var(--brand-rose)' }}>🔥 {profile?.streak_days ?? 0}</div>
                  <div className="stat-card-label">Dias seguidos</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-num" style={{ color: 'var(--brand-mauve)' }}>{profile?.completed_days ?? 0}</div>
                  <div className="stat-card-label">Completados</div>
                </div>
              </div>
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
              : entries.map(entry => {
                  const isRecipe = entry.task_id.includes('::');
                  const recipeId = isRecipe ? entry.task_id.split('::')[1].split('_')[0] : null;
                  const rawTaskId = entry.task_id.replace(/_\d+$/, '');
                  const staticProtocol = STATIC_PROTOCOLS[rawTaskId];

                  return (
                    <div
                      key={entry.id}
                      className={`check-item ${entry.completed ? 'checked' : ''}`}
                      onClick={() => {
                        if (recipeId) {
                          const r = RECIPES.find(x => x.id === recipeId);
                          if (r) setSelectedRecipe(r);
                          else toggleTask(entry.task_id, entry.completed);
                        } else if (staticProtocol) {
                          setSelectedProtocol(staticProtocol);
                        } else {
                          toggleTask(entry.task_id, entry.completed);
                        }
                      }}
                    >
                      <div className="check-circle" onClick={(e) => { e.stopPropagation(); toggleTask(entry.task_id, entry.completed); }}>
                        {entry.completed && <span style={{ fontSize: '12px', color: 'white' }}>✓</span>}
                      </div>
                      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
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
                        {isRecipe && (
                           <button style={{ background: 'rgba(200,88,122,0.1)', border: 'none', color: 'var(--brand-rose)', padding: '6px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                             Receita
                           </button>
                        )}
                        {!isRecipe && staticProtocol && (
                           <button style={{ background: 'rgba(74,155,142,0.1)', border: 'none', color: 'var(--brand-teal)', padding: '6px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                             Como fazer
                           </button>
                        )}
                      </div>
                    </div>
                  );
                })
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
                    <Sparkles size={20} color="var(--brand-gold)" />
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '15px' }}>Comunidade VIP</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>+1.200 mulheres • Suporte diário</p>
                  </div>
                </div>
                <LockKeyhole size={18} color="var(--brand-gold)" />
              </div>
            </div>
            <div
              style={{ position: 'absolute', inset: 0, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(1px)' }}
              onClick={() => window.location.href = '/premium'}
            >
              <div style={{ background: 'linear-gradient(135deg, var(--brand-gold), #b8893a)', padding: '10px 20px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LockKeyhole size={14} color="white" />
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

      {/* MODAL DA RECEITA */}
      {selectedRecipe && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
          zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
        }} onClick={() => setSelectedRecipe(null)}>
          <div style={{
            background: 'var(--bg-card)', width: '100%', maxWidth: '430px', margin: '0 auto',
            borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
            padding: '24px', paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
            maxHeight: '85vh', overflowY: 'auto',
            borderTop: '1px solid var(--border)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(200,88,122,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>
                  {selectedRecipe.emoji}
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>{selectedRecipe.name}</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{selectedRecipe.subtitle}</p>
                </div>
              </div>
              <button onClick={() => setSelectedRecipe(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text-muted)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <p style={{ fontSize: '14px', color: '#F0EAF5', lineHeight: '1.6', marginBottom: '20px', background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
              {selectedRecipe.description}
            </p>

            <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🥣 Ingredientes</p>
            <ul style={{ paddingLeft: '20px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {selectedRecipe.ingredients.map((ing, i) => <li key={i} style={{ fontSize: '14px', lineHeight: '1.5' }}>{ing}</li>)}
            </ul>

            <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📝 Como Fazer</p>
            <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: selectedRecipe.substitutions ? '20px' : '0' }}>{selectedRecipe.instructions}</p>

            {selectedRecipe.substitutions && (
              <div style={{ background: 'rgba(212,165,106,0.1)', borderLeft: '3px solid var(--brand-gold)', padding: '12px 14px', borderRadius: '0 8px 8px 0', marginBottom: selectedRecipe.scienceNote ? '16px' : '0' }}>
                <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--brand-gold)', marginBottom: '4px' }}>🔄 Substituições</p>
                <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#F0EAF5' }}>{selectedRecipe.substitutions}</p>
              </div>
            )}

            {selectedRecipe.scienceNote && (
              <div style={{ background: 'rgba(126,92,142,0.1)', borderLeft: '3px solid var(--brand-purple)', padding: '12px 14px', borderRadius: '0 8px 8px 0', marginTop: '12px' }}>
                <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--brand-purple)', marginBottom: '4px' }}>🔬 Por que funciona</p>
                <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#F0EAF5' }}>{selectedRecipe.scienceNote}</p>
              </div>
            )}

            {selectedRecipe.restrictions && selectedRecipe.restrictions.length > 0 && (
              <div style={{ background: 'rgba(200,88,122,0.08)', border: '1px solid rgba(200,88,122,0.3)', borderRadius: '10px', padding: '12px', marginTop: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--brand-rose)', marginBottom: '6px' }}>⛔ Restrições</p>
                {selectedRecipe.restrictions.map((r, i) => <p key={i} style={{ fontSize: '13px', color: '#F0EAF5' }}>• {r}</p>)}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600' }}>
              <span>⏱ Tempo: {selectedRecipe.prepTime} min</span>
              <span>•</span>
              <span>🎯 Dificuldade: {selectedRecipe.difficulty}</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PROTOCOLO ESTÁTICO */}
      {selectedProtocol && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
          zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
        }} onClick={() => setSelectedProtocol(null)}>
          <div style={{
            background: 'var(--bg-card)', width: '100%', maxWidth: '430px', margin: '0 auto',
            borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
            padding: '24px', paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
            maxHeight: '85vh', overflowY: 'auto',
            borderTop: '1px solid var(--border)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(74,155,142,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>
                  {selectedProtocol.emoji}
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>{selectedProtocol.name}</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Protocolo Terapêutico</p>
                </div>
              </div>
              <button onClick={() => setSelectedProtocol(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text-muted)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <p style={{ fontSize: '14px', color: '#F0EAF5', lineHeight: '1.6', marginBottom: '20px', background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
              {selectedProtocol.forWhat}
            </p>

            <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📝 Passo a Passo</p>
            <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', whiteSpace: 'pre-wrap' }}>{selectedProtocol.instructions}</p>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600' }}>
              <span>⏱ Tempo: {selectedProtocol.time}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
