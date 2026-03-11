'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface Profile {
  id: string;
  name: string;
  email: string;
  hormonal_profile: string;
  phase: string | null;
  main_symptom: string | null;
  subscription_status: string;
  subscription_plan: string;
  subscription_expires_at: string | null;
  is_premium: boolean;
  streak_days: number;
  completed_days: number;
  joined_at: string;
}

export interface SymptomLog {
  id: string;
  logged_at: string;
  fogacho: number | null;
  sono: number | null;
  energia: number | null;
  humor: number | null;
  notes: string | null;
}

export interface ChecklistEntry {
  id: string;
  entry_date: string;
  task_id: string;
  task_label: string | null;
  completed: boolean;
  completed_at: string | null;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUser({ id: user.id, email: user.email || '' });

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(data);
      setLoading(false);
    }
    load();
  }, []);

  return { profile, user, loading, supabase };
}

export function useTodayChecklist(userId: string | undefined) {
  const [entries, setEntries] = useState<ChecklistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const defaultTasks = [
    { task_id: 'morning_shot', task_label: 'Shot de limão + sal rosa (3 min)', time: 'Manhã' },
    { task_id: 'morning_breath', task_label: 'Respiração 4-7-8 ao acordar (3 min)', time: 'Manhã' },
    { task_id: 'afternoon_tea', task_label: 'Chá de Camomila com Mulungu (5 min)', time: 'Tarde' },
    { task_id: 'night_protocol', task_label: 'Protocolo Noturno Anti-Cortisol (7 min)', time: 'Noite' },
  ];

  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    async function load() {
      // Busca checklist de hoje
      const { data: existing } = await supabase
        .from('checklist_entries')
        .select('*')
        .eq('user_id', userId!)
        .eq('entry_date', today);

      if (existing && existing.length > 0) {
        setEntries(existing);
      } else {
        // Cria as tarefas do dia se não existirem ainda
        const toInsert = defaultTasks.map(t => ({
          user_id: userId,
          entry_date: today,
          task_id: t.task_id,
          task_label: t.task_label,
          completed: false,
        }));
        const { data: created } = await supabase
          .from('checklist_entries')
          .insert(toInsert)
          .select();
        setEntries(created || []);
      }
      setLoading(false);
    }
    load();
  }, [userId]);

  const toggleTask = async (taskId: string, currentState: boolean) => {
    if (!userId) return;
    const now = new Date().toISOString();

    // Optimistic update
    setEntries(prev => prev.map(e =>
      e.task_id === taskId
        ? { ...e, completed: !currentState, completed_at: !currentState ? now : null }
        : e
    ));

    await supabase
      .from('checklist_entries')
      .update({ completed: !currentState, completed_at: !currentState ? now : null })
      .eq('user_id', userId)
      .eq('entry_date', today)
      .eq('task_id', taskId);
  };

  return { entries, loading, toggleTask, defaultTasks };
}

export function useTodaySymptoms(userId: string | undefined) {
  const [symptoms, setSymptoms] = useState<SymptomLog | null>(null);
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!userId) return;
    supabase
      .from('symptom_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('logged_at', today)
      .single()
      .then(({ data }) => setSymptoms(data));
  }, [userId]);

  const saveSymptoms = async (values: { fogacho: number; sono: number; energia: number; humor: number }) => {
    if (!userId) return;
    await supabase
      .from('symptom_logs')
      .upsert({ user_id: userId, logged_at: today, ...values }, { onConflict: 'user_id,logged_at' });
    setSymptoms(prev => ({ ...prev, ...values } as SymptomLog));
  };

  return { symptoms, saveSymptoms };
}
