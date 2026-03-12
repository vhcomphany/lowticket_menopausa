'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChevronDown, ChevronUp, ChevronRight, RefreshCw, Calendar, Clock, Zap } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { RECIPES, CATEGORIES, SYMPTOM_LABELS, generateWeeklyPlan, type RecipeCategory, type Symptom, type Recipe } from '@/data/recipes';
import { useProfile } from '@/hooks/useSupabase';

const PLAN_LEVELS = [
  { key: 'adaptativo', label: 'Adaptativo', desc: 'Mudanças suaves, resultado gradual' },
  { key: 'intermediario', label: 'Intermediário', desc: 'Sem açúcar/farinha, -1-2kg/sem' },
  { key: 'avancado', label: 'Avançado', desc: 'Low Carb total, -2-4kg/2sem' },
] as const;

type PlanLevel = 'adaptativo' | 'intermediario' | 'avancado';

// Unique curated images per recipe ID — falls back to category image
const RECIPE_IMAGES: Record<string, string> = {
  // Shots
  S01: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop&q=80',
  S02: 'https://images.unsplash.com/photo-1622597467836-f30b912c9b2d?w=400&h=400&fit=crop&q=80',
  S03: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=400&h=400&fit=crop&q=80',
  S04: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=400&h=400&fit=crop&q=80',
  S05: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=400&fit=crop&q=80',
  S06: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400&h=400&fit=crop&q=80',
  S07: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop&q=80',
  S08: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=400&fit=crop&q=80',
  S09: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400&h=400&fit=crop&q=80',
  S10: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80',
  // Sucos
  SU01: 'https://images.unsplash.com/photo-1568158879083-c42860933ed7?w=400&h=400&fit=crop&q=80',
  SU02: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=400&h=400&fit=crop&q=80',
  SU03: 'https://images.unsplash.com/photo-1610970882406-4b76e459d77e?w=400&h=400&fit=crop&q=80',
  SU04: 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=400&h=400&fit=crop&q=80',
  SU05: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400&h=400&fit=crop&q=80',
  SU06: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=400&fit=crop&q=80',
  SU07: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=400&fit=crop&q=80',
  SU08: 'https://images.unsplash.com/photo-1554579360-c83e75c2f7cc?w=400&h=400&fit=crop&q=80',
  // Chás
  C01: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=400&fit=crop&q=80',
  C02: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop&q=80',
  C03: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop&q=80',
  C04: 'https://images.unsplash.com/photo-1565799993513-c0ca52de53b4?w=400&h=400&fit=crop&q=80',
  C05: 'https://images.unsplash.com/photo-1516916759473-600c07bc12d4?w=400&h=400&fit=crop&q=80',
  C06: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400&h=400&fit=crop&q=80',
  C07: 'https://images.unsplash.com/photo-1557844352-761f2565b576?w=400&h=400&fit=crop&q=80',
  C08: 'https://images.unsplash.com/photo-1567706235968-45e96da99a38?w=400&h=400&fit=crop&q=80',
  // Vitaminas
  V01: 'https://images.unsplash.com/photo-1623065422900-30fc0406c1fa?w=400&h=400&fit=crop&q=80',
  V02: 'https://images.unsplash.com/photo-1478145046317-81bae6810773?w=400&h=400&fit=crop&q=80',
  V03: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=400&fit=crop&q=80',
  V04: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=400&fit=crop&q=80',
  V05: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop&q=80',
  V06: 'https://images.unsplash.com/photo-1464500369799-7154ac40eb43?w=400&h=400&fit=crop&q=80',
  // Comidas
  CO01: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop&q=80',
  CO02: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop&q=80',
  CO03: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=400&fit=crop&q=80',
  CO04: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop&q=80',
  CO05: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&q=80',
  CO06: 'https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=400&h=400&fit=crop&q=80',
  // Lanches
  L01: 'https://images.unsplash.com/photo-1484723091791-0092515cb613?w=400&h=400&fit=crop&q=80',
  L02: 'https://images.unsplash.com/photo-1481070414801-51fd732d7184?w=400&h=400&fit=crop&q=80',
  L03: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=400&h=400&fit=crop&q=80',
  L04: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=400&fit=crop&q=80',
  L05: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop&q=80',
  L06: 'https://images.unsplash.com/photo-1606913084603-3e7702b01627?w=400&h=400&fit=crop&q=80',
  // Caldos
  CA01: 'https://images.unsplash.com/photo-1481671703460-040cb8a2d909?w=400&h=400&fit=crop&q=80',
  CA02: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&h=400&fit=crop&q=80',
  CA03: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=400&fit=crop&q=80',
  CA04: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=400&fit=crop&q=80',
  CA05: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=400&h=400&fit=crop&q=80',
};

