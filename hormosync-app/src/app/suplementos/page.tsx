'use client';

import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { SUPPLEMENTS, SUPPLEMENT_STACKS, SUPPLEMENT_GROUPS, type Supplement } from '@/data/supplements';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  return (
    <button onClick={copy} style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      background: copied ? 'rgba(74,155,142,0.2)' : 'rgba(200,88,122,0.15)',
      border: `1px solid ${copied ? 'var(--brand-teal)' : 'var(--brand-rose)'}`,
      borderRadius: '10px', padding: '10px 14px', cursor: 'pointer',
      color: copied ? 'var(--brand-teal)' : 'var(--brand-rose)', fontWeight: '700', fontSize: '13px',
      transition: 'all 0.2s', width: '100%', justifyContent: 'center',
    }}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copiado! Cole no WhatsApp da farmácia ✓' : 'Copiar Fórmula para Farmácia'}
    </button>
  );
}

function SupplementCard({ sup }: { sup: Supplement }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', border: open ? '1px solid var(--brand-rose)' : '1px solid var(--border)', transition: 'border 0.2s' }}>
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setOpen(v => !v)}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(200,88,122,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
            {sup.emoji}
          </div>
          <div>
            <p style={{ fontWeight: '700', fontSize: '14px', marginBottom: '2px' }}>{sup.name}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{sup.forWhat.slice(0, 60)}...</p>
          </div>
        </div>
        {open ? <ChevronUp size={16} color="var(--brand-rose)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
      </div>

      {open && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }} onClick={e => e.stopPropagation()}>
          <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#F0EAF5' }}>{sup.forWhat}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { label: '💊 Dose', val: sup.dose },
              { label: '⏰ Horário', val: sup.timing },
              { label: '⏱ Resultado em', val: sup.timeToResult },
              { label: '💰 Custo médio', val: sup.costRange },
            ].map(({ label, val }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '10px' }}>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>{label}</p>
                <p style={{ fontSize: '12px', lineHeight: '1.4' }}>{val}</p>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            🏪 <strong>Onde comprar:</strong> {sup.whereToBuy}
          </div>

          {sup.safeFor && (
            <div style={{ background: 'rgba(74,155,142,0.1)', borderLeft: '3px solid var(--brand-teal)', padding: '10px 12px', borderRadius: '0 8px 8px 0' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--brand-teal)', marginBottom: '3px' }}>✅ Segura para</p>
              <p style={{ fontSize: '12px', color: '#F0EAF5' }}>{sup.safeFor}</p>
            </div>
          )}

          {sup.tip && (
            <div style={{ background: 'rgba(212,165,106,0.1)', borderLeft: '3px solid var(--brand-gold)', padding: '10px 12px', borderRadius: '0 8px 8px 0' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--brand-gold)', marginBottom: '3px' }}>💡 Dica importante</p>
              <p style={{ fontSize: '12px', color: '#F0EAF5' }}>{sup.tip}</p>
            </div>
          )}

          {sup.contraindications.length > 0 && (
            <div style={{ background: 'rgba(200,88,122,0.08)', border: '1px solid rgba(200,88,122,0.25)', borderRadius: '10px', padding: '12px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--brand-rose)', marginBottom: '6px' }}>⛔ Não usar se tiver</p>
              {sup.contraindications.map((c, i) => <p key={i} style={{ fontSize: '12px', lineHeight: '1.5' }}>• {c}</p>)}
            </div>
          )}

          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '14px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', marginBottom: '10px', color: 'var(--text-muted)' }}>📋 FÓRMULA PARA FARMÁCIA DE MANIPULAÇÃO</p>
            <pre style={{ fontSize: '11px', lineHeight: '1.6', whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: '#F0EAF5', marginBottom: '12px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
              {sup.manipulationFormula}
            </pre>
            <CopyButton text={sup.manipulationFormula} />
          </div>
        </div>
      )}
    </div>
  );
}

