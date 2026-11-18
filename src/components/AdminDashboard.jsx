import React from 'react';
import {
  ShoppingBag,
  LogOut,
  ExternalLink,
  ShieldCheck,
  PackageOpen,
  LayoutDashboard
} from 'lucide-react';

const dashboardStyles = `
  .admin-dashboard-layout {
    min-height: 100vh;
    background-color: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #0f172a;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  /* Header Superior do Painel */
  .admin-header {
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    position: sticky;
    top: 0;
    z-index: 50;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  }

  .admin-header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.85rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .admin-brand-wrap {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .admin-brand-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: #0f172a;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .admin-brand-titles {
    display: flex;
    flex-direction: column;
  }

  .admin-brand-title {
    font-size: 1.05rem;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
    margin: 0;
  }

  .admin-brand-badge {
    font-size: 0.75rem;
    font-weight: 600;
    color: #ea580c;
    letter-spacing: 0.02em;
  }

  .admin-header-actions {
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }

  .admin-user-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.75rem;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 9999px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #475569;
  }

  @media (max-width: 640px) {
    .admin-user-pill {
      display: none;
    }
  }

  .btn-admin-header {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.5rem 0.85rem;
    border-radius: 10px;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s ease;
    border: 1px solid transparent;
    text-decoration: none;
    box-sizing: border-box;
  }

  .btn-admin-outline {
    background: #ffffff;
    color: #334155;
    border-color: #cbd5e1;
  }

  .btn-admin-outline:hover {
    background: #f8fafc;
    color: #0f172a;
    border-color: #94a3b8;
  }

  .btn-admin-danger {
    background: #fef2f2;
    color: #dc2626;
    border-color: #fecaca;
  }

  .btn-admin-danger:hover {
    background: #fee2e2;
    color: #b91c1c;
  }

  /* Conteúdo Principal */
  .admin-main-container {
    flex: 1;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 2rem 1.25rem 4rem;
    box-sizing: border-box;
  }

  .admin-page-header {
    margin-bottom: 1.75rem;
  }

  .admin-page-title-wrap {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.35rem;
  }

  .admin-page-title {
    font-size: 1.5rem;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.02em;
    margin: 0;
  }

  .admin-page-subtitle {
    font-size: 0.9rem;
    color: #64748b;
    margin: 0;
  }

  /* Card da Área de Gerenciamento */
  .admin-content-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }

  .admin-content-card-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .admin-content-card-title {
    font-size: 1rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }

  .admin-content-card-body {
    padding: 2rem 1.5rem;
  }

  /* Estado Vazio */
  .admin-empty-state {
    text-align: center;
    padding: 3rem 1.5rem;
    max-width: 440px;
    margin: 0 auto;
  }

  .admin-empty-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 54px;
    height: 54px;
    border-radius: 16px;
    background: #f1f5f9;
    color: #64748b;
    margin-bottom: 1rem;
  }

  .admin-empty-title {
    font-size: 1.05rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 0.35rem;
  }

  .admin-empty-desc {
    font-size: 0.875rem;
    color: #64748b;
    line-height: 1.45;
    margin: 0;
  }
`;

/**
 * Componente AdminDashboard
 * 
 * Props:
 * - adminEmail: string | null (identificação discreta da sessão)
 * - onGoToStore: function() => void (retorna à vitrine pública)
 * - onLogout: function() => void (encerra a sessão)
 * - isLoggingOut: boolean (indica processamento de logout)
 */
export default function AdminDashboard({
  adminEmail,
  onGoToStore,
  onLogout,
  isLoggingOut = false
}) {
  return (
    <div className="admin-dashboard-layout">
      <style>{dashboardStyles}</style>

      {/* CABEÇALHO DA ADMINISTRAÇÃO */}
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-brand-wrap">
            <div className="admin-brand-icon">
              <LayoutDashboard size={20} strokeWidth={2.4} />
            </div>
            <div className="admin-brand-titles">
              <h1 className="admin-brand-title">Vitrine Oficial</h1>
              <span className="admin-brand-badge">Administração</span>
            </div>
          </div>

          <div className="admin-header-actions">
            {adminEmail && (
              <div className="admin-user-pill" title={`Sessão: ${adminEmail}`}>
                <ShieldCheck size={14} color="#059669" />
                <span>{adminEmail}</span>
              </div>
            )}

            <button
              type="button"
              className="btn-admin-header btn-admin-outline"
              onClick={onGoToStore}
              title="Visualizar a vitrine pública"
            >
              <ShoppingBag size={16} />
              <span>Ver vitrine</span>
            </button>

            <button
              type="button"
              className="btn-admin-header btn-admin-danger"
              onClick={onLogout}
              disabled={isLoggingOut}
              title="Encerrar sessão administrativa"
            >
              <LogOut size={16} />
              <span>{isLoggingOut ? 'Saindo...' : 'Sair'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="admin-main-container">
        <div className="admin-page-header">
          <div className="admin-page-title-wrap">
            <h2 className="admin-page-title">Gerenciamento de Produtos</h2>
          </div>
          <p className="admin-page-subtitle">
            Controle de catálogo, ofertas e links de afiliado
          </p>
        </div>

        {/* ÁREA PREPARADA PARA RECEBER A LISTAGEM FUTURA */}
        <div className="admin-content-card">
          <div className="admin-content-card-header">
            <h3 className="admin-content-card-title">Produtos do Catálogo</h3>
          </div>

          <div className="admin-content-card-body">
            <div className="admin-empty-state">
              <div className="admin-empty-icon">
                <PackageOpen size={26} strokeWidth={2.2} />
              </div>
              <h4 className="admin-empty-title">Nenhum produto cadastrado no momento</h4>
              <p className="admin-empty-desc">
                A listagem e as ações de gerenciamento de produtos serão disponibilizadas nesta seção.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

