import React, { useState } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Star,
  Search
} from 'lucide-react';
import { initialProducts } from './data/products';

const products = initialProducts;

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

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 3.5rem 1.5rem;
    background: #ffffff;
    border-radius: 16px;
    border: 1px dashed #cbd5e1;
    max-width: 480px;
    margin: 2rem auto;
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
    padding-bottom: 130px; /* espaço para o botão fixo inferior */
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

  /* Bloco de Preço Detalhado */
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

  /* Caixa de Garantia Visual */
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

  /* Barra Fixa Inferior (Bottom Bar) */
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
    box-shadow: 0 10px 24px -2px rgba(234, 88, 12, 0.55);
  }

  .btn-cta-buy:active {
    transform: scale(0.98);
    filter: brightness(0.95);
  }

  .btn-cta-buy svg {
    flex-shrink: 0;
  }
`;

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const cleanSearch = searchTerm.trim().toLowerCase();

  const filteredProducts = products.filter((item) => {
    if (!cleanSearch) return true;
    const matchCode = item.code.toLowerCase().includes(cleanSearch);
    const matchName = item.name.toLowerCase().includes(cleanSearch);
    return matchCode || matchName;
  });

  return (
    <div className="vitrine-app">
      <style>{cssStyles}</style>

      {/* HEADER FIXO */}
      <header className="header-fixed">
        <div className="header-inner">
          <div className="header-brand">
            <div className="brand-title-wrap">
              <div className="brand-icon-pill">
                <ShoppingBag size={20} strokeWidth={2.5} />
              </div>
              <h1 className="header-title">Vitrine Oficial</h1>
            </div>
            <div className="verified-badge">
              <ShieldCheck size={14} strokeWidth={2.5} />
              <span>Itens Verificados</span>
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

        {filteredProducts.length === 0 ? (
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
                key={product.id}
                className="product-card"
                onClick={() => {
                  setSelectedProduct(product);
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
              >
                <div className="card-media">
                  {/* Badge de alto contraste no canto superior esquerdo */}
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
                      {product.rating}
                    </span>
                    <span>•</span>
                    <span>({product.reviews} avaliações)</span>
                  </div>

                  <h2 className="card-title" title={product.name}>
                    {product.name}
                  </h2>

                  <div className="card-pricing">
                    <div className="card-old-price">R$ {product.oldPrice}</div>
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

      {/* TELA DE DETALHES EM TELA CHEIA (MODAL / OVERLAY) */}
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
            <div style={{ width: 80 }} /> {/* Balanço do header */}
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

              {/* Avaliação por estrelas */}
              <div className="details-reviews-row">
                <div className="stars-group">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={17}
                      fill={i < Math.floor(selectedProduct.rating) ? '#f59e0b' : 'none'}
                      color="#f59e0b"
                      strokeWidth={2}
                    />
                  ))}
                </div>
                <span className="rating-score">{selectedProduct.rating}</span>
                <span className="reviews-count">
                  ({selectedProduct.reviews} clientes satisfeitos)
                </span>
              </div>

              {/* Preço riscado e preço atual em destaque */}
              <div className="details-pricing-card">
                <div className="details-old-price-line">
                  De: R$ {selectedProduct.oldPrice}
                </div>
                <div className="details-main-price">
                  <span className="curr">R$</span>
                  <span className="amount">{selectedProduct.price}</span>
                </div>
                <span className="details-price-badge">
                  OFERTA ESPECIAL POR TEMPO LIMITADO
                </span>
              </div>

              {/* Caixa de garantia visual */}
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
