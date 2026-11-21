import React from 'react';
import { ShoppingBag, ArrowUp, Sparkles } from 'lucide-react';
import { ALL_CATEGORIES_FILTER, SUPPORTED_CATEGORIES, DEFAULT_CATEGORY } from '../lib/categories.js';

const footerStyles = `
  /* ============================================================
     RODAPÉ INSTITUCIONAL (FOOTER RESPONSIVO)
     ============================================================ */
  .institutional-footer {
    background-color: #0f172a;
    color: #94a3b8;
    border-top: 1px solid #1e293b;
    width: 100%;
    margin-top: auto;
    font-family: var(--font-sans, 'Plus Jakarta Sans', system-ui, sans-serif);
    box-sizing: border-box;
  }

  .footer-inner {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 3.5rem 1.5rem 2rem;
    box-sizing: border-box;
  }

  .footer-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2.25rem;
    margin-bottom: 2.75rem;
  }

  @media (min-width: 640px) {
    .footer-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 2.25rem;
    }
  }

  @media (min-width: 960px) {
    .footer-grid {
      grid-template-columns: 1.2fr 1fr 0.9fr 1.35fr;
      column-gap: 2.75rem;
      row-gap: 2rem;
    }
  }

  .footer-col {
    min-width: 0;
  }

  .footer-brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.95rem;
  }

  .footer-brand-icon {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    color: #ffffff;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(234, 88, 12, 0.35);
  }

  .footer-brand-name {
    font-size: 1.15rem;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.02em;
  }

  .footer-text {
    font-size: 0.82rem;
    line-height: 1.6;
    color: #94a3b8;
    margin-bottom: 0.85rem;
  }

  .footer-badge-curation {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #e2e8f0;
    font-size: 0.72rem;
    font-weight: 600;
    padding: 0.3rem 0.65rem;
    border-radius: 9999px;
  }

  .footer-col-title {
    font-size: 0.85rem;
    font-weight: 800;
    color: #ffffff;
    margin-bottom: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .footer-links-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  .footer-link-btn {
    background: none;
    border: none;
    padding: 0;
    font-family: inherit;
    font-size: 0.82rem;
    color: #94a3b8;
    cursor: pointer;
    text-align: left;
    transition: color 0.15s ease, transform 0.15s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    text-decoration: none;
  }

  .footer-link-btn:hover {
    color: #ea580c;
    transform: translateX(2px);
  }

  .footer-link-btn:focus-visible {
    outline: 2px solid #ea580c;
    outline-offset: 2px;
    border-radius: 4px;
  }

  .footer-transparency-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 1rem 1.15rem;
  }

  .footer-transparency-item {
    font-size: 0.78rem;
    line-height: 1.55;
    color: #94a3b8;
    margin-bottom: 0.65rem;
  }

  .footer-transparency-item:last-child {
    margin-bottom: 0;
  }

  .footer-transparency-item strong {
    color: #e2e8f0;
  }

  .footer-bottom {
    border-top: 1px solid #1e293b;
    padding-top: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    font-size: 0.76rem;
    color: #64748b;
    text-align: center;
  }

  @media (min-width: 768px) {
    .footer-bottom {
      flex-direction: row;
      text-align: left;
    }
  }

  .footer-scroll-top-btn {
    background: #1e293b;
    color: #cbd5e1;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 0.45rem 0.85rem;
    font-size: 0.76rem;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    transition: all 0.15s ease;
  }

  .footer-scroll-top-btn:hover {
    background: #334155;
    color: #ffffff;
    border-color: #475569;
  }
`;

/**
 * Componente Footer Institucional Responsivo
 *
 * @param {function} onSelectCategory - Ação ao clicar em uma categoria (abre catálogo com filtro)
 * @param {function} onGoHome - Ação ao clicar no início (abre catálogo geral)
 */
export default function Footer({ onSelectCategory, onGoHome }) {
  const handleScrollToTop = () => {
    const overlay = document.querySelector('.details-overlay');
    if (overlay) {
      overlay.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Categorias funcionais oficiais para o rodapé
  const footerCategories = [
    ALL_CATEGORIES_FILTER,
    ...SUPPORTED_CATEGORIES.filter((c) => c !== DEFAULT_CATEGORY),
    DEFAULT_CATEGORY
  ];

  return (
    <footer className="institutional-footer" aria-label="Rodapé institucional">
      <style>{footerStyles}</style>

      <div className="footer-inner">
        <div className="footer-grid">
          {/* COLUNA 1: APRESENTAÇÃO DA PLATAFORMA */}
          <div className="footer-col">
            <div className="footer-brand">
              <div className="footer-brand-icon" aria-hidden="true">
                <ShoppingBag size={18} strokeWidth={2.5} />
              </div>
              <span className="footer-brand-name">Vitrine Oficial</span>
            </div>
            <p className="footer-text">
              Plataforma independente de curadoria e divulgação de ofertas selecionadas dos principais marketplaces.
            </p>
            <p className="footer-text">
              Pesquise pelo código exclusivo do produto para encontrar rapidamente a oferta correta na loja de destino.
            </p>
            <div className="footer-badge-curation">
              <Sparkles size={12} aria-hidden="true" />
              <span>Curadoria diária de ofertas</span>
            </div>
          </div>

          {/* COLUNA 2: CATEGORIAS FUNCIONAIS DO PROJETO */}
          <div className="footer-col">
            <h4 className="footer-col-title">Categorias</h4>
            <ul className="footer-links-list">
              {footerCategories.slice(0, 7).map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    className="footer-link-btn"
                    onClick={() => onSelectCategory && onSelectCategory(cat)}
                  >
                    {cat === ALL_CATEGORIES_FILTER ? 'Todas as ofertas' : cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUNA 3: INSTITUCIONAL / ACESSO RÁPIDO (APENAS PÁGINAS/ROTAS REAIS) */}
          <div className="footer-col">
            <h4 className="footer-col-title">Acesso</h4>
            <ul className="footer-links-list">
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => onGoHome && onGoHome()}
                >
                  Catálogo de Ofertas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => onSelectCategory && onSelectCategory(ALL_CATEGORIES_FILTER)}
                >
                  Todas as Ofertas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={handleScrollToTop}
                >
                  <ArrowUp size={12} aria-hidden="true" />
                  <span>Voltar ao topo</span>
                </button>
              </li>
            </ul>
          </div>

          {/* COLUNA 4: TRANSPARÊNCIA E ISENÇÃO DE RESPONSABILIDADE */}
          <div className="footer-col">
            <h4 className="footer-col-title">Transparência</h4>
            <div className="footer-transparency-card">
              <p className="footer-transparency-item">
                <strong>Divulgação de ofertas:</strong> A Vitrine Oficial não realiza venda direta nem processa pagamentos. O visitante conclui a compra diretamente no marketplace parceiro.
              </p>
              <p className="footer-transparency-item">
                <strong>Preços e disponibilidade:</strong> Valores e estoques são de responsabilidade das lojas oficiais e podem mudar a qualquer momento.
              </p>
              <p className="footer-transparency-item">
                <strong>Programa de afiliados:</strong> Podemos receber comissão por compras qualificadas através dos links indicados, sem custo adicional para o comprador.
              </p>
            </div>
          </div>
        </div>

        {/* FAIXA INFERIOR DE DIREITOS E CRÉDITOS */}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Vitrine Oficial. Todos os direitos reservados.
          </p>
          <button
            type="button"
            className="footer-scroll-top-btn"
            onClick={handleScrollToTop}
            aria-label="Rolar até o topo da página"
          >
            <ArrowUp size={14} aria-hidden="true" />
            <span>Voltar ao topo</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
