-- ============================================================
-- HORMOSYNC APP — Schema SQL
-- Cole tudo isso no Supabase SQL Editor e pressione Ctrl+Enter
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TABELA: profiles (vinculada ao auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  hormonal_profile TEXT DEFAULT 'pending',
  phase TEXT,
  main_symptom TEXT,
  quiz_answers JSONB DEFAULT '{}',
  subscription_status TEXT DEFAULT 'active',
  subscription_plan TEXT DEFAULT 'annual',
  subscription_expires_at TIMESTAMPTZ,
  is_premium BOOLEAN DEFAULT FALSE,
  streak_days INTEGER DEFAULT 0,
  completed_days INTEGER DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABELA: registros de sintomas diários
CREATE TABLE IF NOT EXISTS public.symptom_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  logged_at DATE DEFAULT CURRENT_DATE,
  fogacho INTEGER CHECK (fogacho BETWEEN 1 AND 10),
  sono INTEGER CHECK (sono BETWEEN 1 AND 10),
  energia INTEGER CHECK (energia BETWEEN 1 AND 10),
  humor INTEGER CHECK (humor BETWEEN 1 AND 10),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, logged_at)
);

-- TABELA: checklist diário
CREATE TABLE IF NOT EXISTS public.checklist_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  entry_date DATE DEFAULT CURRENT_DATE,
  task_id TEXT NOT NULL,
  task_label TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, entry_date, task_id)
);

-- TABELA: diário emocional
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  prompt TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABELA: progresso nos desafios
CREATE TABLE IF NOT EXISTS public.challenge_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_id TEXT NOT NULL,
  current_day INTEGER DEFAULT 0,
  status TEXT DEFAULT 'not_started',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, challenge_id)
);

-- Ativar Row Level Security (RLS) em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_progress ENABLE ROW LEVEL SECURITY;

-- Políticas: cada usuária só acessa seus próprios dados
CREATE POLICY "Users own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users own symptom logs" ON public.symptom_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own checklist" ON public.checklist_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own journal" ON public.journal_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own challenges" ON public.challenge_progress FOR ALL USING (auth.uid() = user_id);

-- Função: criar profile automaticamente quando usuária compra e é criada no auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: executa a função acima a cada novo cadastro
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
