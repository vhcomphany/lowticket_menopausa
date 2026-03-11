'use client';

import { useState } from 'react';
import { TrendingDown, TrendingUp, Calendar, ChevronDown } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const weekData = [
  { day: 'Seg', fogacho: 8, sono: 3, energia: 4 },
  { day: 'Ter', fogacho: 7, sono: 4, energia: 4 },
  { day: 'Qua', fogacho: 6, sono: 5, energia: 5 },
  { day: 'Qui', fogacho: 5, sono: 5, energia: 6 },
  { day: 'Sex', fogacho: 4, sono: 6, energia: 6 },
  { day: 'Sáb', fogacho: 4, sono: 7, energia: 7 },
  { day: 'Dom', fogacho: 3, sono: 6, energia: 5 },
];

const monthComparison = [
  { label: 'Fogachos', before: 8.2, after: 3.6, unit: '/10', improvement: true },
  { label: 'Qualidade do Sono', before: 3.1, after: 6.2, unit: '/10', improvement: true },
  { label: 'Energia', before: 3.8, after: 5.8, unit: '/10', improvement: true },
  { label: 'Irritabilidade', before: 7.9, after: 4.1, unit: '/10', improvement: true },
];

const symptoms = [
  { key: 'fogacho', label: 'Fogachos', color: '#C8587A' },
  { key: 'sono', label: 'Sono', color: '#7E5C8E' },
  { key: 'energia', label: 'Energia', color: '#4A9B8E' },
];

type SymptomKey = 'fogacho' | 'sono' | 'energia';

export default function EvolucaoPage() {
  const [activeSymptom, setActiveSymptom] = useState<SymptomKey>('fogacho');
  const [period, setPeriod] = useState('semana');
  const [showRegistro, setShowRegistro] = useState(false);
  const [values, setValues] = useState({ fogacho: 5, sono: 5, energia: 5, humor: 5 });

  const maxVal = 10;
  const symptomColor = symptoms.find(s => s.key === activeSymptom)?.color || '#C8587A';

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '90px' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>Evolução</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Veja como você está melhorando</p>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Period selector */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['semana', 'mês', 'ano'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: '8px 18px', borderRadius: '100px', fontSize: '13px', fontWeight: '600',
                border: period === p ? 'none' : '1px solid var(--border)',
                background: period === p ? 'linear-gradient(135deg, var(--brand-rose), var(--brand-purple))' : 'transparent',
                color: period === p ? 'white' : 'var(--text-muted)', cursor: 'pointer',
              }}
            >
              Esta {p}
            </button>
          ))}
        </div>

        {/* Symptom tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {symptoms.map(s => (
            <button
              key={s.key}
              onClick={() => setActiveSymptom(s.key as SymptomKey)}
              style={{
                flex: 1, padding: '10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
                border: `1px solid ${activeSymptom === s.key ? s.color : 'var(--border)'}`,
                background: activeSymptom === s.key ? `${s.color}20` : 'transparent',
                color: activeSymptom === s.key ? s.color : 'var(--text-muted)', cursor: 'pointer',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Bar Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '140px', gap: '8px' }}>
            {weekData.map((d, i) => {
              const val = d[activeSymptom as SymptomKey] as number;
              const height = (val / maxVal) * 120;
              const isImprovement = activeSymptom === 'fogacho' ? val < 6 : val > 5;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{val}</span>
                  <div style={{ width: '100%', height: '120px', display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{
                      width: '100%', height: `${height}px`, borderRadius: '6px 6px 0 0',
                      background: isImprovement ? `linear-gradient(180deg, ${symptomColor}, ${symptomColor}80)` : `linear-gradient(180deg, #666, #44444480)`,
                      transition: 'height 0.5s ease',
                    }} />
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Month comparison */}
        <div>
          <h2 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '14px' }}>Mês anterior vs. Atual</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {monthComparison.map((item, i) => {
              const pct = Math.round(Math.abs(item.after - item.before) / item.before * 100);
              const improved = item.improvement;
              return (
                <div key={i} className="card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>{item.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4A9B8E' }}>
                      {improved ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                      <span style={{ fontSize: '13px', fontWeight: '700' }}>{pct}% melhor</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Mês passado</p>
                      <div className="progress-bar">
                        <div style={{ height: '100%', width: `${(item.before / 10) * 100}%`, borderRadius: '100px', background: '#444', transition: 'width 0.5s' }} />
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{item.before}{item.unit}</p>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '11px', color: 'var(--brand-teal)', marginBottom: '6px' }}>Este mês</p>
                      <div className="progress-bar">
                        <div style={{ height: '100%', width: `${(item.after / 10) * 100}%`, borderRadius: '100px', background: 'var(--brand-teal)', transition: 'width 0.5s' }} />
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--brand-teal)', marginTop: '4px', fontWeight: '600' }}>{item.after}{item.unit}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botão Registrar */}
        <button className="btn-primary" onClick={() => setShowRegistro(true)}>
          + Registrar sintomas de hoje
        </button>

      </div>

      {/* Modal Registro */}
      {showRegistro && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowRegistro(false)}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '24px 24px 0 0', padding: '28px', width: '100%', maxWidth: '430px', margin: '0 auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: '40px', height: '4px', background: 'var(--border)', borderRadius: '100px', margin: '0 auto 24px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Como você está hoje?</h3>
            {[
              { key: 'fogacho', label: '🔥 Intensidade dos Fogachos' },
              { key: 'sono', label: '🌙 Qualidade do Sono ontem' },
              { key: 'energia', label: '⚡ Nível de Energia' },
              { key: 'humor', label: '💜 Humor Geral' },
            ].map(({ key, label }) => (
              <div key={key} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{label}</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--brand-rose)' }}>{values[key as keyof typeof values]}/10</span>
                </div>
                <input
                  type="range" min="1" max="10" className="symptom-slider"
                  value={values[key as keyof typeof values]}
                  onChange={e => setValues(prev => ({ ...prev, [key]: +e.target.value }))}
                />
              </div>
            ))}
            <button className="btn-primary" onClick={() => setShowRegistro(false)}>Salvar registro</button>
          </div>
        </div>
      )}

      <BottomNav active="evolucao" />
    </div>
  );
}