function StackCard({ stack }: { stack: typeof SUPPLEMENT_STACKS[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', border: open ? '1px solid var(--brand-purple)' : '1px solid var(--border)' }}>
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: 'linear-gradient(90deg, rgba(126,92,142,0.08) 0%, transparent 100%)' }} onClick={() => setOpen(v => !v)}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '28px' }}>{stack.emoji}</span>
          <div>
            <p style={{ fontWeight: '700', fontSize: '15px' }}>Stack {stack.name}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{stack.description}</p>
            <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
              {stack.symptoms.map(s => <span key={s} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(126,92,142,0.2)', color: 'var(--brand-purple)', fontWeight: '600' }}>Para: {s}</span>)}
              <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(74,155,142,0.2)', color: 'var(--brand-teal)', fontWeight: '600' }}>Economiza ~50%</span>
            </div>
          </div>
        </div>
        {open ? <ChevronUp size={16} color="var(--brand-purple)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
      </div>

      {open && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '16px' }} onClick={e => e.stopPropagation()}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            💡 <strong>Vantagem do Stack:</strong> Todos os ativos em 1 cápsula diária. Até 50% mais barato que comprar cada um separado.
          </p>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '14px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', marginBottom: '10px', color: 'var(--text-muted)' }}>📋 FÓRMULA COMPLETA PARA FARMÁCIA</p>
            <pre style={{ fontSize: '11px', lineHeight: '1.6', whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: '#F0EAF5', marginBottom: '12px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
              {stack.manipulationFormula}
            </pre>
            <CopyButton text={stack.manipulationFormula} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function SuplementosPage() {
  const [tab, setTab] = useState<'individuais' | 'stacks'>('stacks');
  const [activeGroup, setActiveGroup] = useState<string>('todos');

  const filtered = tab === 'individuais'
    ? SUPPLEMENTS.filter(s => activeGroup === 'todos' || s.group === activeGroup)
    : SUPPLEMENT_STACKS;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '100px' }}>
      <div style={{ padding: '20px 20px 0' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>Suplementos</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Guia clínico com fórmulas para manipulação</p>
      </div>

      {/* Aviso legal */}
      <div style={{ margin: '16px 20px 0', background: 'rgba(212,165,106,0.1)', border: '1px solid rgba(212,165,106,0.3)', borderRadius: '12px', padding: '12px' }}>
        <p style={{ fontSize: '12px', lineHeight: '1.5', color: '#F0EAF5' }}>
          ⚠️ <strong>Aviso Médico:</strong> As fórmulas são baseadas em estudos clínicos. Consulte seu médico antes de iniciar, especialmente se usa medicamentos contínuos.
        </p>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {([['stacks', '💊 Stacks (Combos)', 'Vários ativos em 1 cápsula, economia de até 50%'], ['individuais', '🔬 Individuais', 'Suplemento por sintoma']] as const).map(([key, label, sub]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              flex: 1, padding: '12px 10px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer',
              border: tab === key ? 'none' : '1px solid var(--border)',
              background: tab === key ? 'linear-gradient(135deg, var(--brand-rose), var(--brand-purple))' : 'transparent',
            }}>
              <p style={{ fontWeight: '700', fontSize: '13px', color: tab === key ? 'white' : 'var(--text-muted)' }}>{label}</p>
              <p style={{ fontSize: '10px', color: tab === key ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', marginTop: '2px' }}>{sub}</p>
            </button>
          ))}
        </div>

        {/* Filtro por grupo (só em individuais) */}
        {tab === 'individuais' && (
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            <button onClick={() => setActiveGroup('todos')} style={{ whiteSpace: 'nowrap', padding: '7px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', border: activeGroup === 'todos' ? 'none' : '1px solid var(--border)', background: activeGroup === 'todos' ? 'linear-gradient(135deg, var(--brand-rose), var(--brand-purple))' : 'transparent', color: activeGroup === 'todos' ? 'white' : 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }}>Todos</button>
            {SUPPLEMENT_GROUPS.map(g => (
              <button key={g.key} onClick={() => setActiveGroup(g.key)} style={{ whiteSpace: 'nowrap', padding: '7px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', border: activeGroup === g.key ? 'none' : '1px solid var(--border)', background: activeGroup === g.key ? 'linear-gradient(135deg, var(--brand-rose), var(--brand-purple))' : 'transparent', color: activeGroup === g.key ? 'white' : 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }}>{g.emoji} {g.label}</button>
            ))}
          </div>
        )}

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tab === 'stacks'
            ? SUPPLEMENT_STACKS.map(s => <StackCard key={s.id} stack={s} />)
            : (filtered as Supplement[]).map(s => <SupplementCard key={s.id} sup={s} />)
          }
        </div>
      </div>
      <BottomNav active="suplementos" />
    </div>
  );
}
