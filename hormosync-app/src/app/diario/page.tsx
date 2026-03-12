'use client';

import { useState } from 'react';
import { ChevronRight, CheckCircle } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useProfile, useJournalEntries, useChallenges } from '@/hooks/useSupabase';

const prompts = [
  'Como você se sentiu hoje em relação ao seu corpo?',
  'Qual sintoma te incomodou mais hoje?',
  'O que te deu prazer ou alegria hoje?',
  'Que pequena melhora você percebeu?',
  'O que você faria diferente amanhã?',
];

const availableChallenges = [
  {
    id: 'anti_fogacho', title: 'Desafio Anti-Fogacho', days: 7, emoji: '🔥',
    color: '#C8587A',
    desc: 'Protocolo diário de 7 dias para reduzir a intensidade e frequência dos fogachos.',
    todayTask: 'Tome o Shot Anti-Fogacho e faça a respiração 4-7-8 após o almoço.',
  },
  {
    id: 'sono_profundo', title: 'Desafio do Sono', days: 15, emoji: '🌙',
    color: '#7E5C8E',
    desc: '15 dias de rituais noturnos para regular o ciclo do sono e acabar com a insônia.',
    todayTask: 'Inicie sua rotina 1h mais cedo que o normal hoje.',
  },
  {
    id: 'anti_inchaco', title: 'Desafio Anti-Inchaço', days: 7, emoji: '💧',
    color: '#4A9B8E',
    desc: '7 dias de alimentação linfática para desinchar e sentir o corpo leve.',
    todayTask: 'Tome 500ml de água morna com limão em jejum.',
  },
];

