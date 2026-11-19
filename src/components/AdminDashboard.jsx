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
  Pencil,
  Eye,
  EyeOff,
  Tag
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getMarketplaceClass } from '../lib/marketplace';
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
    /* Impede que qualquer filho quebre para fora da viewport */
    max-width: 100vw;
    overflow-x: hidden;
  }

  /* ============================================================
     CABEÇALHO — responsivo em até 2 linhas em celulares
     ============================================================ */
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
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;         /* quebra para 2 linhas se necessário */
  }

  .admin-brand-wrap {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  .admin-brand-icon {
    width: 36px;
    height: 36px;
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
    font-size: 1rem;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
    margin: 0;
  }

  .admin-brand-badge {
    font-size: 0.72rem;
    font-weight: 600;
    color: #ea580c;
    letter-spacing: 0.02em;
  }

  /* Ações do cabeçalho: quebram em duas linhas em mobile */
  .admin-header-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;         /* permite quebrar para nova linha */
    justify-content: flex-end;
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
    padding: 0.35rem 0.65rem;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 9999px;
    font-size: 0.78rem;
    font-weight: 600;
    color: #475569;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Oculta o e-mail em telas muito estreitas (mantém botões visíveis) */
  @media (max-width: 480px) {
    .admin-user-pill {
      display: none;
    }
  }

  .btn-admin-header {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.75rem;
    border-radius: 9px;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s ease;
    border: 1px solid transparent;
    text-decoration: none;
    box-sizing: border-box;
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* Em celulares muito estreitos, ocultar o texto dos botões "Ver vitrine" e "Sair",
     mantendo apenas o ícone (ainda totalmente clicável) */
  @media (max-width: 400px) {
    .btn-admin-header span {
      display: none;
    }
    .btn-admin-header {
      padding: 0.45rem 0.6rem;
    }
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

  /* ============================================================
     CONTEÚDO PRINCIPAL
     ============================================================ */
  .admin-main-container {
    flex: 1;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 1.5rem 1rem 4rem;
    box-sizing: border-box;
  }

  .admin-page-header {
    margin-bottom: 1.5rem;
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
    font-size: 1.4rem;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.02em;
    margin: 0;
  }

  .admin-page-subtitle {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
  }

  /* ============================================================
     CARD DE GERENCIAMENTO
     ============================================================ */
  .admin-content-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }

  .admin-content-card-header {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    flex-wrap: wrap;
    gap: 0.5rem;
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

  /* ============================================================
     ESTADOS DE FEEDBACK
     ============================================================ */
  .admin-feedback-state {
    text-align: center;
    padding: 3rem 1.25rem;
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

  /* ============================================================
     TABELA — desktop com espaço confortável (> 1100px)
     Em larguras de até 1100px (incluindo Surface Pro 960px e iPad Pro 1032px),
     ativa a apresentação em cartões responsivos, evitando scroll horizontal e botões cortados.
     ============================================================ */
  .admin-table-container {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .admin-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.84rem;
    table-layout: auto;
  }

  .admin-table th {
    background: #f8fafc;
    padding: 0.75rem 0.85rem;
    font-weight: 700;
    color: #475569;
    border-bottom: 1px solid #e2e8f0;
    text-transform: uppercase;
    font-size: 0.72rem;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  .admin-table td {
    padding: 0.85rem 0.85rem;
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

  /* ============================================================
     BADGES E CÉLULAS DA TABELA
     ============================================================ */
  .admin-thumb-img {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    object-fit: cover;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    display: block;
    flex-shrink: 0;
  }

  .admin-code-badge {
    display: inline-block;
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
    background: #0f172a;
    color: #ffffff;
    font-weight: 800;
    font-size: 0.72rem;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  .admin-product-name {
    font-weight: 600;
    color: #0f172a;
    max-width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }

  .admin-category-label {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    margin-top: 0.2rem;
    font-size: 0.72rem;
    font-weight: 600;
    color: #475569;
  }

  .admin-category-unclassified {
    color: #94a3b8;
    font-weight: 500;
    font-style: italic;
  }

  .admin-product-price {
    font-weight: 800;
    color: #ea580c;
    white-space: nowrap;
  }

  .admin-platform-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.22rem 0.5rem;
    border-radius: 6px;
    font-size: 0.72rem;
    font-weight: 700;
    white-space: nowrap;
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

  .platform-amazon {
    background: #232f3e;
    color: #ffffff;
    border: 1px solid #131921;
  }

  .platform-default {
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;
  }

  /* ============================================================
     STATUS BADGES
     ============================================================ */
  .admin-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.28rem 0.6rem;
    border-radius: 9999px;
    font-size: 0.72rem;
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
    flex-shrink: 0;
  }

  .status-dot-published {
    background: #10b981;
  }

  .status-dot-draft {
    background: #f59e0b;
  }

  /* ============================================================
     BOTÕES DE AÇÃO NAS LINHAS / CARDS
     ============================================================ */
  .btn-admin-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    padding: 0.38rem 0.6rem;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    background: #ffffff;
    color: #475569;
    border: 1px solid #cbd5e1;
    transition: all 0.2s ease;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .btn-admin-action:hover {
    background: #f8fafc;
    color: #0f172a;
    border-color: #94a3b8;
  }

  .btn-admin-action:active {
    background: #f1f5f9;
    transform: scale(0.98);
  }

  .btn-admin-action:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  /* Botão Publicar */
  .btn-publish {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    padding: 0.38rem 0.6rem;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    background: #ecfdf5;
    color: #047857;
    border: 1px solid #a7f3d0;
    transition: all 0.2s ease;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .btn-publish:hover {
    background: #d1fae5;
    border-color: #6ee7b7;
  }

  .btn-publish:active {
    background: #a7f3d0;
    transform: scale(0.98);
  }

  .btn-publish:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  /* Botão Retirar da Vitrine */
  .btn-withdraw {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    padding: 0.38rem 0.6rem;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    background: #fff7ed;
    color: #c2410c;
    border: 1px solid #fed7aa;
    transition: all 0.2s ease;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .btn-withdraw:hover {
    background: #ffedd5;
    border-color: #fdba74;
  }

  .btn-withdraw:active {
    background: #fed7aa;
    transform: scale(0.98);
  }

  .btn-withdraw:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  /* Grupo de botões de ação — pode quebrar linha nos cards mobile */
  .admin-action-group {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    flex-wrap: wrap;           /* <<< corrigido: era nowrap, bloqueava mobile */
  }

  /* Na tabela desktop, forçar os botões na mesma linha */
  .admin-table .admin-action-group {
    flex-wrap: nowrap;
  }

  /* ============================================================
     CARDS MOBILE — estrutura vertical com botões acessíveis
     ============================================================ */
  .admin-mobile-list {
    display: none;
    padding: 0.85rem;
    gap: 0.75rem;
    flex-direction: column;
  }

  .admin-mobile-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 0.9rem;
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    /* min-width: 0 no container evita overflow do filho flex */
    min-width: 0;
  }

  .admin-mobile-img {
    width: 58px;
    height: 58px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
  }

  .admin-mobile-details {
    flex: 1;
    min-width: 0;              /* essencial para evitar overflow de texto */
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .admin-mobile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .admin-mobile-title {
    font-size: 0.875rem;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.3;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .admin-mobile-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  /* Rodapé dos cards: botões em linha própria, sempre acessíveis */
  .admin-mobile-footer {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 0.3rem;
    flex-wrap: wrap;           /* <<< corrigido: quebra quando não cabe */
  }

  /* ============================================================
     BREAKPOINTS
     Tabela visível apenas acima de 1100px (desktop com largura confortável).
     Cards responsivos visíveis em 1100px ou menos (cobre celulares de 360-440px,
     iPad Mini de 768px, Surface Pro 10 de 960px e iPad Pro 13 de 1032px).
     ============================================================ */
  @media (max-width: 1100px) {
    .admin-table-container {
      display: none;
    }
    .admin-mobile-list {
      display: flex;
    }
  }

  /* ============================================================
     DIÁLOGO DE CONFIRMAÇÃO
     ============================================================ */
  .admin-confirm-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(3px);
    z-index: 200;
    display: flex;
    align-items: flex-start;    /* <<< flex-start + padding = scroll seguro */
    justify-content: center;
    padding: 1.25rem 1rem;
    box-sizing: border-box;
    overflow-y: auto;           /* scroll vertical se diálogo for alto */
    -webkit-overflow-scrolling: touch;
  }

  .admin-confirm-card {
    background: #ffffff;
    border-radius: 16px;
    padding: 1.5rem;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.04);
    border: 1px solid #e2e8f0;
    margin: auto;               /* centraliza verticalmente quando há espaço */
  }

  .admin-confirm-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .admin-confirm-icon-publish {
    background: #ecfdf5;
    color: #047857;
  }

  .admin-confirm-icon-withdraw {
    background: #fff7ed;
    color: #c2410c;
  }

  .admin-confirm-title {
    font-size: 1.05rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 0.5rem;
    line-height: 1.3;
  }

  .admin-confirm-desc {
    font-size: 0.875rem;
    color: #475569;
    margin: 0 0 0.35rem;
    line-height: 1.5;
  }

  .admin-confirm-product-name {
    font-size: 0.84rem;
    font-weight: 700;
    color: #0f172a;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    margin: 0.65rem 0 1.1rem;
    display: block;
    overflow-wrap: break-word;  /* <<< quebra nomes longos em vez de transbordar */
    word-break: break-word;
  }

  .admin-confirm-error {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 0.65rem 0.85rem;
    margin-bottom: 1rem;
    font-size: 0.84rem;
    color: #991b1b;
    line-height: 1.4;
  }

  /* Botões do diálogo: ocupam a largura total em telas muito estreitas */
  .admin-confirm-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  @media (max-width: 360px) {
    .admin-confirm-actions {
      flex-direction: column-reverse;
    }
    .admin-confirm-actions button {
      width: 100%;
      justify-content: center;
    }
  }

  .btn-confirm-cancel {
    padding: 0.55rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    background: #ffffff;
    color: #475569;
    border: 1px solid #cbd5e1;
    transition: all 0.2s ease;
  }

  .btn-confirm-cancel:hover {
    background: #f8fafc;
    border-color: #94a3b8;
  }

  .btn-confirm-cancel:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-confirm-publish {
    padding: 0.55rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 700;
    cursor: pointer;
    background: #047857;
    color: #ffffff;
    border: 1px solid #047857;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    transition: all 0.2s ease;
  }

  .btn-confirm-publish:hover {
    background: #065f46;
    border-color: #065f46;
  }

  .btn-confirm-publish:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-confirm-withdraw {
    padding: 0.55rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 700;
    cursor: pointer;
    background: #c2410c;
    color: #ffffff;
    border: 1px solid #c2410c;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    transition: all 0.2s ease;
  }

  .btn-confirm-withdraw:hover {
    background: #9a3412;
    border-color: #9a3412;
  }

  .btn-confirm-withdraw:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
  const [editingProduct, setEditingProduct] = useState(null);
  // confirmAction: { product, targetStatus } | null
  const [confirmAction, setConfirmAction] = useState(null);
  // togglingId: id do produto cuja operação de status está em andamento
  const [togglingId, setTogglingId] = useState(null);
  // toggleError: mensagem de erro exibida dentro do diálogo de confirmação
  const [toggleError, setToggleError] = useState(null);

  // Consulta administrativa à tabela 'products'
  // NÃO filtra por is_active = true para permitir visualização de publicados e rascunhos
  // Inclui todos os campos necessários para exibição e edição (old_price, link, etc.)
  const fetchAdminProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from('products')
        .select('id, code, name, category, image, price, old_price, platform, link, is_active, created_at')
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

  const handleProductSaved = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    fetchAdminProducts();
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  /**
   * Abre o diálogo de confirmação antes de alterar o status.
   * targetStatus: true = publicar | false = retirar da vitrine
   */
  const handleRequestToggle = (product, targetStatus) => {
    setToggleError(null);
    setConfirmAction({ product, targetStatus });
  };

  /** Cancela o diálogo de confirmação sem fazer nada */
  const handleCancelToggle = () => {
    if (togglingId) return; // Bloqueia cancelamento enquanto operação está em andamento
    setConfirmAction(null);
    setToggleError(null);
  };

  /**
   * Executa a alteração de status após confirmação explícita do administrador.
   * Altera SOMENTE o campo is_active do produto identificado pelo id.
   * Não altera nenhum outro campo. Não assume sucesso antes da resposta do servidor.
   */
  const handleConfirmToggle = async () => {
    if (!confirmAction) return;
    const { product, targetStatus } = confirmAction;

    setTogglingId(product.id);
    setToggleError(null);

    try {
      const { data: updatedRow, error: toggleErr } = await supabase
        .from('products')
        .update({ is_active: targetStatus })
        .eq('id', product.id)
        .select('id, is_active')
        .single();

      if (toggleErr) {
        // PGRST116: nenhuma linha correspondeu ao filtro — produto não encontrado
        if (toggleErr.code === 'PGRST116') {
          setToggleError('Produto não encontrado. Pode ter sido removido. Recarregue a listagem.');
        } else {
          setToggleError(toggleErr.message || 'Erro ao atualizar o status do produto.');
        }
        return;
      }

      // Verificação positiva: status retornado deve corresponder exatamente ao solicitado
      if (!updatedRow?.id || updatedRow.is_active !== targetStatus) {
        setToggleError('A alteração de status não pôde ser confirmada pelo servidor. Recarregue a listagem.');
        return;
      }

      // Sucesso confirmado — fecha o diálogo e atualiza a listagem do servidor
      setConfirmAction(null);
      setToggleError(null);
      await fetchAdminProducts();
    } catch (err) {
      setToggleError(err.message || 'Falha inesperada ao comunicar com o servidor.');
    } finally {
      setTogglingId(null);
    }
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
              onClick={handleOpenCreate}
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
                        <th style={{ width: '125px' }}>Código</th>
                        <th>Nome do Produto</th>
                        <th style={{ width: '120px' }}>Preço</th>
                        <th style={{ width: '130px' }}>Marketplace</th>
                        <th style={{ width: '120px' }}>Status</th>
                        <th style={{ width: '160px', textAlign: 'center' }}>Ações</th>
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
                            {prod.category && prod.category.trim() ? (
                              <span className="admin-category-label">
                                <Tag size={11} strokeWidth={2.2} />
                                <span>{prod.category.trim()}</span>
                              </span>
                            ) : (
                              <span className="admin-category-label admin-category-unclassified">
                                <Tag size={11} strokeWidth={2} />
                                <span>Sem categoria</span>
                              </span>
                            )}
                          </td>
                          <td>
                            <span className="admin-product-price">R$ {prod.price}</span>
                          </td>
                          <td>
                            <span
                              className={`admin-platform-badge ${getMarketplaceClass(prod.platform)}`}
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
                          <td style={{ textAlign: 'center' }}>
                            <div className="admin-action-group">
                              <button
                                type="button"
                                className="btn-admin-action"
                                onClick={() => handleOpenEdit(prod)}
                                disabled={togglingId === prod.id}
                                title={`Editar produto CÓD: ${prod.code}`}
                              >
                                <Pencil size={13} strokeWidth={2.2} />
                                <span>Editar</span>
                              </button>
                              {prod.is_active ? (
                                <button
                                  type="button"
                                  className="btn-withdraw"
                                  onClick={() => handleRequestToggle(prod, false)}
                                  disabled={togglingId === prod.id}
                                  title={`Retirar da vitrine: ${prod.name}`}
                                >
                                  {togglingId === prod.id ? (
                                    <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                                  ) : (
                                    <EyeOff size={13} strokeWidth={2.2} />
                                  )}
                                  <span>Retirar</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn-publish"
                                  onClick={() => handleRequestToggle(prod, true)}
                                  disabled={togglingId === prod.id}
                                  title={`Publicar na vitrine: ${prod.name}`}
                                >
                                  {togglingId === prod.id ? (
                                    <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                                  ) : (
                                    <Eye size={13} strokeWidth={2.2} />
                                  )}
                                  <span>Publicar</span>
                                </button>
                              )}
                            </div>
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

                        <div className="admin-mobile-meta">
                          {prod.category && prod.category.trim() ? (
                            <span className="admin-category-label">
                              <Tag size={11} strokeWidth={2.2} />
                              <span>{prod.category.trim()}</span>
                            </span>
                          ) : (
                            <span className="admin-category-label admin-category-unclassified">
                              <Tag size={11} strokeWidth={2} />
                              <span>Sem categoria</span>
                            </span>
                          )}
                        </div>

                        <div className="admin-mobile-footer">
                          <span className="admin-product-price">R$ {prod.price}</span>
                          <span
                            className={`admin-platform-badge ${getMarketplaceClass(prod.platform)}`}
                          >
                            {prod.platform}
                          </span>
                          <div className="admin-action-group">
                            <button
                              type="button"
                              className="btn-admin-action"
                              onClick={() => handleOpenEdit(prod)}
                              disabled={togglingId === prod.id}
                              title={`Editar produto CÓD: ${prod.code}`}
                            >
                              <Pencil size={13} strokeWidth={2.2} />
                              <span>Editar</span>
                            </button>
                            {prod.is_active ? (
                              <button
                                type="button"
                                className="btn-withdraw"
                                onClick={() => handleRequestToggle(prod, false)}
                                disabled={togglingId === prod.id}
                                title={`Retirar da vitrine: ${prod.name}`}
                              >
                                {togglingId === prod.id ? (
                                  <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                                ) : (
                                  <EyeOff size={13} strokeWidth={2.2} />
                                )}
                                <span>Retirar</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn-publish"
                                onClick={() => handleRequestToggle(prod, true)}
                                disabled={togglingId === prod.id}
                                title={`Publicar na vitrine: ${prod.name}`}
                              >
                                {togglingId === prod.id ? (
                                  <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                                ) : (
                                  <Eye size={13} strokeWidth={2.2} />
                                )}
                                <span>Publicar</span>
                              </button>
                            )}
                          </div>
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

      {/* FORMULÁRIO MODAL DE CADASTRO OU EDIÇÃO DE PRODUTO */}
      <AdminProductForm
        isOpen={isFormOpen}
        initialProduct={editingProduct}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        onProductSaved={handleProductSaved}
      />

      {/* DIÁLOGO DE CONFIRMAÇÃO DE PUBLICAÇÃO / RETIRADA */}
      {confirmAction && (
        <div
          className="admin-confirm-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-desc"
        >
          <div className="admin-confirm-card">
            <div
              className={`admin-confirm-icon ${
                confirmAction.targetStatus ? 'admin-confirm-icon-publish' : 'admin-confirm-icon-withdraw'
              }`}
            >
              {confirmAction.targetStatus
                ? <Eye size={22} strokeWidth={2.2} />
                : <EyeOff size={22} strokeWidth={2.2} />
              }
            </div>

            <h3 id="confirm-dialog-title" className="admin-confirm-title">
              {confirmAction.targetStatus
                ? 'Publicar produto na vitrine?'
                : 'Retirar produto da vitrine?'
              }
            </h3>

            <p id="confirm-dialog-desc" className="admin-confirm-desc">
              {confirmAction.targetStatus
                ? 'O produto ficará visível para todos os visitantes da vitrine pública.'
                : 'O produto será ocultado da vitrine pública. Ele permanece salvo no banco de dados e pode ser republicado a qualquer momento.'
              }
            </p>

            <span className="admin-confirm-product-name">
              CÓD: {confirmAction.product.code} — {confirmAction.product.name}
            </span>

            {toggleError && (
              <div className="admin-confirm-error" role="alert">
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>{toggleError}</span>
              </div>
            )}

            <div className="admin-confirm-actions">
              <button
                type="button"
                className="btn-confirm-cancel"
                onClick={handleCancelToggle}
                disabled={!!togglingId}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={confirmAction.targetStatus ? 'btn-confirm-publish' : 'btn-confirm-withdraw'}
                onClick={handleConfirmToggle}
                disabled={!!togglingId}
              >
                {togglingId ? (
                  <>
                    <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Aguarde...</span>
                  </>
                ) : confirmAction.targetStatus ? (
                  <>
                    <Eye size={15} />
                    <span>Sim, publicar</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={15} />
                    <span>Sim, retirar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
