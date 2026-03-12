const https = require('https');

const fs = require('fs');
const path = require('path');

// Carrega o .env.local manualmente para os scripts Node puramente se não tiver usando import
try {
  const envPath = path.resolve(__dirname, '../.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, val] = line.split('=');
    if (key && val) process.env[key.trim()] = val.trim();
  });
} catch (e) {
  console.log('Aviso: .env.local não encontrado ou erro ao ler.');
}

const PAT = process.env.SUPABASE_ACCESS_TOKEN || '';
const PROJECT = 'wfnkhkarqklddlxymikj';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function apiCall(path, method, body, useServiceKey = false) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const req = https.request({
      hostname: useServiceKey ? `${PROJECT}.supabase.co` : 'api.supabase.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${useServiceKey ? SERVICE_KEY : PAT}`,
        'apikey': useServiceKey ? SERVICE_KEY : PAT,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr),
      },
    }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

async function main() {
  const TEST_EMAIL = 'teste@hormosync.com.br';
  const TEST_PASS = 'HormoSync@2026';

  console.log('🧪 Criando usuário de teste no Supabase Auth...\n');

  // Create user via Admin API
  const res = await apiCall('/auth/v1/admin/users', 'POST', {
    email: TEST_EMAIL,
    password: TEST_PASS,
    email_confirm: true,
    user_metadata: { name: 'Ana Teste' },
  }, true);

  if (res.status === 200 || res.status === 201) {
    const userId = res.body.id;
    console.log(`✅ Usuário criado: ${TEST_EMAIL}`);
    console.log(`   ID: ${userId}\n`);

    // Update profile with quiz data
    const mgmt = await apiCall(`/v1/projects/${PROJECT}/database/query`, 'POST', {
      query: `
        UPDATE public.profiles SET
          name = 'Ana Teste',
          hormonal_profile = 'Cortisol Alto',
          phase = 'Perimenopausa',
          main_symptom = 'Fogacho',
          streak_days = 5,
          completed_days = 14,
          subscription_status = 'active',
          subscription_plan = 'annual',
          subscription_expires_at = NOW() + INTERVAL '1 year',
          updated_at = NOW()
        WHERE id = '${userId}';
      `
    });
    console.log('✅ Perfil atualizado com dados do quiz de teste');
    console.log('\n📋 Credenciais para testar o login:');
    console.log(`   Email: ${TEST_EMAIL}`);
    console.log(`   Senha: ${TEST_PASS}`);
    console.log(`\n🌐 Acesse: http://localhost:3000`);
  } else if (res.body?.message?.includes('already been registered') || res.status === 422) {
    console.log(`⚠️  Usuário ${TEST_EMAIL} já existe.`);
    console.log('\n📋 Credenciais para testar o login:');
    console.log(`   Email: ${TEST_EMAIL}`);
    console.log(`   Senha: ${TEST_PASS}`);
    console.log(`\n🌐 Acesse: http://localhost:3000`);
  } else {
    console.error('❌ Erro ao criar usuário:', JSON.stringify(res.body, null, 2));
  }
}

main().catch(console.error);
