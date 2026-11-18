import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Star,
  Search,
  PlusCircle,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  PackageOpen,
  LogOut,
  Lock
} from 'lucide-react';
import { supabase } from './lib/supabase';
import { loginWithPassword, logout, verifyAdminStatus } from './lib/auth.js';
import AdminLogin from './components/AdminLogin.jsx';

const cssStyles = `
  /* Resets e Escopo */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: #f8fafc;
    color: #0f172a;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  #root {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    border: none !important;
    text-align: left !important;
  }

  .vitrine-app {
    min-height: 100vh;
    background-color: #f8fafc;
    display: flex;
    flex-direction: column;
  }

  /* Header Fixo com Efeito Glass */
  .header-fixed {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
  }

  .header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 1.25rem 1.15rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .header-brand {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .brand-title-wrap {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    cursor: pointer;
    user-select: none;
  }

  .brand-icon-pill {
    background: linear-gradient(135deg, #ffedd5, #fed7aa);
    color: #ea580c;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(234, 88, 12, 0.15);
  }

  .header-title {
    font-size: 1.4rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #0f172a;
    line-height: 1.2;
    margin: 0;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .verified-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.65rem;
    background-color: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #15803d;
    font-size: 0.75rem;
    font-weight: 700;
    border-radius: 9999px;
  }

  .btn-add-product {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.75rem;
    background: #0f172a;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-add-product:hover {
    background: #ea580c;
  }

  /* Barra de Busca */
  .search-container {
    position: relative;
    width: 100%;
  }

  .search-icon-svg {
    position: absolute;
    left: 1.1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
    transition: color 0.2s;
  }

  .search-input {
    width: 100%;
    padding: 0.875rem 1.1rem 0.875rem 3rem;
    font-size: 0.95rem;
    border-radius: 12px;
    border: 2px solid #e2e8f0;
    background-color: #f1f5f9;
    color: #0f172a;
    outline: none;
    transition: all 0.2s ease-in-out;
  }

  .search-input:focus {
    border-color: #f97316;
    background-color: #ffffff;
    box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.12);
  }

  .search-input:focus + .search-icon-svg {
    color: #ea580c;
  }

  /* Conteúdo Principal */
  .main-content {
    flex: 1;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 1.25rem 1rem 3rem;
  }

  .filter-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding: 0 0.25rem;
  }

  .filter-summary {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
  }

  .filter-count {
    font-weight: 700;
    color: #0f172a;
  }

  /* Grid Responsivo */
  .catalog-grid {
    display: grid;
    gap: 1.25rem;
    grid-template-columns: 1fr;
  }

  @media (min-width: 640px) {
    .catalog-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 900px) {
    .catalog-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 1140px) {
    .catalog-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  /* Card do Produto */
  .product-card {
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #f1f5f9;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }

  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 24px -4px rgba(0, 0, 0, 0.08), 0 8px 12px -6px rgba(0, 0, 0, 0.04);
    border-color: #fed7aa;
  }

  .card-media {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    background-color: #f1f5f9;
  }

  .card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.35s ease;
  }

  .product-card:hover .card-img {
    transform: scale(1.05);
  }

  /* Badge de Alto Contraste */
  .code-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 10;
    background: #0f172a;
    color: #ffffff;
    font-weight: 800;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    padding: 0.35rem 0.65rem;
    border-radius: 8px;
    border: 1.5px solid rgba(255, 255, 255, 0.25);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .platform-tag {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.3rem 0.55rem;
    border-radius: 6px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .platform-shopee {
    background: #ee4d2d;
    color: #ffffff;
  }

  .platform-mercadolivre {
    background: #ffe600;
    color: #2d3277;
    font-weight: 800;
  }

  .card-body {
    padding: 1.1rem;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .card-rating-row {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    margin-bottom: 0.5rem;
    font-size: 0.8rem;
    color: #64748b;
  }

  .star-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    color: #eab308;
    font-weight: 700;
  }

  .card-title {
    font-size: 0.975rem;
    font-weight: 600;
    color: #1e293b;
    line-height: 1.35;
    margin-bottom: 0.85rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 2.7em;
  }

  .card-pricing {
    margin-top: auto;
    padding-top: 0.5rem;
    border-top: 1px dashed #f1f5f9;
  }

  .card-old-price {
    font-size: 0.8rem;
    color: #94a3b8;
    text-decoration: line-through;
    line-height: 1;
  }

  .card-price-row {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
    margin-top: 0.15rem;
  }

  .price-currency {
    font-size: 0.9rem;
    font-weight: 700;
    color: #ea580c;
  }

  .price-value {
    font-size: 1.45rem;
    font-weight: 900;
    color: #ea580c;
    letter-spacing: -0.02em;
  }

  .btn-view-details {
    margin-top: 0.85rem;
    width: 100%;
    padding: 0.7rem;
    background: #fff7ed;
    color: #ea580c;
    border: 1.5px solid #fed7aa;
    border-radius: 10px;
    font-weight: 700;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .product-card:hover .btn-view-details {
    background: #ea580c;
    color: #ffffff;
    border-color: #ea580c;
  }

  /* Empty State & Error State */
  .empty-state {
    text-align: center;
    padding: 3.5rem 1.5rem;
    background: #ffffff;
    border-radius: 16px;
    border: 1px dashed #cbd5e1;
    max-width: 480px;
    margin: 2rem auto;
  }

  .state-icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 16px;
    margin-bottom: 1rem;
  }

  .state-icon-empty {
    background: #f1f5f9;
    color: #64748b;
  }

  .state-icon-error {
    background: #fef2f2;
    color: #ef4444;
  }

  .empty-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  .empty-desc {
    color: #64748b;
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 1.25rem;
  }

  .btn-reset-search {
    background: #0f172a;
    color: #ffffff;
    border: none;
    padding: 0.65rem 1.25rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }

  .btn-retry {
    background: #ea580c;
    color: #ffffff;
    border: none;
    padding: 0.65rem 1.25rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    transition: background 0.2s;
  }

  .btn-retry:hover {
    background: #c2410c;
  }

  /* Tela de Detalhes em Tela Cheia */
  .details-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ffffff;
    z-index: 100;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .details-nav {
    position: sticky;
    top: 0;
    background: rgba(255, 255, 255, 0.97);
    backdrop-filter: blur(10px);
    z-index: 60;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.85rem 1.25rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .btn-back-nav {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #f1f5f9;
    color: #0f172a;
    border: none;
    padding: 0.55rem 0.95rem;
    border-radius: 9999px;
    font-weight: 700;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .btn-back-nav:hover {
    background: #e2e8f0;
  }

  .nav-center-info {
    font-weight: 800;
    font-size: 0.875rem;
    color: #ea580c;
    letter-spacing: 0.05em;
  }

  .details-body {
    max-width: 640px;
    width: 100%;
    margin: 0 auto;
    padding-bottom: 130px;
  }

  .details-media-container {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    background: #f8fafc;
  }

  .details-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .details-code-badge {
    position: absolute;
    bottom: 16px;
    left: 16px;
    background: #0f172a;
    color: #ffffff;
    font-size: 0.85rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    padding: 0.45rem 0.85rem;
    border-radius: 8px;
    border: 1.5px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  }

  .details-info-section {
    padding: 1.5rem 1.25rem;
  }

  .details-platform-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  .platform-pill-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.75rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
  }

  .details-title {
    font-size: 1.35rem;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.3;
    margin-bottom: 0.85rem;
  }

  .details-reviews-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
  }

  .stars-group {
    display: flex;
    align-items: center;
    color: #f59e0b;
    gap: 2px;
  }

  .rating-score {
    font-weight: 800;
    color: #0f172a;
    margin-left: 0.25rem;
  }

  .reviews-count {
    color: #64748b;
  }

  .details-pricing-card {
    background: #fff7ed;
    border: 1px solid #ffedd5;
    border-radius: 14px;
    padding: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .details-old-price-line {
    font-size: 0.95rem;
    color: #94a3b8;
    text-decoration: line-through;
    margin-bottom: 0.2rem;
  }

  .details-main-price {
    display: flex;
    align-items: baseline;
    gap: 0.35rem;
    color: #ea580c;
  }

  .details-main-price .curr {
    font-size: 1.35rem;
    font-weight: 800;
  }

  .details-main-price .amount {
    font-size: 2.75rem;
    font-weight: 900;
    letter-spacing: -0.03em;
    line-height: 1;
  }

  .details-price-badge {
    margin-top: 0.5rem;
    display: inline-block;
    background: #ea580c;
    color: #ffffff;
    font-size: 0.75rem;
    font-weight: 800;
    padding: 0.25rem 0.6rem;
    border-radius: 6px;
    text-transform: uppercase;
  }

  .security-card {
    display: flex;
    align-items: flex-start;
    gap: 0.9rem;
    background: #f0fdf4;
    border: 1.5px solid #86efac;
    padding: 1.1rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
  }

  .security-icon-circle {
    background: #22c55e;
    color: #ffffff;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 10px rgba(34, 197, 94, 0.25);
  }

  .security-text-box h4 {
    font-size: 0.95rem;
    font-weight: 800;
    color: #14532d;
    margin-bottom: 0.2rem;
  }

  .security-text-box p {
    font-size: 0.8rem;
    color: #166534;
    line-height: 1.35;
  }

  .bottom-action-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 120;
    background: #ffffff;
    border-top: 1px solid #e2e8f0;
    padding: 0.85rem 1.25rem;
    box-shadow: 0 -8px 24px rgba(15, 23, 42, 0.12);
  }

  .bottom-bar-inner {
    max-width: 640px;
    margin: 0 auto;
  }

  .btn-cta-buy {
    width: 100%;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    color: #ffffff;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.65rem;
    padding: 1.15rem 1.5rem;
    border-radius: 14px;
    font-size: 1.1rem;
    font-weight: 900;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    box-shadow: 0 8px 20px -2px rgba(234, 88, 12, 0.45);
    border: none;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
  }

  .btn-cta-buy:hover {
    filter: brightness(1.05);
  }

  .btn-cta-buy:active {
    transform: scale(0.98);
  }

  /* Modal do Painel de Cadastro Rápido */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.65);
    backdrop-filter: blur(4px);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .modal-card {
    background: #ffffff;
    border-radius: 20px;
    width: 100%;
    max-width: 520px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 1.5rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
  }

  .modal-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: #0f172a;
  }

  .btn-close-modal {
    background: #f1f5f9;
    border: none;
    padding: 0.4rem;
    border-radius: 50%;
    cursor: pointer;
    color: #64748b;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-label {
    display: block;
    font-size: 0.85rem;
    font-weight: 700;
    color: #334155;
    margin-bottom: 0.4rem;
  }

  .form-input, .form-select {
    width: 100%;
    padding: 0.75rem 0.9rem;
    border: 1.5px solid #cbd5e1;
    border-radius: 10px;
    font-size: 0.95rem;
    color: #0f172a;
    outline: none;
    transition: border 0.2s;
  }

  .form-input:focus, .form-select:focus {
    border-color: #ea580c;
  }

  .form-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .btn-submit-product {
    width: 100%;
    margin-top: 1rem;
    padding: 0.9rem;
    background: #ea580c;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: background 0.2s;
  }

  .btn-submit-product:hover {
    background: #c2410c;
  }

  /* Painel Administrativo Provisório */
  .admin-temp-panel {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem 1rem;
    background-color: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #0f172a;
    box-sizing: border-box;
  }

  .admin-temp-card {
    width: 100%;
    max-width: 480px;
    background: #ffffff;
    border-radius: 20px;
    padding: 2.5rem 2rem;
    box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
    border: 1px solid #e2e8f0;
    text-align: center;
    box-sizing: border-box;
  }

  .admin-temp-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: #ecfdf5;
    color: #059669;
    margin-bottom: 1.25rem;
    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.15);
  }

  .admin-temp-title {
    font-size: 1.35rem;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 0.5rem;
  }

  .admin-temp-desc {
    font-size: 0.9rem;
    color: #64748b;
    line-height: 1.5;
    margin-bottom: 2rem;
  }

  .admin-temp-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn-admin-temp-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.85rem 1.25rem;
    border-radius: 12px;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    text-decoration: none;
  }

  .btn-admin-temp-primary {
    background: #0f172a;
    color: #ffffff;
  }

  .btn-admin-temp-primary:hover {
    background: #1e293b;
  }

  .btn-admin-temp-danger {
    background: #fef2f2;
    color: #dc2626;
    border: 1.5px solid #fecaca;
  }

  .btn-admin-temp-danger:hover {
    background: #fee2e2;
  }
`;