export default function DiarioPage() {
  const { user } = useProfile();
  const { entries: journalEntries, loading: journalLoading, addEntry } = useJournalEntries(user?.id);
  const { challenges, loading: challengesLoading, startChallenge, advanceChallenge } = useChallenges(user?.id);

  const [activeTab, setActiveTab] = useState<'diario' | 'desafios'>('diario');
  const [entryText, setEntryText] = useState('');
  const [saved, setSaved] = useState(false);
  const [promptIdx, setPromptIdx] = useState(0);
  const [expandedChallenge, setExpandedChallenge] = useState<string | null>(null);

  const saveEntry = async () => {
    if (!entryText.trim() || !user) return;
    await addEntry(prompts[promptIdx], entryText);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    setEntryText('');
  };

  const getChallengeProgress = (id: string) => challenges.find(c => c.challenge_id === id);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '90px' }}>
      <div style={{ padding: '20px 20px 0' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>Jornada</h1>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'var(--bg-glass)', borderRadius: '12px', padding: '4px', gap: '4px' }}>
          {[['diario', '📔 Diário'], ['desafios', '🏆 Desafios']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as 'diario' | 'desafios')}
              style={{
                flex: 1, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: '700',
                border: 'none', cursor: 'pointer',
                background: activeTab === key ? 'linear-gradient(135deg, var(--brand-rose), var(--brand-purple))' : 'transparent',
                color: activeTab === key ? 'white' : 'var(--text-muted)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {activeTab === 'diario' && (
          <>
            {/* Prompt do dia */}
            <div className="card-glow" style={{ padding: '20px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--brand-rose)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>Reflexão de hoje</p>
              <p style={{ fontSize: '17px', fontWeight: '600', lineHeight: '1.5', marginBottom: '20px' }}>
                {prompts[promptIdx]}
              </p>
              <textarea
                className="input-field"
                placeholder="Escreva aqui o que você está sentindo..."
                value={entryText}
                onChange={e => setEntryText(e.target.value)}
                rows={5}
                style={{ resize: 'none', lineHeight: '1.6' }}
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setPromptIdx((promptIdx + 1) % prompts.length)}
                >
                  Outra pergunta
                </button>
                <button className="btn-primary" style={{ flex: 1 }} onClick={saveEntry} disabled={!entryText.trim()}>
                  {saved ? '✓ Salvo!' : 'Salvar'}
                </button>
              </div>
            </div>

            {/* Entradas anteriores */}
            <h2 style={{ fontSize: '17px', fontWeight: '700' }}>Entradas anteriores</h2>
            {journalLoading ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center' }}>Carregando diário...</p>
            ) : journalEntries.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center' }}>Nenhuma entrada registrada ainda. Comece hoje!</p>
            ) : (
              journalEntries.map(e => (
                <div key={e.id} className="card" style={{ padding: '16px' }}>
                  <p style={{ fontSize: '12px', color: 'var(--brand-rose)', fontWeight: '600', marginBottom: '4px' }}>
                    {new Date(e.created_at).toLocaleDateString('pt-BR')}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '8px' }}>
                    {e.prompt}
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.6' }}>{e.content}</p>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'desafios' && (
          <>
            {challengesLoading ? (
               <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center' }}>Carregando desafios...</p>
            ) : availableChallenges.map(c => {
              const progress = getChallengeProgress(c.id);
              const isStarted = !!progress;
              const currentDay = progress?.current_day || 0;
              const isCompleted = progress?.status === 'completed';

              return (
                <div key={c.id} className="card" style={{ padding: '0', overflow: 'hidden', border: isStarted && !isCompleted ? `1px solid ${c.color}40` : '1px solid var(--border)' }}>
                  <div style={{ padding: '18px', cursor: 'pointer' }} onClick={() => setExpandedChallenge(expandedChallenge === c.id ? null : c.id)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                          {c.emoji}
                        </div>
                        <div>
                          <p style={{ fontWeight: '700', fontSize: '15px', marginBottom: '2px' }}>{c.title}</p>
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.days} dias · Dia {Math.min(currentDay, c.days)} de {c.days}</p>
                        </div>
                      </div>
                      {isStarted && !isCompleted && (
                        <span style={{ padding: '4px 10px', borderRadius: '100px', background: `${c.color}20`, color: c.color, fontSize: '11px', fontWeight: '700', border: `1px solid ${c.color}40` }}>
                          ATIVO
                        </span>
                      )}
                      {isCompleted && (
                         <span style={{ padding: '4px 10px', borderRadius: '100px', background: 'rgba(74,155,142,0.15)', color: 'var(--brand-teal)', fontSize: '11px', fontWeight: '700', border: '1px solid var(--brand-teal)' }}>
                         CONCLUÍDO
                       </span>
                      )}
                    </div>

                    {/* Progress dots */}
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {Array.from({ length: c.days }).map((_, i) => (
                        <div
                          key={i}
                          style={{
                            width: `${90 / c.days}%`, minWidth: '8px', height: '8px', borderRadius: '100px',
                            background: i < currentDay ? c.color : 'var(--bg-glass2)',
                            transition: 'background 0.3s',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {expandedChallenge === c.id && (
                    <div style={{ borderTop: '1px solid var(--border)', padding: '18px' }}>
                      <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>{c.desc}</p>
                      
                      {!isCompleted && c.todayTask && (
                        <div style={{ padding: '14px', background: `${c.color}10`, borderRadius: '12px', border: `1px solid ${c.color}30`, marginBottom: '14px' }}>
                          <p style={{ fontSize: '12px', color: c.color, fontWeight: '700', marginBottom: '6px' }}>TAREFA {isStarted ? 'DE HOJE' : ''}</p>
                          <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#fff' }}>{c.todayTask}</p>
                        </div>
                      )}
                      
                      {!isStarted && (
                        <button
                          className="btn-primary"
                          style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}aa)` }}
                          onClick={(e) => { e.stopPropagation(); startChallenge(c.id); }}
                        >
                          Iniciar Desafio
                        </button>
                      )}
                      
                      {isStarted && !isCompleted && (
                         <button
                         className="btn-primary"
                         style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}aa)` }}
                         onClick={(e) => { e.stopPropagation(); advanceChallenge(c.id, currentDay, c.days); }}
                       >
                         Marcar dia como concluído ✓
                       </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

      <BottomNav active="protocolos" />
    </div>
  );
}
