import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

const galleryStyles = `
  /* ============================================================
     GALERIA DINÂMICA DE PRODUTOS — COMPONENTE RESPONSIVO
     ============================================================ */
  .product-gallery-wrapper {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border-bottom: 1px solid #f1f5f9;
    user-select: none;
  }

  /* Viewport principal da imagem */
  .gallery-main-viewport {
    position: relative;
    width: 100%;
    max-height: min(60vh, 480px);
    aspect-ratio: 1 / 1;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  /* Trilho do carrossel (CSS Scroll Snap nativo) */
  .gallery-carousel-track {
    width: 100%;
    height: 100%;
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Firefox */
  }

  .gallery-carousel-track::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }

  /* Cada slide ocupa 100% da largura do contêiner */
  .gallery-slide {
    flex: 0 0 100%;
    width: 100%;
    height: 100%;
    scroll-snap-align: center;
    scroll-snap-stop: always;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
  }

  /* Imagem preservando 100% da silhueta (object-fit: contain) */
  .gallery-slide-img {
    width: 100%;
    height: 100%;
    max-height: min(60vh, 480px);
    object-fit: contain;
    object-position: center;
    padding: 0.75rem;
    display: block;
    pointer-events: none;
  }

  /* Fallback gracioso para URLs quebradas */
  .gallery-fallback-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    height: 100%;
    padding: 2rem;
    color: #94a3b8;
    background-color: #f8fafc;
    text-align: center;
  }

  .gallery-fallback-text {
    font-size: 0.82rem;
    font-weight: 600;
    color: #64748b;
  }

  /* Badge de código fixado no canto inferior esquerdo */
  .gallery-code-badge {
    position: absolute;
    bottom: 16px;
    left: 16px;
    background: #0f172a;
    color: #ffffff;
    font-family: var(--font-mono, 'JetBrains Mono', monospace);
    font-size: 0.82rem;
    font-weight: 600;
    text-transform: uppercase;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.05em;
    padding: 0.45rem 0.85rem;
    border-radius: 8px;
    border: 1.5px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
    z-index: 10;
    pointer-events: none;
  }

  /* Contador discreto no canto superior direito */
  .gallery-counter-badge {
    position: absolute;
    top: 14px;
    right: 14px;
    background: rgba(15, 23, 42, 0.75);
    backdrop-filter: blur(4px);
    color: #ffffff;
    font-family: var(--font-mono, 'JetBrains Mono', monospace);
    font-size: 0.75rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    letter-spacing: 0.03em;
    z-index: 10;
    pointer-events: none;
  }

  /* Botões de navegação lateral (Desktop / Tablet) */
  .gallery-nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid #e2e8f0;
    color: #0f172a;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
    z-index: 10;
    transition: all 0.15s ease;
  }

  .gallery-nav-btn:hover:not(:disabled) {
    background: #ffffff;
    color: #ea580c;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
    transform: translateY(-50%) scale(1.06);
  }

  .gallery-nav-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    pointer-events: none;
  }

  .gallery-nav-prev {
    left: 12px;
  }

  .gallery-nav-next {
    right: 12px;
  }

  /* Indicadores de paginação por bolinhas (mobile / tablet) */
  .gallery-dots-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    padding: 0.65rem 1rem 0.4rem;
  }

  .gallery-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #cbd5e1;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .gallery-dot-active {
    background: #ea580c;
    width: 22px;
    border-radius: 9999px;
  }

  /* Faixa de miniaturas (thumbnails) */
  .gallery-thumbnails-strip {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.65rem 1rem 0.85rem;
    overflow-x: auto;
    scrollbar-width: thin;
    max-width: 100%;
    box-sizing: border-box;
  }

  .gallery-thumbnail-item {
    flex: 0 0 64px;
    width: 64px;
    height: 64px;
    border-radius: 8px;
    border: 1.5px solid #e2e8f0;
    background: #ffffff;
    padding: 3px;
    cursor: pointer;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    box-sizing: border-box;
  }

  .gallery-thumbnail-item:hover:not(.thumbnail-active) {
    border-color: #cbd5e1;
    background: #f8fafc;
  }

  .gallery-thumbnail-item.thumbnail-active {
    border-color: #ea580c;
    box-shadow: 0 0 0 2px rgba(234, 88, 12, 0.25);
  }

  .gallery-thumbnail-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
    pointer-events: none;
  }

  .thumbnail-fallback {
    color: #94a3b8;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Otimizações responsivas */
  @media (max-width: 640px) {
    .gallery-nav-btn {
      display: none; /* No smartphone, o gesto de deslizar (swipe) tem prioridade */
    }

    .gallery-thumbnail-item {
      flex: 0 0 54px;
      width: 54px;
      height: 54px;
    }
  }
`;

/**
 * Componente ProductGallery
 *
 * @param {string} mainImage - URL da imagem principal (obrigatória)
 * @param {string[]|null} images - Array de URLs adicionais (opcional)
 * @param {string} productName - Nome do produto (para textos alternativos acessíveis)
 * @param {string} productCode - Código público de identificação do produto
 */