export default function App() {
  // Roteamento leve via hash (#admin)
  const [currentHash, setCurrentHash] = useState(() => window.location.hash);

  // Estados de Autenticação e Autorização Administrativa
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Estados da Vitrine Pública
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Estado do Modal de Cadastro (Legado / Reservado para área admin)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newProduct, setNewProduct] = useState({
    code: '',
    name: '',
    image: '',
    price: '',
    old_price: '',
    platform: 'Shopee',
    link: ''
  });

  // 1. Ouvinte de hashchange para suporte a Voltar/Avançar do navegador
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      setAuthError(null);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // 2. Validação segura e restauração de sessão de administrador
  const checkAdminAccess = async () => {
    try {
      setIsAuthLoading(true);
      setAuthError(null);

      const { isAdmin, error } = await verifyAdminStatus();

      if (error) {
        setIsAdminAuthenticated(false);
        setAuthError(error);
        return;
      }

      if (isAdmin === true) {
        setIsAdminAuthenticated(true);
        setAuthError(null);
      } else {
        // Usuário sem privilégios ou não logado
        setIsAdminAuthenticated(false);
      }
    } catch (err) {
      setIsAdminAuthenticated(false);
      setAuthError(err.message || 'Erro inesperado ao verificar autorização.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Restaura/verifica sessão administrativa ao carregar ou entrar em #admin
  useEffect(() => {
    if (currentHash === '#admin') {
      checkAdminAccess();
    }
  }, [currentHash]);

  // Listener para sincronização de estado com Supabase Auth
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setIsAdminAuthenticated(false);
        setAuthError(null);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Agenda a checagem fora do callback síncrono
        setTimeout(() => {
          if (window.location.hash === '#admin') {
            checkAdminAccess();
          }
        }, 0);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // 3. Login administrativo seguro
  const handleAdminLogin = async ({ email, password }) => {
    setIsAuthLoading(true);
    setAuthError(null);

    try {
      // Passo A: autentica credenciais com Supabase Auth
      const { user, error: loginErr } = await loginWithPassword(email, password);
      if (loginErr || !user) {
        setIsAdminAuthenticated(false);
        setAuthError(loginErr || 'E-mail ou senha incorretos.');
        setIsAuthLoading(false);
        return;
      }

      // Passo B: validação obrigatória contra RPC check_is_admin
      const { isAdmin, error: adminErr } = await verifyAdminStatus();

      if (adminErr) {
        setIsAdminAuthenticated(false);
        setAuthError(adminErr);
        // Encerra a sessão em caso de erro na autorização
        await logout();
        setIsAuthLoading(false);
        return;
      }

      if (isAdmin === true) {
        setIsAdminAuthenticated(true);
        setAuthError(null);
      } else {
        // Autenticado, porém sem permissão na tabela app_admins
        setIsAdminAuthenticated(false);
        setAuthError('Acesso não autorizado. Esta conta não possui privilégios de administrador.');
        await logout();
      }
    } catch (err) {
      setIsAdminAuthenticated(false);
      setAuthError(err.message || 'Falha ao autenticar.');
      await logout();
    } finally {
      setIsAuthLoading(false);
    }
  };

  // 4. Logout administrativo
  const handleAdminLogout = async () => {
    try {
      setIsAuthLoading(true);
      await logout();
      setIsAdminAuthenticated(false);
      setAuthError(null);
    } catch (err) {
      console.error('Erro ao sair:', err);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Navegar de volta à vitrine pública
  const handleGoToStore = () => {
    window.location.hash = '';
    setCurrentHash('');
    setAuthError(null);
  };

  // 5. Carregar produtos ativos do Supabase (is_active = true explícito)
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('code', { ascending: true });

      if (error) {
        console.error('Erro ao buscar do Supabase:', error);
        setErrorMessage('Não foi possível carregar os produtos no momento.');
      } else if (data) {
        const formatted = data.map((item) => ({
          ...item,
          oldPrice: item.old_price || item.oldPrice
        }));
        setProductsList(formatted);
      }
    } catch (err) {
      console.error('Erro de conexão:', err);
      setErrorMessage('Falha na comunicação com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Realtime Subscription com filtro explícito is_active = true
    const channel = supabase
      .channel('public:products:active')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 6. Cadastrar novo produto (código legado preservado para futura tela de admin)
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.code || !newProduct.name || !newProduct.price || !newProduct.link) {
      alert('Por favor, preencha todos os campos obrigatórios (Código, Nome, Preço e Link)!');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('products').insert([
        {
          code: newProduct.code.trim(),
          name: newProduct.name.trim(),
          image: newProduct.image.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
          price: newProduct.price.trim(),
          old_price: newProduct.old_price.trim() || null,
          platform: newProduct.platform,
          link: newProduct.link.trim(),
          rating: 4.9,
          reviews: 150,
          is_active: false // Rascunho por padrão
        }
      ]);

      if (error) {
        alert('Erro ao salvar produto: ' + error.message);
      } else {
        setIsModalOpen(false);
        setNewProduct({
          code: '',
          name: '',
          image: '',
          price: '',
          old_price: '',
          platform: 'Shopee',
          link: ''
        });
        await fetchProducts();
      }
    } catch (err) {
      alert('Erro inesperado: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const cleanSearch = searchTerm.trim().toLowerCase();

  const filteredProducts = productsList.filter((item) => {
    if (!cleanSearch) return true;
    const matchCode = item.code?.toLowerCase().includes(cleanSearch);
    const matchName = item.name?.toLowerCase().includes(cleanSearch);
    return matchCode || matchName;
  });

  // Renderização Condicional da Rota Administrativa (#admin)
  if (currentHash === '#admin') {
    if (isAdminAuthenticated) {
      return (
        <div className="admin-temp-panel">
          <style>{cssStyles}</style>
          <div className="admin-temp-card">
            <div className="admin-temp-icon">
              <ShieldCheck size={28} strokeWidth={2.4} />
            </div>
            <h1 className="admin-temp-title">Acesso Administrativo Autorizado</h1>
            <p className="admin-temp-desc">
              Você está autenticado e confirmado como administrador da Vitrine Oficial.
            </p>
            <div className="admin-temp-actions">
              <button
                type="button"
                className="btn-admin-temp-action btn-admin-temp-primary"
                onClick={handleGoToStore}
              >
                <ShoppingBag size={18} />
                <span>Voltar à vitrine</span>
              </button>
              <button
                type="button"
                className="btn-admin-temp-action btn-admin-temp-danger"
                onClick={handleAdminLogout}
                disabled={isAuthLoading}
              >
                <LogOut size={18} />
                <span>{isAuthLoading ? 'Saindo...' : 'Sair da conta'}</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <AdminLogin
        onSubmit={handleAdminLogin}
        onBackToStore={handleGoToStore}
        isLoading={isAuthLoading}
        errorMessage={authError}
      />
    );
  }

  return (
    <div className="vitrine-app">
      <style>{cssStyles}</style>

      {/* HEADER FIXO */}
      <header className="header-fixed">
        <div className="header-inner">
          <div className="header-brand">
            <div className="brand-title-wrap" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="brand-icon-pill">
                <ShoppingBag size={20} strokeWidth={2.5} />
              </div>
              <h1 className="header-title">Vitrine Oficial</h1>
            </div>

            <div className="header-actions">
              <div className="verified-badge">
                <ShieldCheck size={14} strokeWidth={2.5} />
                <span>Verificados</span>
              </div>
            </div>
          </div>

          {/* BARRA DE BUSCA EM TEMPO REAL */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Digite o código (ex: 001) ou o nome do produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              autoComplete="off"
            />
            <Search className="search-icon-svg" size={20} strokeWidth={2.2} />
          </div>
        </div>
      </header>

      {/* CATÁLOGO DE PRODUTOS */}
      <main className="main-content">
        <div className="filter-bar">
          <p className="filter-summary">
            Mostrando <span className="filter-count">{filteredProducts.length}</span> produtos
            {cleanSearch && <span> para "{searchTerm}"</span>}
          </p>
          {cleanSearch && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                background: 'none',
                border: 'none',
                color: '#ea580c',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Limpar busca
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 0', color: '#ea580c' }}>
            <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto', animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '0.85rem', color: '#64748b', fontWeight: '600' }}>Carregando vitrine em tempo real...</p>
          </div>
        ) : errorMessage ? (
          <div className="empty-state">
            <div className="state-icon-wrap state-icon-error">
              <AlertCircle size={28} strokeWidth={2.2} />
            </div>
            <h3 className="empty-title">Instabilidade na conexão</h3>
            <p className="empty-desc">
              {errorMessage} Por favor, verifique sua conexão ou tente novamente.
            </p>
            <button
              className="btn-retry"
              onClick={() => fetchProducts()}
            >
              <RefreshCw size={15} strokeWidth={2.2} />
              <span>Tentar novamente</span>
            </button>
          </div>
        ) : productsList.length === 0 ? (
          <div className="empty-state">
            <div className="state-icon-wrap state-icon-empty">
              <PackageOpen size={28} strokeWidth={2.2} />
            </div>
            <h3 className="empty-title">Nenhum produto cadastrado</h3>
            <p className="empty-desc">
              Novas ofertas e códigos serão publicados em breve nesta vitrine.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <h3 className="empty-title">Nenhum produto encontrado</h3>
            <p className="empty-desc">
              Não encontramos nenhum produto com o código ou nome "{searchTerm}".
            </p>
            <button
              className="btn-reset-search"
              onClick={() => setSearchTerm('')}
            >
              Ver todos os produtos
            </button>
          </div>
        ) : (
          <div className="catalog-grid">
            {filteredProducts.map((product) => (
              <article
                key={product.id || product.code}
                className="product-card"
                onClick={() => {
                  setSelectedProduct(product);
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
              >
                <div className="card-media">
                  <div className="code-badge">
                    <span>CÓD: {product.code}</span>
                  </div>

                  <span
                    className={`platform-tag ${
                      product.platform === 'Shopee'
                        ? 'platform-shopee'
                        : 'platform-mercadolivre'
                    }`}
                  >
                    {product.platform}
                  </span>

                  <img
                    src={product.image}
                    alt={product.name}
                    className="card-img"
                    loading="lazy"
                  />
                </div>

                <div className="card-body">
                  <div className="card-rating-row">
                    <span className="star-badge">
                      <Star size={14} fill="#eab308" color="#eab308" />
                      {product.rating || 4.8}
                    </span>
                    <span>•</span>
                    <span>({product.reviews || 120} avaliações)</span>
                  </div>

                  <h2 className="card-title" title={product.name}>
                    {product.name}
                  </h2>

                  <div className="card-pricing">
                    {product.oldPrice && (
                      <div className="card-old-price">R$ {product.oldPrice}</div>
                    )}
                    <div className="card-price-row">
                      <span className="price-currency">R$</span>
                      <span className="price-value">{product.price}</span>
                    </div>
                  </div>

                  <button className="btn-view-details">
                    <span>Ver detalhes</span>
                    <ExternalLink size={15} strokeWidth={2.2} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* MODAL DE CADASTRO RÁPIDO (+ PRODUTO) */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Cadastrar Novo Produto</h3>
              <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Código (Ex: 007) *</label>
                  <input
                    type="text"
                    required
                    placeholder="007"
                    className="form-input"
                    value={newProduct.code}
                    onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Plataforma *</label>
                  <select
                    className="form-select"
                    value={newProduct.platform}
                    onChange={(e) => setNewProduct({ ...newProduct, platform: e.target.value })}
                  >
                    <option value="Shopee">Shopee</option>
                    <option value="Mercado Livre">Mercado Livre</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nome Completo do Produto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Luminária de Mesa Articulada LED"
                  className="form-input"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Preço Atual (R$) *</label>
                  <input
                    type="text"
                    required
                    placeholder="79,90"
                    className="form-input"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Preço Antigo / Riscado</label>
                  <input
                    type="text"
                    placeholder="120,00"
                    className="form-input"
                    value={newProduct.old_price}
                    onChange={(e) => setNewProduct({ ...newProduct, old_price: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Link da Imagem (URL)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  className="form-input"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Seu Link de Afiliado *</label>
                <input
                  type="url"
                  required
                  placeholder="https://shope.ee/... ou https://mercadolivre.com/..."
                  className="form-input"
                  value={newProduct.link}
                  onChange={(e) => setNewProduct({ ...newProduct, link: e.target.value })}
                />
              </div>

              <button type="submit" disabled={saving} className="btn-submit-product">
                {saving ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Cadastrar na Vitrine</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TELA DE DETALHES EM TELA CHEIA */}
      {selectedProduct && (
        <div className="details-overlay">
          <header className="details-nav">
            <button
              className="btn-back-nav"
              onClick={() => setSelectedProduct(null)}
              aria-label="Voltar para a vitrine"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
              <span>Voltar</span>
            </button>
            <span className="nav-center-info">
              CÓD: {selectedProduct.code}
            </span>
            <div style={{ width: 80 }} />
          </header>

          <div className="details-body">
            <div className="details-media-container">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="details-img"
              />
              <div className="details-code-badge">
                CÓD: {selectedProduct.code}
              </div>
            </div>

            <div className="details-info-section">
              <div className="details-platform-row">
                <span
                  className={`platform-pill-badge ${
                    selectedProduct.platform === 'Shopee'
                      ? 'platform-shopee'
                      : 'platform-mercadolivre'
                  }`}
                >
                  {selectedProduct.platform}
                </span>

                <div className="verified-badge">
                  <ShieldCheck size={14} strokeWidth={2.5} />
                  <span>Produto Verificado</span>
                </div>
              </div>

              <h2 className="details-title">{selectedProduct.name}</h2>

              <div className="details-reviews-row">
                <div className="stars-group">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={17}
                      fill={i < Math.floor(selectedProduct.rating || 4.8) ? '#f59e0b' : 'none'}
                      color="#f59e0b"
                      strokeWidth={2}
                    />
                  ))}
                </div>
                <span className="rating-score">{selectedProduct.rating || 4.8}</span>
                <span className="reviews-count">
                  ({selectedProduct.reviews || 120} clientes satisfeitos)
                </span>
              </div>

              <div className="details-pricing-card">
                {selectedProduct.oldPrice && (
                  <div className="details-old-price-line">
                    De: R$ {selectedProduct.oldPrice}
                  </div>
                )}
                <div className="details-main-price">
                  <span className="curr">R$</span>
                  <span className="amount">{selectedProduct.price}</span>
                </div>
                <span className="details-price-badge">
                  OFERTA ESPECIAL POR TEMPO LIMITADO
                </span>
              </div>

              <div className="security-card">
                <div className="security-icon-circle">
                  <ShieldCheck size={22} strokeWidth={2.5} />
                </div>
                <div className="security-text-box">
                  <h4>Compra 100% segura via {selectedProduct.platform}</h4>
                  <p>
                    Transação protegida pela garantia oficial da plataforma com
                    direito a reembolso integral e entrega monitorada.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* BARRA FIXA INFERIOR (BOTTOM BAR) */}
          <aside className="bottom-action-bar">
            <div className="bottom-bar-inner">
              <a
                href={selectedProduct.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta-buy"
              >
                <ShoppingBag size={22} strokeWidth={2.5} />
                <span>COMPRAR NO APLICATIVO</span>
                <ExternalLink size={18} strokeWidth={2.5} />
              </a>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