const CATEGORY_FALLBACK: Record<RecipeCategory, string> = {
  shot: 'https://images.unsplash.com/photo-1542282811-943ef1a977f5?w=400&h=400&fit=crop&q=80',
  suco: 'https://images.unsplash.com/photo-1622597467836-f30b912c9b2d?w=400&h=400&fit=crop&q=80',
  cha: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=400&fit=crop&q=80',
  vitamina: 'https://images.unsplash.com/photo-1623065422900-30fc0406c1fa?w=400&h=400&fit=crop&q=80',
  comida: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&q=80',
  lanche: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=400&h=400&fit=crop&q=80',
  caldo: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop&q=80',
};

function getRecipeImage(id: string, category: RecipeCategory): string {
  return RECIPE_IMAGES[id] || CATEGORY_FALLBACK[category];
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [open, setOpen] = useState(false);
  const imageUrl = getRecipeImage(recipe.id, recipe.category);

  return (
    <div
      className="card"
      style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', border: open ? '1px solid var(--brand-rose)' : '1px solid var(--border)', transition: 'border 0.2s' }}
      onClick={() => setOpen(v => !v)}
    >
      <div style={{ position: 'relative', height: '140px', width: '100%' }}>
        <img src={imageUrl} alt={recipe.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div className="image-overlay-dark" />
        <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 1 }}>
          <div style={{ color: 'white' }}>
            <p style={{ fontWeight: '800', fontSize: '18px', marginBottom: '2px', fontFamily: '"Playfair Display", serif', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>{recipe.name}</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{recipe.subtitle}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {open ? <ChevronUp size={20} color="white" /> : <ChevronDown size={20} color="white" />}
          </div>
        </div>
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap', zIndex: 1 }}>
          {recipe.symptoms.slice(0, 2).map(s => (
            <span key={s} style={{ fontSize: '10px', padding: '4px 10px', borderRadius: '100px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', fontWeight: '600' }}>
              {SYMPTOM_LABELS[s].replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim()}
            </span>
          ))}
        </div>
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
                            <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '2px' }}>{label.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim()}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{recipe.name}</p>
                              <ChevronRight size={14} color="var(--brand-rose)" />
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
            <div className="horizontal-scroll" style={{ padding: '0 20px 10px', margin: '0 -20px', display: 'flex', gap: '8px' }}>
              <button onClick={() => setActiveCategory('todos')} style={{ whiteSpace: 'nowrap', padding: '8px 16px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', border: activeCategory === 'todos' ? 'none' : '1px solid var(--border)', background: activeCategory === 'todos' ? 'linear-gradient(135deg, var(--brand-rose), var(--brand-purple))' : 'var(--bg-card)', color: activeCategory === 'todos' ? 'white' : 'var(--text-secondary)', cursor: 'pointer', flexShrink: 0 }}>Todas</button>
              {CATEGORIES.map(c => (
                <button key={c.key} onClick={() => setActiveCategory(c.key)} style={{ whiteSpace: 'nowrap', padding: '8px 16px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', border: activeCategory === c.key ? 'none' : '1px solid var(--border)', background: activeCategory === c.key ? 'linear-gradient(135deg, var(--brand-rose), var(--brand-purple))' : 'var(--bg-card)', color: activeCategory === c.key ? 'white' : 'var(--text-secondary)', cursor: 'pointer', flexShrink: 0 }}>{c.label}</button>
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
              <div style={{ position: 'relative', height: '200px', margin: '-24px -24px 20px -24px', flexShrink: 0 }}>
                <img src={getRecipeImage(selectedRecipe.id, selectedRecipe.category)} alt={selectedRecipe.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div className="image-overlay-dark" />
                <button onClick={() => setSelectedRecipe(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                  ✕
                </button>
                <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px', color: 'white', zIndex: 1 }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px', fontFamily: '"Playfair Display", serif', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{selectedRecipe.name}</h2>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{selectedRecipe.subtitle}</p>
                </div>
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