export default function ProductGallery({
  mainImage,
  images = [],
  productName = 'Produto',
  productCode = ''
}) {
  // Constrói a lista segura de imagens com a imagem principal sempre na posição 0
  const galleryImages = [
    mainImage,
    ...(Array.isArray(images) ? images : [])
  ].filter((url) => typeof url === 'string' && url.trim().length > 0);

  const hasMultiple = galleryImages.length > 1;

  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState({});

  const trackRef = useRef(null);
  const isProgrammaticScrollRef = useRef(false);

  // Reinicia a galeria ao abrir ou alternar de produto
  useEffect(() => {
    setActiveIndex(0);
    setFailedImages({});
    if (trackRef.current) {
      trackRef.current.scrollTo({ left: 0, behavior: 'instant' });
    }
  }, [productCode, mainImage]);

  // Rola suavemente até o slide de índice indicado
  const scrollToIndex = (index) => {
    if (index < 0 || index >= galleryImages.length) return;
    setActiveIndex(index);

    const track = trackRef.current;
    if (track) {
      isProgrammaticScrollRef.current = true;
      track.scrollTo({
        left: index * track.clientWidth,
        behavior: 'smooth'
      });

      // Libera a trava após o término do scroll suave
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 350);
    }
  };

  // Listener para sincronizar o índice quando o usuário desliza com o dedo (touch swipe)
  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || isProgrammaticScrollRef.current) return;

    const slideWidth = track.clientWidth;
    if (slideWidth > 0) {
      const newIndex = Math.round(track.scrollLeft / slideWidth);
      if (newIndex >= 0 && newIndex < galleryImages.length && newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    scrollToIndex(activeIndex - 1);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    scrollToIndex(activeIndex + 1);
  };

  // Navegação acessível por teclado na galeria
  const handleKeyDown = (e) => {
    if (!hasMultiple) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollToIndex(activeIndex - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollToIndex(activeIndex + 1);
    }
  };

  const handleImageError = (index) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div
      className="product-gallery-wrapper"
      onKeyDown={handleKeyDown}
      tabIndex={hasMultiple ? 0 : -1}
      aria-label={`Galeria de fotos do produto ${productName}`}
    >
      <style>{galleryStyles}</style>

      {/* VIEWPORT PRINCIPAL COM TRILHO NATIVO DE SCROLL SNAP */}
      <div className="gallery-main-viewport">
        <div
          className="gallery-carousel-track"
          ref={trackRef}
          onScroll={handleScroll}
        >
          {galleryImages.map((imgUrl, index) => (
            <div
              key={index}
              className="gallery-slide"
              aria-hidden={activeIndex !== index}
            >
              {failedImages[index] ? (
                <div className="gallery-fallback-box" role="status">
                  <ImageOff size={32} strokeWidth={1.8} aria-hidden="true" />
                  <span className="gallery-fallback-text">Imagem indisponível</span>
                </div>
              ) : (
                <img
                  src={imgUrl}
                  alt={`${productName} — Imagem ${index + 1} de ${galleryImages.length}`}
                  className="gallery-slide-img"
                  onError={() => handleImageError(index)}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              )}
            </div>
          ))}
        </div>

        {/* BADGE DE CÓDIGO (FIXO NO CANTO INFERIOR) */}
        {productCode && (
          <div className="gallery-code-badge">
            CÓD: {productCode}
          </div>
        )}

        {/* CONTADOR DISCRETO (QUANDO HÁ MÚLTIPLAS IMAGENS) */}
        {hasMultiple && (
          <div
            className="gallery-counter-badge"
            aria-live="polite"
            aria-atomic="true"
          >
            {activeIndex + 1} / {galleryImages.length}
          </div>
        )}

        {/* BOTÕES DE NAVEGAÇÃO LATERAL (DESKTOP / TABLET) */}
        {hasMultiple && (
          <>
            <button
              type="button"
              className="gallery-nav-btn gallery-nav-prev"
              onClick={handlePrev}
              disabled={activeIndex === 0}
              aria-label="Visualizar imagem anterior"
            >
              <ChevronLeft size={20} strokeWidth={2.5} aria-hidden="true" />
            </button>

            <button
              type="button"
              className="gallery-nav-btn gallery-nav-next"
              onClick={handleNext}
              disabled={activeIndex === galleryImages.length - 1}
              aria-label="Visualizar próxima imagem"
            >
              <ChevronRight size={20} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {/* INDICADORES EM BOLINHAS (EXIBIDOS PARA ATÉ 6 IMAGENS) */}
      {hasMultiple && galleryImages.length <= 6 && (
        <div className="gallery-dots-row" role="tablist" aria-label="Indicadores de fotos">
          {galleryImages.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              className={`gallery-dot ${activeIndex === index ? 'gallery-dot-active' : ''}`}
              onClick={() => scrollToIndex(index)}
              aria-label={`Ir para a imagem ${index + 1} de ${galleryImages.length}`}
              aria-selected={activeIndex === index}
            />
          ))}
        </div>
      )}

      {/* FAIXA DE MINIATURAS (THUMBNAILS CLICÁVEIS) */}
      {hasMultiple && (
        <div
          className="gallery-thumbnails-strip"
          role="tablist"
          aria-label="Miniaturas da galeria"
        >
          {galleryImages.map((imgUrl, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              className={`gallery-thumbnail-item ${activeIndex === index ? 'thumbnail-active' : ''}`}
              onClick={() => scrollToIndex(index)}
              aria-selected={activeIndex === index}
              aria-label={`Visualizar imagem ${index + 1} de ${galleryImages.length}`}
            >
              {failedImages[index] ? (
                <div className="thumbnail-fallback">
                  <ImageOff size={14} aria-hidden="true" />
                </div>
              ) : (
                <img
                  src={imgUrl}
                  alt=""
                  className="gallery-thumbnail-img"
                  loading="lazy"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
