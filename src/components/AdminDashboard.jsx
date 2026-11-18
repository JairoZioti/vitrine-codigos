import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  LogOut,
  ExternalLink,
  ShieldCheck,
  PackageOpen,
  LayoutDashboard,
  Loader2,
  AlertCircle,
  RefreshCw,
  PlusCircle,
  Tag
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import AdminProductForm from './AdminProductForm';

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

  .btn-admin-primary {
    background: #ea580c;
    color: #ffffff;
    border-color: #ea580c;
    box-shadow: 0 2px 4px rgba(234, 88, 12, 0.2);
  }

  .btn-admin-primary:hover {
    background: #c2410c;
    border-color: #c2410c;
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
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
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
    background: #ffffff;
  }

  .admin-content-card-title {
    font-size: 1rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }

  .admin-product-count-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.2rem 0.6rem;
    border-radius: 9999px;
    background: #f1f5f9;
    color: #475569;
    font-size: 0.8rem;
    font-weight: 700;
  }

  .admin-content-card-body {
    padding: 0;
  }

  /* Estados: Carregamento, Vazio e Erro */
  .admin-feedback-state {
    text-align: center;
    padding: 3.5rem 1.5rem;
    max-width: 440px;
    margin: 0 auto;
  }

  .admin-feedback-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 54px;
    height: 54px;
    border-radius: 16px;
    margin-bottom: 1rem;
  }

  .admin-icon-empty {
    background: #f1f5f9;
    color: #64748b;
  }

  .admin-icon-error {
    background: #fef2f2;
    color: #ef4444;
  }

  .admin-feedback-title {
    font-size: 1.05rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 0.35rem;
  }

  .admin-feedback-desc {
    font-size: 0.875rem;
    color: #64748b;
    line-height: 1.45;
    margin: 0 0 1.25rem;
  }

  .btn-admin-retry {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    background: #ea580c;
    color: #ffffff;
    border: none;
    padding: 0.65rem 1.25rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .btn-admin-retry:hover {
    background: #c2410c;
  }

  /* Tabela Responsiva para Desktop/Tablet */
  .admin-table-container {
    width: 100%;
    overflow-x: auto;
  }

  .admin-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.875rem;
  }

  .admin-table th {
    background: #f8fafc;
    padding: 0.85rem 1.25rem;
    font-weight: 700;
    color: #475569;
    border-bottom: 1px solid #e2e8f0;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  .admin-table td {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
    color: #1e293b;
  }

  .admin-table tr:last-child td {
    border-bottom: none;
  }

  .admin-table tr:hover td {
    background: #fafafa;
  }

  /* Badges e Células */
  .admin-thumb-img {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    object-fit: cover;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    display: block;
  }

  .admin-code-badge {
    display: inline-block;
    padding: 0.2rem 0.55rem;
    border-radius: 6px;
    background: #0f172a;
    color: #ffffff;
    font-weight: 800;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
  }

  .admin-product-name {
    font-weight: 600;
    color: #0f172a;
    max-width: 320px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }

  .admin-product-price {
    font-weight: 800;
    color: #ea580c;
  }

  .admin-platform-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.55rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .platform-shopee {
    background: #fff1f0;
    color: #ea580c;
    border: 1px solid #ffccc7;
  }

  .platform-mercadolivre {
    background: #fefce8;
    color: #854d0e;
    border: 1px solid #fef08a;
  }

  .platform-default {
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;
  }

  /* Status Badges */
  .admin-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.3rem 0.65rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .status-published {
    background: #ecfdf5;
    color: #047857;
    border: 1px solid #a7f3d0;
  }

  .status-draft {
    background: #fef3c7;
    color: #b45309;
    border: 1px solid #fde68a;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .status-dot-published {
    background: #10b981;
  }

  .status-dot-draft {
    background: #f59e0b;
  }

  /* Apresentação Compacta em Cards para Celular */
  .admin-mobile-list {
    display: none;
    padding: 1rem;
    gap: 0.85rem;
    flex-direction: column;
  }

  .admin-mobile-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    gap: 0.85rem;
    align-items: flex-start;
  }

  .admin-mobile-img {
    width: 64px;
    height: 64px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
  }

  .admin-mobile-details {
    flex: 1;
    min-width: 0;
  }

  .admin-mobile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.35rem;
  }

  .admin-mobile-title {
    font-size: 0.9rem;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.3;
    margin: 0 0 0.4rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .admin-mobile-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  @media (max-width: 768px) {
    .admin-table-container {
      display: none;
    }
    .admin-mobile-list {
      display: flex;
    }
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Consulta administrativa à tabela 'products'
  // NÃO filtra por is_active = true para permitir visualização de publicados e rascunhos
  const fetchAdminProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from('products')
        .select('id, code, name, image, price, platform, is_active, created_at')
        .order('created_at', { ascending: false });

      if (queryError) {
        console.error('Erro ao consultar produtos (admin):', queryError);
        setError('Não foi possível carregar a lista de produtos.');
      } else {
        setProducts(data || []);
      }
    } catch (err) {
      console.error('Exceção ao consultar produtos (admin):', err);
      setError('Falha na comunicação com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  const handleProductCreated = () => {
    fetchAdminProducts();
  };

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
              className="btn-admin-header btn-admin-primary"
              onClick={() => setIsFormOpen(true)}
              title="Cadastrar novo produto como rascunho"
            >
              <PlusCircle size={16} strokeWidth={2.5} />
              <span>Novo produto</span>
            </button>

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

        {/* ÁREA DE GERENCIAMENTO DE PRODUTOS */}
        <div className="admin-content-card">
          <div className="admin-content-card-header">
            <h3 className="admin-content-card-title">Produtos do Catálogo</h3>
            {!loading && !error && (
              <span className="admin-product-count-badge">
                {products.length} {products.length === 1 ? 'produto' : 'produtos'}
              </span>
            )}
          </div>

          <div className="admin-content-card-body">
            {/* Estado 1: Carregamento */}
            {loading && (
              <div className="admin-feedback-state">
                <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto', animation: 'spin 1s linear infinite', color: '#ea580c' }} />
                <p style={{ marginTop: '0.85rem', color: '#64748b', fontWeight: '600', fontSize: '0.9rem' }}>
                  Carregando produtos do catálogo...
                </p>
              </div>
            )}

            {/* Estado 2: Erro com ação de tentar novamente */}
            {!loading && error && (
              <div className="admin-feedback-state">
                <div className="admin-feedback-icon admin-icon-error">
                  <AlertCircle size={26} strokeWidth={2.2} />
                </div>
                <h4 className="admin-feedback-title">Erro ao carregar produtos</h4>
                <p className="admin-feedback-desc">{error}</p>
                <button
                  type="button"
                  className="btn-admin-retry"
                  onClick={fetchAdminProducts}
                >
                  <RefreshCw size={15} />
                  <span>Tentar novamente</span>
                </button>
              </div>
            )}

            {/* Estado 3: Lista vazia */}
            {!loading && !error && products.length === 0 && (
              <div className="admin-feedback-state">
                <div className="admin-feedback-icon admin-icon-empty">
                  <PackageOpen size={26} strokeWidth={2.2} />
                </div>
                <h4 className="admin-feedback-title">Nenhum produto cadastrado no momento</h4>
                <p className="admin-feedback-desc">
                  Não foram encontrados produtos cadastrados no banco de dados.
                </p>
              </div>
            )}

            {/* Estado 4: Tabela preenchida (Desktop e Tablet) */}
            {!loading && !error && products.length > 0 && (
              <>
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: '60px' }}>Imagem</th>
                        <th style={{ width: '90px' }}>Código</th>
                        <th>Nome do Produto</th>
                        <th style={{ width: '120px' }}>Preço</th>
                        <th style={{ width: '130px' }}>Marketplace</th>
                        <th style={{ width: '120px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((prod) => (
                        <tr key={prod.id || prod.code}>
                          <td>
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="admin-thumb-img"
                              loading="lazy"
                            />
                          </td>
                          <td>
                            <span className="admin-code-badge">CÓD: {prod.code}</span>
                          </td>
                          <td>
                            <span className="admin-product-name" title={prod.name}>
                              {prod.name}
                            </span>
                          </td>
                          <td>
                            <span className="admin-product-price">R$ {prod.price}</span>
                          </td>
                          <td>
                            <span
                              className={`admin-platform-badge ${
                                prod.platform === 'Shopee'
                                  ? 'platform-shopee'
                                  : prod.platform === 'Mercado Livre'
                                  ? 'platform-mercadolivre'
                                  : 'platform-default'
                              }`}
                            >
                              {prod.platform}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`admin-status-badge ${
                                prod.is_active ? 'status-published' : 'status-draft'
                              }`}
                            >
                              <span
                                className={`status-dot ${
                                  prod.is_active ? 'status-dot-published' : 'status-dot-draft'
                                }`}
                              />
                              <span>{prod.is_active ? 'Publicado' : 'Rascunho'}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Apresentação Compacta em Cards para Celular */}
                <div className="admin-mobile-list">
                  {products.map((prod) => (
                    <div key={prod.id || prod.code} className="admin-mobile-card">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="admin-mobile-img"
                        loading="lazy"
                      />
                      <div className="admin-mobile-details">
                        <div className="admin-mobile-header">
                          <span className="admin-code-badge">CÓD: {prod.code}</span>
                          <span
                            className={`admin-status-badge ${
                              prod.is_active ? 'status-published' : 'status-draft'
                            }`}
                          >
                            <span
                              className={`status-dot ${
                                prod.is_active ? 'status-dot-published' : 'status-dot-draft'
                              }`}
                            />
                            <span>{prod.is_active ? 'Publicado' : 'Rascunho'}</span>
                          </span>
                        </div>

                        <h4 className="admin-mobile-title" title={prod.name}>
                          {prod.name}
                        </h4>

                        <div className="admin-mobile-footer">
                          <span className="admin-product-price">R$ {prod.price}</span>
                          <span
                            className={`admin-platform-badge ${
                              prod.platform === 'Shopee'
                                ? 'platform-shopee'
                                : prod.platform === 'Mercado Livre'
                                ? 'platform-mercadolivre'
                                : 'platform-default'
                            }`}
                          >
                            {prod.platform}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* FORMULÁRIO MODAL DE CADASTRO DE PRODUTO COMO RASCUNHO */}
      <AdminProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onProductCreated={handleProductCreated}
      />
    </div>
  );
}
