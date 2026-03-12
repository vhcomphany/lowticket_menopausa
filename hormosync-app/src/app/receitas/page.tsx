'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChevronDown, ChevronUp, RefreshCw, Calendar, Clock, Zap } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { RECIPES, CATEGORIES, SYMPTOM_LABELS, generateWeeklyPlan, type RecipeCategory, type Symptom, type Recipe } from '@/data/recipes';
import { useProfile } from '@/hooks/useSupabase';

const PLAN_LEVELS = [
  { key: 'adaptativo', label: 'Adaptativo 🌱', desc: 'Mudanças suaves, resultado gradual' },
  { key: 'intermediario', label: 'Intermediário ⚡', desc: 'Sem açúcar/farinha, -1-2kg/sem' },
  { key: 'avancado', label: 'Avançado 🔥', desc: 'Low Carb total, -2-4kg/2sem' },
] as const;

type PlanLevel = 'adaptativo' | 'intermediario' | 'avancado';

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="card"
      style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', border: open ? '1px solid var(--brand-rose)' : '1px solid var(--border)', transition: 'border 0.2s' }}
      onClick={() => setOpen(v => !v)}
    >
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(200,88,122,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
            {recipe.emoji}
          </div>
          <div>
            <p style={{ fontWeight: '700', fontSize: '14px', marginBottom: '2px' }}>{recipe.name}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{recipe.subtitle}</p>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
              {recipe.symptoms.map(s => (
                <span key={s} style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '100px', background: 'rgba(200,88,122,0.15)', color: 'var(--brand-rose)', fontWeight: '600' }}>
                  {SYMPTOM_LABELS[s]}
                </span>
              ))}
            </div>
          </div>
        </div>
        {open ? <ChevronUp size={16} color="var(--brand-rose)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
      </div>

      {open && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '16px' }} onClick={e => e.stopPropagation()}>
          <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.6', marginBottom: '16px', background: 'var(--bg-glass)', padding: '10px', borderRadius: '8px' }}>
            {recipe.description}
          </p>

          <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🥣 Ingredientes</p>
          <ul style={{ paddingLeft: '18px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {recipe.ingredients.map((ing, i) => <li key={i} style={{ fontSize: '13px', lineHeight: '1.5' }}>{ing}</li>)}
          </ul>

          <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📝 Como Fazer</p>
          <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: recipe.substitutions ? '16px' : '0' }}>{recipe.instructions}</p>

          {recipe.substitutions && (
            <div style={{ background: 'rgba(212,165,106,0.1)', borderLeft: '3px solid var(--brand-gold)', padding: '10px 12px', borderRadius: '0 8px 8px 0', marginBottom: recipe.scienceNote ? '12px' : '0' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--brand-gold)', marginBottom: '3px' }}>🔄 Substituições</p>
              <p style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-primary)' }}>{recipe.substitutions}</p>
            </div>
          )}

          {recipe.scienceNote && (
            <div style={{ background: 'rgba(126,92,142,0.1)', borderLeft: '3px solid var(--brand-purple)', padding: '10px 12px', borderRadius: '0 8px 8px 0', marginTop: '8px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--brand-purple)', marginBottom: '3px' }}>🔬 Por que funciona</p>
              <p style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-primary)' }}>{recipe.scienceNote}</p>
            </div>
          )}

          {recipe.restrictions && recipe.restrictions.length > 0 && (
            <div style={{ background: 'rgba(200,88,122,0.08)', border: '1px solid rgba(200,88,122,0.3)', borderRadius: '8px', padding: '10px', marginTop: '12px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--brand-rose)', marginBottom: '4px' }}>⛔ Restrições</p>
              {recipe.restrictions.map((r, i) => <p key={i} style={{ fontSize: '12px', color: 'var(--text-primary)' }}>• {r}</p>)}
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '600' }}>
            <span>⏱ {recipe.prepTime} min</span>
            <span>•</span>
            <span>🎯 {recipe.difficulty}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReceitasPage() {
  const { profile } = useProfile();
  const mainSymptom: Symptom = (profile?.main_symptom?.toLowerCase() as Symptom) || 'fogacho';

  const [tab, setTab] = useState<'receitas' | 'cardapio'>('cardapio');
  const [activeCategory, setActiveCategory] = useState<RecipeCategory | 'todos'>('todos');
  const [activeSymptom, setActiveSymptom] = useState<Symptom | 'todos'>('todos');
  const [planLevel, setPlanLevel] = useState<PlanLevel>('intermediario');
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Carrega cardápio salvo se houver, ou gera um inicial baseado no sintoma
  const [weeklyPlan, setWeeklyPlan] = useState<ReturnType<typeof generateWeeklyPlan>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hormosync_weekly_plan');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return generateWeeklyPlan(mainSymptom, 'intermediario');
  });

  const regen = useCallback(() => {
    if (confirm('Deseja realmente gerar um novo cardápio da semana? (Isso vai substituir o seu cardápio atual)')) {
      const newPlan = generateWeeklyPlan(mainSymptom, planLevel);
      setWeeklyPlan(newPlan);
      if (typeof window !== 'undefined') {
        localStorage.setItem('hormosync_weekly_plan', JSON.stringify(newPlan));
      }
    }
  }, [mainSymptom, planLevel]);

  // Salva no localStorage na montagem se acabou de gerar
  useEffect(() => {
    if (typeof window !== 'undefined' && weeklyPlan) {
      localStorage.setItem('hormosync_weekly_plan', JSON.stringify(weeklyPlan));
    }
  }, [weeklyPlan]);

  const filtered = RECIPES.filter(r => {
    const catOk = activeCategory === 'todos' || r.category === activeCategory;
    const symOk = activeSymptom === 'todos' || r.symptoms.includes(activeSymptom as Symptom);
    return catOk && symOk;
  });

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '100px' }}>
      <div style={{ padding: '20px 20px 0' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>Receitas e Cardápio</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Receitas que aliviam os sintomas da menopausa</p>
      </div>

      {/* Tab */}
      <div style={{ padding: '16px 20px 0', display: 'flex', gap: '8px' }}>
        {([['cardapio', '📅 Meu Cardápio'], ['receitas', '📖 Todas as Receitas']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1, padding: '10px', borderRadius: '12px', fontSize: '13px', fontWeight: '600',
            border: tab === key ? 'none' : '1px solid var(--border)',
            background: tab === key ? 'linear-gradient(135deg, var(--brand-rose), var(--brand-purple))' : 'transparent',
            color: tab === key ? 'white' : 'var(--text-muted)', cursor: 'pointer',
          }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* ─── CARDÁPIO SEMANAL ─── */}
        {tab === 'cardapio' && (
          <>
            {/* Profile hint */}
            {profile?.main_symptom && (
              <div style={{ background: 'rgba(200,88,122,0.08)', border: '1px solid rgba(200,88,122,0.2)', borderRadius: '12px', padding: '12px 14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '24px' }}>🎯</span>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--brand-rose)', marginBottom: '2px' }}>Cardápio personalizado para você</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Focado em: <strong>{profile.main_symptom}</strong> · Perfil: {profile.hormonal_profile || 'Hormonal'}</p>
                </div>
              </div>
            )}
            
            <div style={{ background: 'rgba(212,165,106,0.1)', border: '1px solid rgba(212,165,106,0.3)', borderRadius: '12px', padding: '12px' }}>
              <p style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-primary)' }}>
                💡 <strong>Dica Médica:</strong> O seu cardápio abaixo foi montado para dar resultados rápidos para <strong>{mainSymptom}</strong>. Siga-o por 7 dias antes de mudar para que o corpo se adapte à nova rotina hormonal!
              </p>
            </div>

            {/* Nível */}
            <div>
              <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-muted)' }}>Escolha a intensidade do plano:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {PLAN_LEVELS.map(pl => (
                  <button key={pl.key} onClick={() => { setPlanLevel(pl.key); regen(); }} style={{
                    padding: '12px 14px', borderRadius: '12px', textAlign: 'left', cursor: 'pointer',
                    border: planLevel === pl.key ? '1.5px solid var(--brand-rose)' : '1px solid var(--border)',
                    background: planLevel === pl.key ? 'rgba(200,88,122,0.08)' : 'transparent',
                  }}>
                    <p style={{ fontWeight: '700', fontSize: '13px', marginBottom: '2px', color: planLevel === pl.key ? 'white' : 'var(--text-muted)' }}>{pl.label}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{pl.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Botão gerar/regerar */}
            <button onClick={regen} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: 'linear-gradient(135deg, var(--brand-rose), var(--brand-purple))',
              border: 'none', borderRadius: '14px', padding: '14px', cursor: 'pointer', color: 'white', fontWeight: '700', fontSize: '14px',
            }}>
              <RefreshCw size={16} />
              Gerar novo cardápio
            </button>

            {/* Dias da semana */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {weeklyPlan.map((day, i) => (
                <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: expandedDay === i ? 'rgba(200,88,122,0.06)' : 'transparent' }}
                    onClick={() => setExpandedDay(expandedDay === i ? null : i)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--brand-rose), var(--brand-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', color: 'white' }}>
                        {day.day.substring(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: '700', fontSize: '14px' }}>{day.day}</p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{day.cafe?.name} · {day.lanche_manha?.name}</p>
                      </div>
                    </div>
                    {expandedDay === i ? <ChevronUp size={16} color="var(--brand-rose)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                  </div>

                  {expandedDay === i && (
                    <div style={{ borderTop: '1px solid var(--border)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }} onClick={e => e.stopPropagation()}>
                      {[
                        { icon: '🌅', label: 'Café da Manhã', recipe: day.cafe },
                        { icon: '💉', label: 'Shot da Manhã', recipe: day.lanche_manha },
                        { icon: '☀️', label: 'Almoço', recipe: day.almoco },
                        { icon: '🌮', label: 'Lanche da Tarde', recipe: day.lanche_tarde },
                        { icon: '🌙', label: 'Jantar', recipe: day.jantar },
                        { icon: '🫖', label: 'Chá Noturno', recipe: day.cha },
                      ].map(({ icon, label, recipe }) => recipe && (
                        <div key={label} onClick={(e) => { e.stopPropagation(); setSelectedRecipe(recipe); }} style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <span style={{ fontSize: '18px', width: '28px', textAlign: 'center', flexShrink: 0 }}>{icon}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <p style={{ fontSize: '13px', fontWeight: '600' }}>{recipe.emoji} {recipe.name}</p>
                              <ChevronDown size={14} color="var(--brand-rose)" style={{ transform: 'rotate(-90deg)' }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ─── RECEITAS ─── */}
        {tab === 'receitas' && (
          <>
            {/* Filtro por sintoma */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
              <button onClick={() => setActiveSymptom('todos')} style={{ whiteSpace: 'nowrap', padding: '7px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', border: activeSymptom === 'todos' ? 'none' : '1px solid var(--border)', background: activeSymptom === 'todos' ? 'linear-gradient(135deg, var(--brand-rose), var(--brand-purple))' : 'transparent', color: activeSymptom === 'todos' ? 'white' : 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }}>Todos</button>
              {(Object.keys(SYMPTOM_LABELS) as Symptom[]).map(s => (
                <button key={s} onClick={() => setActiveSymptom(s)} style={{ whiteSpace: 'nowrap', padding: '7px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', border: activeSymptom === s ? 'none' : '1px solid var(--border)', background: activeSymptom === s ? 'linear-gradient(135deg, var(--brand-rose), var(--brand-purple))' : 'transparent', color: activeSymptom === s ? 'white' : 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }}>{SYMPTOM_LABELS[s]}</button>
              ))}
            </div>

            {/* Filtro por categoria */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
              <button onClick={() => setActiveCategory('todos')} style={{ whiteSpace: 'nowrap', padding: '7px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', border: activeCategory === 'todos' ? 'none' : '1px solid var(--border)', background: activeCategory === 'todos' ? 'rgba(200,88,122,0.15)' : 'transparent', color: activeCategory === 'todos' ? 'var(--brand-rose)' : 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }}>📋 Todas</button>
              {CATEGORIES.map(c => (
                <button key={c.key} onClick={() => setActiveCategory(c.key)} style={{ whiteSpace: 'nowrap', padding: '7px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', border: activeCategory === c.key ? 'none' : '1px solid var(--border)', background: activeCategory === c.key ? 'rgba(200,88,122,0.15)' : 'transparent', color: activeCategory === c.key ? 'var(--brand-rose)' : 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }}>{c.emoji} {c.label}</button>
              ))}
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>{filtered.length} receitas encontradas</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map(r => <RecipeCard key={r.id} recipe={r} />)}
            </div>
          </>
        )}
      </div>

      {/* MODAL DA RECEITA (QUANDO CLICADA NO CARDÁPIO) */}
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
              <button onClick={() => setSelectedRecipe(null)} style={{ background: 'var(--bg-glass2)', border: 'none', color: 'var(--text-muted)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.6', marginBottom: '20px', background: 'var(--bg-glass)', padding: '12px', borderRadius: '10px' }}>
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
                <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-primary)' }}>{selectedRecipe.substitutions}</p>
              </div>
            )}

            {selectedRecipe.scienceNote && (
              <div style={{ background: 'rgba(126,92,142,0.1)', borderLeft: '3px solid var(--brand-purple)', padding: '12px 14px', borderRadius: '0 8px 8px 0', marginTop: '12px' }}>
                <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--brand-purple)', marginBottom: '4px' }}>🔬 Por que funciona</p>
                <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-primary)' }}>{selectedRecipe.scienceNote}</p>
              </div>
            )}

            {selectedRecipe.restrictions && selectedRecipe.restrictions.length > 0 && (
              <div style={{ background: 'rgba(200,88,122,0.08)', border: '1px solid rgba(200,88,122,0.3)', borderRadius: '10px', padding: '12px', marginTop: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--brand-rose)', marginBottom: '6px' }}>⛔ Restrições</p>
                {selectedRecipe.restrictions.map((r, i) => <p key={i} style={{ fontSize: '13px', color: 'var(--text-primary)' }}>• {r}</p>)}
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

      <BottomNav active="protocolos" />
    </div>
  );
}
