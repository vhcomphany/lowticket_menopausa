'use client';

import { useState, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const audios = [
  { id: 1, title: 'Respiração Anti-Ansiedade', subtitle: '4-7-8 guiada', duration: '8 min', emoji: '🫁', tag: 'ansiedade', color: '#C8587A' },
  { id: 2, title: 'Relaxamento para Dormir', subtitle: 'Voz guiada suave', duration: '15 min', emoji: '🌙', tag: 'sono', color: '#7E5C8E' },
  { id: 3, title: 'Ruído Marrom', subtitle: 'Bloqueio de pensamentos', duration: '45 min', emoji: '🌊', tag: 'foco', color: '#4A9B8E' },
  { id: 4, title: 'Meditação do Acolhimento', subtitle: 'Aceite seu corpo', duration: '12 min', emoji: '💜', tag: 'emocional', color: '#D4A56A' },
  { id: 5, title: 'Chuva Terapêutica', subtitle: 'Som para relaxar', duration: '60 min', emoji: '🌧️', tag: 'sono', color: '#7E5C8E' },
  { id: 6, title: 'Energia da Manhã', subtitle: 'Ativação suave', duration: '5 min', emoji: '☀️', tag: 'energia', color: '#D4A56A' },
];

export default function AudiosPage() {
  const [playing, setPlaying] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeTag, setActiveTag] = useState('todos');

  const tags = ['todos', 'sono', 'ansiedade', 'foco', 'emocional', 'energia'];

  const filtered = activeTag === 'todos' ? audios : audios.filter(a => a.tag === activeTag);

  const handlePlay = (id: number) => {
    if (playing === id) {
      setPlaying(null);
    } else {
      setPlaying(id);
      setProgress(0);
      // Simula progresso
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { clearInterval(interval); setPlaying(null); return 0; }
          return p + 0.5;
        });
      }, 200);
    }
  };

  const currentAudio = audios.find(a => a.id === playing);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '90px' }}>
      <div style={{ padding: '20px 20px 0' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>Áudios Terapêuticos</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Sons que cuidam da mente e do corpo</p>
      </div>

      {/* Mini player fixo se tocando */}
      {currentAudio && (
        <div style={{ margin: '16px 20px 0', padding: '16px', background: `linear-gradient(135deg, ${currentAudio.color}20, ${currentAudio.color}10)`, borderRadius: '16px', border: `1px solid ${currentAudio.color}40` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <p style={{ fontWeight: '700', fontSize: '15px' }}>{currentAudio.emoji} {currentAudio.title}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{currentAudio.subtitle}</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><SkipBack size={20} /></button>
              <button
                onClick={() => setPlaying(null)}
                style={{ width: '42px', height: '42px', borderRadius: '50%', background: currentAudio.color, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Pause size={18} color="white" />
              </button>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><SkipForward size={20} /></button>
            </div>
          </div>
          <div className="progress-bar">
            <div style={{ height: '100%', width: `${progress}%`, borderRadius: '100px', background: currentAudio.color, transition: 'width 0.2s linear' }} />
          </div>
        </div>
      )}

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {tags.map(t => (
            <button
              key={t}
              onClick={() => setActiveTag(t)}
              style={{
                whiteSpace: 'nowrap', padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: '600',
                border: activeTag === t ? 'none' : '1px solid var(--border)',
                background: activeTag === t ? 'linear-gradient(135deg, var(--brand-rose), var(--brand-purple))' : 'transparent',
                color: activeTag === t ? 'white' : 'var(--text-muted)', cursor: 'pointer', flexShrink: 0,
                textTransform: 'capitalize',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Audio list */}
        {filtered.map(audio => (
          <div
            key={audio.id}
            className="card"
            style={{ display: 'flex', gap: '14px', alignItems: 'center', cursor: 'pointer', border: playing === audio.id ? `1px solid ${audio.color}60` : '1px solid var(--border)', background: playing === audio.id ? `${audio.color}08` : 'var(--bg-card)' }}
            onClick={() => handlePlay(audio.id)}
          >
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `${audio.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>
              {audio.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '2px' }}>{audio.title}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{audio.subtitle} · {audio.duration}</p>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: audio.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {playing === audio.id ? <Pause size={16} color="white" /> : <Play size={16} color="white" style={{ marginLeft: '2px' }} />}
            </div>
          </div>
        ))}
      </div>

      <BottomNav active="audios" />
    </div>
  );
}
