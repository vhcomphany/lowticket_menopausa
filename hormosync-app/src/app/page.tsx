'use client';

import { useState } from 'react';
import { Eye, EyeOff, Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoading(false);
      if (error.message.includes('Invalid login credentials')) {
        setError('E-mail ou senha incorretos. Verifique seus dados.');
      } else {
        setError('Ocorreu um erro ao entrar. Tente novamente.');
      }
      return;
    }

    // Middleware will handle redirect to /dashboard
    window.location.href = '/dashboard';
  };

  const startCountdown = () => {
    setResendCountdown(60);
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/auth/callback?next=/perfil`,
    });
    if (!error) {
      setForgotSent(true);
      startCountdown();
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/auth/callback?next=/perfil`,
    });
    startCountdown();
  };

  if (showForgot) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px' }}>
        <div className="animate-slideUp">
          <button
            onClick={() => { setShowForgot(false); setForgotSent(false); setResendCountdown(0); }}
            style={{ color: 'var(--text-muted)', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            ← Voltar
          </button>

          <div className="card-glow" style={{ padding: '28px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(200,88,122,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <span style={{ fontSize: '24px' }}>🔑</span>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Recuperar acesso</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
                {forgotSent
                  ? 'Verifique seu e-mail e clique no link para redefinir sua senha.'
                  : 'Digite o e-mail que você usou na compra e te enviamos um link de acesso.'}
              </p>
            </div>

            {!forgotSent ? (
              <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                  type="email"
                  className="input-field"
                  placeholder="seu@email.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn-primary">
                  Enviar link de redefinição
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ padding: '16px', background: 'rgba(74,155,142,0.1)', borderRadius: '12px', border: '1px solid rgba(74,155,142,0.3)', marginBottom: '20px' }}>
                  <p style={{ color: 'var(--brand-teal)', fontSize: '14px', fontWeight: '500' }}>
                    ✓ Email enviado para {forgotEmail}
                  </p>
                </div>
                <button
                  onClick={handleResend}
                  disabled={resendCountdown > 0}
                  className="btn-secondary"
                  style={{ opacity: resendCountdown > 0 ? 0.5 : 1 }}
                >
                  {resendCountdown > 0 ? `Reenviar em ${resendCountdown}s` : 'Reenviar email'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px' }}>
      <div className="animate-slideUp">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--brand-rose), var(--brand-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={22} color="white" fill="white" />
            </div>
            <span style={{ fontSize: '26px', fontWeight: '800', background: 'linear-gradient(135deg, #C8587A, #9B6AB0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              HormoSync
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Seu acompanhamento hormonal personalizado
          </p>
        </div>

        <div className="card-glow" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '6px' }}>Bem-vinda de volta 💜</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
            Entre com seu email e senha para continuar sua jornada.
          </p>

          {error && (
            <div style={{ padding: '12px 16px', background: 'rgba(200,88,122,0.1)', border: '1px solid rgba(200,88,122,0.3)', borderRadius: '10px', marginBottom: '16px', color: 'var(--brand-rose)', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '8px' }}>E-mail</label>
              <input
                type="email"
                className="input-field"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '8px' }}>Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  style={{ paddingRight: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '4px' }}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={() => setShowForgot(true)}
              style={{ color: 'var(--brand-rose)', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '3px' }}
            >
              Esqueci minha senha
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', marginTop: '24px', lineHeight: '1.6' }}>
          Ainda não tem acesso? Faça o{' '}
          <a href="https://seusite.com.br/quiz" style={{ color: 'var(--brand-rose)', textDecoration: 'none' }}>
            diagnóstico gratuito
          </a>
          {' '}para criar sua conta.
        </p>
      </div>
    </div>
  );
}
