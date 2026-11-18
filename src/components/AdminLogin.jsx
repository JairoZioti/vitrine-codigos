import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

const loginStyles = `
  .admin-login-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1.5rem 1rem;
    background-color: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #0f172a;
    box-sizing: border-box;
  }

  .admin-login-card {
    width: 100%;
    max-width: 420px;
    background: #ffffff;
    border-radius: 20px;
    padding: 2.25rem 2rem;
    box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
    border: 1px solid #e2e8f0;
    box-sizing: border-box;
  }

  .admin-login-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .admin-login-icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: linear-gradient(135deg, #ffedd5, #fed7aa);
    color: #ea580c;
    margin-bottom: 1rem;
    box-shadow: 0 4px 12px rgba(234, 88, 12, 0.15);
  }

  .admin-login-title {
    font-size: 1.45rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #0f172a;
    margin-bottom: 0.35rem;
  }

  .admin-login-subtitle {
    font-size: 0.875rem;
    color: #64748b;
  }

  .admin-login-error {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #991b1b;
    padding: 0.85rem 1rem;
    border-radius: 10px;
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
    line-height: 1.4;
  }

  .admin-login-error-icon {
    flex-shrink: 0;
    margin-top: 0.1rem;
  }

  .admin-form-group {
    margin-bottom: 1.25rem;
  }

  .admin-form-label {
    display: block;
    font-size: 0.85rem;
    font-weight: 700;
    color: #334155;
    margin-bottom: 0.45rem;
  }

  .admin-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .admin-input-icon {
    position: absolute;
    left: 1rem;
    color: #94a3b8;
    pointer-events: none;
  }

  .admin-input {
    width: 100%;
    padding: 0.85rem 1rem 0.85rem 2.85rem;
    border: 1.5px solid #cbd5e1;
    border-radius: 12px;
    font-size: 0.95rem;
    color: #0f172a;
    background: #f8fafc;
    outline: none;
    transition: all 0.2s ease-in-out;
    box-sizing: border-box;
  }

  .admin-input:focus {
    background: #ffffff;
    border-color: #ea580c;
    box-shadow: 0 0 0 4px rgba(234, 88, 12, 0.12);
  }

  .admin-input:disabled {
    background: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
  }

  .admin-toggle-pwd {
    position: absolute;
    right: 0.85rem;
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 0.35rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: color 0.15s ease;
  }

  .admin-toggle-pwd:hover {
    color: #0f172a;
  }

  .admin-toggle-pwd:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .btn-admin-submit {
    width: 100%;
    padding: 0.95rem 1.5rem;
    background: #ea580c;
    color: #ffffff;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1.75rem;
    transition: background 0.2s ease, transform 0.1s ease;
    box-shadow: 0 4px 12px rgba(234, 88, 12, 0.25);
  }

  .btn-admin-submit:hover:not(:disabled) {
    background: #c2410c;
  }

  .btn-admin-submit:active:not(:disabled) {
    transform: scale(0.99);
  }

  .btn-admin-submit:disabled {
    background: #fdba74;
    cursor: not-allowed;
    box-shadow: none;
  }

  .admin-login-footer {
    margin-top: 1.75rem;
    text-align: center;
  }

  .btn-back-vitrine {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    background: none;
    border: none;
    color: #64748b;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    transition: all 0.15s ease;
  }

  .btn-back-vitrine:hover {
    color: #0f172a;
    background: #f1f5f9;
  }

  .admin-security-note {
    margin-top: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    color: #94a3b8;
  }
`;

/**
 * Componente AdminLogin
 * 
 * Props:
 * - onSubmit: function({ email, password }) => Promise<void> | void
 * - onBackToStore: function() => void
 * - isLoading: boolean (controlado externamente ou pelo estado local)
 * - errorMessage: string | null
 */
export default function AdminLogin({
  onSubmit,
  onBackToStore,
  isLoading = false,
  errorMessage = null
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setValidationError('Por favor, informe seu e-mail.');
      return;
    }

    if (!password) {
      setValidationError('Por favor, informe sua senha.');
      return;
    }

    if (onSubmit) {
      onSubmit({ email: trimmedEmail, password });
    }
  };

  const displayedError = validationError || errorMessage;
  const isFormDisabled = isLoading;

  return (
    <div className="admin-login-wrapper">
      <style>{loginStyles}</style>

      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-icon-wrap">
            <Lock size={24} strokeWidth={2.4} />
          </div>
          <h1 className="admin-login-title">Acesso Administrativo</h1>
          <p className="admin-login-subtitle">
            Gerenciamento exclusivo da Vitrine Oficial
          </p>
        </div>

        {displayedError && (
          <div className="admin-login-error" role="alert">
            <AlertCircle size={18} className="admin-login-error-icon" />
            <span>{displayedError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="admin-email">
              E-mail
            </label>
            <div className="admin-input-wrap">
              <Mail size={18} className="admin-input-icon" />
              <input
                id="admin-email"
                type="email"
                name="email"
                className="admin-input"
                placeholder="seu-email@dominio.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationError) setValidationError('');
                }}
                disabled={isFormDisabled}
                autoComplete="email"
                autoFocus
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="admin-password">
              Senha
            </label>
            <div className="admin-input-wrap">
              <Lock size={18} className="admin-input-icon" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="admin-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationError) setValidationError('');
                }}
                disabled={isFormDisabled}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="admin-toggle-pwd"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isFormDisabled}
                title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-admin-submit"
            disabled={isFormDisabled}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Autenticando...</span>
              </>
            ) : (
              <span>Entrar no Painel</span>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <button
            type="button"
            className="btn-back-vitrine"
            onClick={onBackToStore}
            disabled={isFormDisabled}
          >
            <ArrowLeft size={16} />
            <span>Voltar à vitrine</span>
          </button>
        </div>
      </div>

      <div className="admin-security-note">
        <ShieldCheck size={14} />
        <span>Área restrita. Conexão autenticada e monitorada.</span>
      </div>
    </div>
  );
}

