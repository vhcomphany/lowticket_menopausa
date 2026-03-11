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

export interface JournalEntry {
  id: string;
  user_id: string;
  prompt: string;
  content: string;
  created_at: string;
}

export interface ChallengeProgress {
  id: string;
  user_id: string;
  challenge_id: string;
  current_day: number;
  status: string;
  started_at: string | null;
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

export function useJournalEntries(userId: string | undefined) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setEntries(data || []);
        setLoading(false);
      });
  }, [userId]);

  const addEntry = async (prompt: string, content: string) => {
    if (!userId) return;
    const { data } = await supabase
      .from('journal_entries')
      .insert([{ user_id: userId, prompt, content }])
      .select()
      .single();
    if (data) setEntries(prev => [data, ...prev]);
  };

  return { entries, loading, addEntry };
}

export function useChallenges(userId: string | undefined) {
  const [challenges, setChallenges] = useState<ChallengeProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase
      .from('challenge_progress')
      .select('*')
      .eq('user_id', userId)
      .then(({ data }) => {
        setChallenges(data || []);
        setLoading(false);
      });
  }, [userId]);

  const startChallenge = async (challengeId: string) => {
    if (!userId) return;
    const { data } = await supabase
      .from('challenge_progress')
      .upsert({ user_id: userId, challenge_id: challengeId, current_day: 0, status: 'in_progress', started_at: new Date().toISOString() }, { onConflict: 'user_id,challenge_id' })
      .select()
      .single();
    if (data) setChallenges(prev => [...prev.filter(c => c.challenge_id !== challengeId), data]);
  };

  const advanceChallenge = async (challengeId: string, currentDay: number, totalDays: number) => {
    if (!userId) return;
    const nextDay = currentDay + 1;
    const isCompleted = nextDay >= totalDays;
    const status = isCompleted ? 'completed' : 'in_progress';
    const completedAt = isCompleted ? new Date().toISOString() : null;

    const { data } = await supabase
      .from('challenge_progress')
      .update({ current_day: nextDay, status, completed_at: completedAt })
      .eq('user_id', userId)
      .eq('challenge_id', challengeId)
      .select()
      .single();
    if (data) setChallenges(prev => prev.map(c => c.challenge_id === challengeId ? data : c));
  };

  return { challenges, loading, startChallenge, advanceChallenge };
}

export function useSymptomHistory(userId: string | undefined, limit: number = 7) {
  const [history, setHistory] = useState<SymptomLog[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase
      .from('symptom_logs')
      .select('*')
      .eq('user_id', userId)
      .order('logged_at', { ascending: false })
      .limit(limit)
      .then(({ data }) => {
        setHistory(data || []);
        setLoading(false);
      });
  }, [userId, limit]);

  return { history, loading };
}
