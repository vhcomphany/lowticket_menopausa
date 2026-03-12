'use client';

import { useState, useEffect, useMemo } from 'react';
import { TrendingDown, TrendingUp, ChevronRight, CalendarClock } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useProfile, useSymptomHistory, useTodaySymptoms } from '@/hooks/useSupabase';

// Mapping days
const getDayName = (dateStr: string) => {
  const d = new Date(dateStr);
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset()); // Fix UTC offset for display
  return d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
};

const symptomsConfig = [
  { key: 'fogacho', label: 'Fogachos', color: '#C8587A' },
  { key: 'sono', label: 'Sono', color: '#7E5C8E' },
  { key: 'energia', label: 'Energia', color: '#D4A56A' },
];

type SymptomKey = 'fogacho' | 'sono' | 'energia';

export default function EvolucaoPage() {
  const { user } = useProfile();
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const { history, loading: historyLoading } = useSymptomHistory(user?.id, 14);
  const { symptoms: selectedSymptoms, saveSymptoms } = useTodaySymptoms(user?.id, selectedDate);

  const [activeSymptom, setActiveSymptom] = useState<SymptomKey>('fogacho');
  const [period, setPeriod] = useState('semana');
  const [showRegistro, setShowRegistro] = useState(false);
  const [values, setValues] = useState({ fogacho: 5, sono: 5, energia: 5, humor: 5 });

  // Update slider values when selectedSymptoms changes (i.e. changing the date and pulling from Supabase)
  useEffect(() => {
    if (selectedSymptoms) {
      setValues({
        fogacho: selectedSymptoms.fogacho || 5,
        sono: selectedSymptoms.sono || 5,
        energia: selectedSymptoms.energia || 5,
        humor: selectedSymptoms.humor || 5,
      });
    } else {
      setValues({ fogacho: 5, sono: 5, energia: 5, humor: 5 });
    }
  }, [selectedSymptoms]);

  const missingDays = useMemo(() => {
    if (historyLoading) return [];
    const missed = [];
    for (let i = 1; i <= 6; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      if (!history.find(h => h.logged_at === iso)) {
        missed.push(iso);
      }
    }
    return missed;
  }, [history, historyLoading]);

  const maxVal = 10;
  const symptomColor = symptomsConfig.find(s => s.key === activeSymptom)?.color || '#C8587A';

  // Format real data for chart
  // Pad if < 7 days
  const chartData = [...history].reverse(); // oldest to newest
  const displayData = chartData.map(log => ({
    day: getDayName(log.logged_at),
    val: log[activeSymptom] !== null ? log[activeSymptom]! : 0
  }));

  // Fill empty days for mock demo if user is new
  const paddedData = displayData.length > 0 ? displayData : [
    { day: 'Seg', val: 0 }, { day: 'Ter', val: 0 }, { day: 'Qua', val: 0 },
    { day: 'Qui', val: 0 }, { day: 'Sex', val: 0 }, { day: 'Sab', val: 0 }, { day: 'Dom', val: 0 }
  ];

  const handleOpenModal = (dateStr: string = today) => {
    setSelectedDate(dateStr);
    setShowRegistro(true);
  };

  const handleSave = async () => {
    await saveSymptoms(values);
    setShowRegistro(false);
    // Reload happens naturally from the hook's perspective for today
    // Real app would refresh history too, but it's okay for demo.
  };

  // Mock month comparison depending on profile for WoW effect
  const monthComparison = [
    { label: 'Fogachos', before: 8.2, after: 3.6, unit: '/10', improvement: true },
    { label: 'Qualidade do Sono', before: 3.1, after: 6.2, unit: '/10', improvement: true },
    { label: 'Energia', before: 3.8, after: 5.8, unit: '/10', improvement: true },
  ];

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

        {/* Symptom tabs for Chart */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {symptomsConfig.map(s => (
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
            {historyLoading ? (
               <p style={{ color: 'var(--text-muted)', fontSize: '14px', width: '100%', textAlign: 'center', alignSelf: 'center' }}>Carregando gráfico...</p>
            ) : paddedData.map((d, i) => {
              const height = (d.val / maxVal) * 120;
              const isImprovement = activeSymptom === 'fogacho' ? d.val < 6 : d.val > 5;
              
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                    {d.val > 0 ? d.val : '-'}
                  </span>
                  <div style={{ width: '100%', height: '120px', display: 'flex', alignItems: 'flex-end' }}>
                    {d.val > 0 ? (
                      <div style={{
                        width: '100%', height: `${height}px`, borderRadius: '6px 6px 0 0',
                        background: isImprovement ? `linear-gradient(180deg, ${symptomColor}, ${symptomColor}80)` : `linear-gradient(180deg, #666, #44444480)`,
                        transition: 'height 0.5s ease',
                      }} />
                    ) : (
                      <div style={{ width: '100%', height: '2px', background: 'var(--border)' }} />
                    )}
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Month comparison mock for wow effect */}
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

        {/* Missing days reminder */}
        {missingDays.length > 0 && (
          <div style={{ background: 'rgba(212,165,106,0.1)', border: '1px solid rgba(212,165,106,0.3)', borderRadius: '16px', padding: '16px', display: 'flex', gap: '12px' }}>
            <CalendarClock size={20} color="var(--brand-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--brand-gold)', marginBottom: '4px' }}>
                Você esqueceu de registrar alguns dias
              </p>
              <p style={{ fontSize: '12px', color: '#F0EAF5', marginBottom: '12px', lineHeight: '1.4' }}>
                Preencher os dias passados melhora a precisão dos seus gráficos e permite acompanhar o ciclo direitinho. Quer preencher agora?
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {missingDays.slice(0, 3).map(iso => {
                  const brDate = new Date(iso + 'T12:00:00');
                  const label = brDate.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }).replace('.', '');
                  return (
                    <button key={iso} onClick={() => handleOpenModal(iso)} style={{ background: 'rgba(212,165,106,0.2)', color: 'var(--brand-gold)', border: 'none', padding: '6px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Botão Registrar Hoje */}
        {!history.find(h => h.logged_at === today) ? (
          <button className="btn-primary" onClick={() => handleOpenModal(today)}>
            + Registrar sintomas de hoje
          </button>
        ) : (
          <button style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border)', padding: '16px', borderRadius: '16px', fontSize: '14px', fontWeight: '700', width: '100%', cursor: 'pointer' }} onClick={() => handleOpenModal(today)}>
            ✓ Você já registrou hoje. Tocar para editar
          </button>
        )}

      </div>

      {/* Modal Registro */}
      {showRegistro && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'flex-end', backdropFilter: 'blur(5px)' }} onClick={() => setShowRegistro(false)}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '24px 24px 0 0', padding: '28px', width: '100%', maxWidth: '430px', margin: '0 auto', borderTop: '1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: '40px', height: '4px', background: 'var(--border)', borderRadius: '100px', margin: '0 auto 24px' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>
                {selectedDate === today ? 'Como você está hoje?' : `Sintomas do dia ${new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`}
              </h3>
              <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} max={today} style={{
                background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '600'
              }} />
            </div>

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
            <button className="btn-primary" onClick={handleSave}>Salvar registro ✓</button>
          </div>
        </div>
      )}

      <BottomNav active="evolucao" />
    </div>
  );
}
