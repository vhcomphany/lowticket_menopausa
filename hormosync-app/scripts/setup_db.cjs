const https = require('https');

const PAT = 'sbp_6d33718b25ec575997ac04a145604a0472a30a93';
const PROJECT = 'wfnkhkarqklddlxymikj';

function query(sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    const req = https.request({
      hostname: 'api.supabase.com',
      path: `/v1/projects/${PROJECT}/database/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAT}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) reject(new Error(JSON.stringify(parsed)));
          else resolve(parsed);
        } catch (e) { reject(new Error(data)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('🔍 Verificando estado atual do banco...\n');

  // 1. Listar tabelas existentes com colunas
  const existing = await query(`
    SELECT t.table_name, COUNT(c.column_name) as cols
    FROM information_schema.tables t
    LEFT JOIN information_schema.columns c 
      ON c.table_name = t.table_name AND c.table_schema = 'public'
    WHERE t.table_schema = 'public'
    GROUP BY t.table_name ORDER BY t.table_name;
  `);

  const expectedTables = ['profiles', 'symptom_logs', 'checklist_entries', 'journal_entries', 'challenge_progress'];
  const existingNames = existing.map(r => r.table_name);

  console.log('📋 Tabelas existentes:');
  if (existing.length === 0) {
    console.log('  (nenhuma)\n');
  } else {
    existing.forEach(r => {
      const ok = expectedTables.includes(r.table_name);
      console.log(`  ${ok ? '✅' : '⚪'} ${r.table_name} (${r.cols} colunas)`);
    });
    console.log('');
  }

  const missing = expectedTables.filter(t => !existingNames.includes(t));
  console.log('❓ Tabelas faltando:', missing.length === 0 ? 'nenhuma' : missing.join(', '));

  // 2. Verificar trigger
  const trig = await query(`SELECT trigger_name FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';`);
  console.log(`⚡ Trigger on_auth_user_created: ${trig.length > 0 ? '✅ EXISTE' : '❌ FALTANDO'}`);

  // 3. Verificar RLS
  const rls = await query(`SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;`);
  const rlsOff = rls.filter(r => !r.rowsecurity).map(r => r.tablename);
  console.log(`🔒 RLS desativado em: ${rlsOff.length === 0 ? 'nenhuma tabela' : rlsOff.join(', ')}`);

  console.log('\n\n🚀 Aplicando schema completo (CREATE IF NOT EXISTS)...\n');

  const statements = [
    `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,

    `CREATE TABLE IF NOT EXISTS public.profiles (
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
    )`,

    `CREATE TABLE IF NOT EXISTS public.symptom_logs (
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
    )`,

    `CREATE TABLE IF NOT EXISTS public.checklist_entries (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
      entry_date DATE DEFAULT CURRENT_DATE,
      task_id TEXT NOT NULL,
      task_label TEXT,
      completed BOOLEAN DEFAULT FALSE,
      completed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, entry_date, task_id)
    )`,

    `CREATE TABLE IF NOT EXISTS public.journal_entries (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
      prompt TEXT,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    `CREATE TABLE IF NOT EXISTS public.challenge_progress (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
      challenge_id TEXT NOT NULL,
      current_day INTEGER DEFAULT 0,
      status TEXT DEFAULT 'not_started',
      started_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ,
      UNIQUE(user_id, challenge_id)
    )`,

    `ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY`,
    `ALTER TABLE public.symptom_logs ENABLE ROW LEVEL SECURITY`,
    `ALTER TABLE public.checklist_entries ENABLE ROW LEVEL SECURITY`,
    `ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY`,
    `ALTER TABLE public.challenge_progress ENABLE ROW LEVEL SECURITY`,

    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users own profile') THEN
        CREATE POLICY "Users own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
      END IF;
    END $$`,

    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='symptom_logs' AND policyname='Users own symptom logs') THEN
        CREATE POLICY "Users own symptom logs" ON public.symptom_logs FOR ALL USING (auth.uid() = user_id);
      END IF;
    END $$`,

    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='checklist_entries' AND policyname='Users own checklist') THEN
        CREATE POLICY "Users own checklist" ON public.checklist_entries FOR ALL USING (auth.uid() = user_id);
      END IF;
    END $$`,

    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='journal_entries' AND policyname='Users own journal') THEN
        CREATE POLICY "Users own journal" ON public.journal_entries FOR ALL USING (auth.uid() = user_id);
      END IF;
    END $$`,

    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='challenge_progress' AND policyname='Users own challenges') THEN
        CREATE POLICY "Users own challenges" ON public.challenge_progress FOR ALL USING (auth.uid() = user_id);
      END IF;
    END $$`,

    `CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.profiles (id, email, name)
      VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER`,

    `DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users`,

    `CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user()`,
  ];

  for (const sql of statements) {
    const preview = sql.replace(/\s+/g, ' ').substring(0, 65);
    try {
      await query(sql);
      console.log(`  ✅ ${preview}...`);
    } catch (e) {
      const msg = e.message;
      if (msg.includes('already exists') || msg.includes('duplicate')) {
        console.log(`  ⏭️  JÁ EXISTE: ${preview}...`);
      } else {
        console.error(`  ❌ ERRO: ${msg.substring(0, 120)}`);
      }
    }
  }

  // 4. Estado final
  console.log('\n📊 Estado final:');
  const final = await query(`
    SELECT t.table_name, COUNT(c.column_name) as cols
    FROM information_schema.tables t
    LEFT JOIN information_schema.columns c ON c.table_name = t.table_name AND c.table_schema = 'public'
    WHERE t.table_schema = 'public'
    GROUP BY t.table_name ORDER BY t.table_name;
  `);
  final.forEach(r => {
    const ok = expectedTables.includes(r.table_name);
    console.log(`  ${ok ? '✅' : '⚪'} ${r.table_name} (${r.cols} colunas)`);
  });

  const trigFinal = await query(`SELECT trigger_name FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';`);
  console.log(`\n⚡ Trigger: ${trigFinal.length > 0 ? '✅ ATIVO' : '❌ FALTANDO'}`);
  console.log('\n🎉 Banco de dados configurado com sucesso!');
}

main().catch(e => { console.error('ERRO FATAL:', e.message); process.exit(1); });
