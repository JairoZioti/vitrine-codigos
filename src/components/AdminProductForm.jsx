import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  PackagePlus,
  Pencil,
  Info
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SUPPORTED_MARKETPLACES, detectMarketplaceFromUrl } from '../lib/marketplace';
import { generateProductCode, isProductCodeUniqueViolation } from '../lib/productCode';
import { SUPPORTED_CATEGORIES } from '../lib/categories';

const MAX_CODE_ATTEMPTS = 5;

const formModalStyles = `
  .admin-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    box-sizing: border-box;
  }

  .admin-modal-card {
    background: #ffffff;
    border-radius: 20px;
    width: 100%;
    max-width: 540px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 1.75rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    box-sizing: border-box;
    border: 1px solid #e2e8f0;
  }

  .admin-modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f1f5f9;
  }

  .admin-modal-title-wrap {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .admin-modal-icon-badge {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #fff7ed;
    color: #ea580c;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .admin-modal-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
    line-height: 1.2;
  }

  .admin-modal-subtitle {
    font-size: 0.8rem;
    color: #64748b;
    margin-top: 0.2rem;
  }

  .btn-close-modal {
    background: #f1f5f9;
    border: none;
    padding: 0.45rem;
    border-radius: 50%;
    cursor: pointer;
    color: #64748b;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
  }

  .btn-close-modal:hover {
    background: #e2e8f0;
    color: #0f172a;
  }

  .admin-form-group {
    margin-bottom: 1.15rem;
  }

  .admin-form-label {
    display: block;
    font-size: 0.85rem;
    font-weight: 700;
    color: #334155;
    margin-bottom: 0.4rem;
  }

  .admin-form-label .required-star {
    color: #ef4444;
    margin-left: 0.15rem;
  }

  .admin-form-input, .admin-form-select {
    width: 100%;
    padding: 0.75rem 0.9rem;
    border: 1.5px solid #cbd5e1;
    border-radius: 10px;
    font-size: 0.95rem;
    color: #0f172a;
    background: #ffffff;
    outline: none;
    transition: all 0.15s ease;
    box-sizing: border-box;
  }

  .admin-form-input:focus, .admin-form-select:focus {
    border-color: #ea580c;
    box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.12);
  }

  .admin-form-input:disabled, .admin-form-select:disabled {
    background: #f8fafc;
    color: #94a3b8;
    cursor: not-allowed;
  }

  .admin-form-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.85rem;
  }

  @media (max-width: 500px) {
    .admin-form-grid-2 {
      grid-template-columns: 1fr;
    }
  }

  .admin-form-note {
    font-size: 0.75rem;
    color: #64748b;
    margin-top: 0.35rem;
    line-height: 1.35;
  }

  .admin-form-alert {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    padding: 0.85rem 1rem;
    border-radius: 10px;
    font-size: 0.85rem;
    margin-bottom: 1.25rem;
    line-height: 1.4;
  }

  .admin-alert-error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #991b1b;
  }

  .admin-alert-success {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    color: #065f46;
  }

  .admin-modal-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #f1f5f9;
  }

  .btn-modal-cancel {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    color: #475569;
    padding: 0.75rem 1.25rem;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .btn-modal-cancel:hover:not(:disabled) {
    background: #f8fafc;
    color: #0f172a;
    border-color: #94a3b8;
  }

  .btn-modal-submit {
    background: #ea580c;
    border: none;
    color: #ffffff;
    padding: 0.75rem 1.4rem;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 800;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    transition: all 0.15s ease;
    box-shadow: 0 2px 6px rgba(234, 88, 12, 0.2);
  }

  .btn-modal-submit:hover:not(:disabled) {
    background: #c2410c;
  }

  .btn-modal-submit:disabled {
    background: #fdba74;
    cursor: not-allowed;
    box-shadow: none;
  }

  /* Feedback discreto da identificação automática de marketplace pelo link */
  .admin-link-feedback {
    margin-top: 0.45rem;
    padding: 0.5rem 0.7rem;
    border-radius: 8px;
    font-size: 0.78rem;
    line-height: 1.4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .admin-link-feedback-text {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }

  .admin-link-feedback-detected {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    color: #065f46;
  }

  .admin-link-feedback-hint {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    color: #475569;
  }

  .admin-link-feedback-suggestion {
    background: #fffbeb;
    border: 1px solid #fde68a;
    color: #92400e;
  }

  .btn-apply-platform {
    background: #ffffff;
    border: 1px solid #d97706;
    color: #b45309;
    padding: 0.25rem 0.6rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
  }

  .btn-apply-platform:hover:not(:disabled) {
    background: #fef3c7;
    color: #78350f;
  }

  .btn-apply-platform:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .admin-form-input-readonly {
    background: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
    letter-spacing: 0.06em;
    cursor: default;
  }

  .admin-form-input-readonly:focus {
    background: #f1f5f9;
    border-color: #cbd5e1;
    box-shadow: none;
  }
`;

/**
 * Validador rigoroso de URLs HTTP ou HTTPS
 * @param {string} urlString
 * @returns {boolean}
 */
function isValidHttpUrl(urlString) {
  try {
    const url = new URL(urlString.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validador e normalizador de preço no formato brasileiro (ex: "79,90")
 * Aceita "79,90", "79.90", "1.299,00", "1299,00", etc.
 * @param {string} raw
 * @returns {{ valid: boolean, formatted: string }}
 */
function formatAndValidatePrice(raw) {
  if (!raw || typeof raw !== 'string') return { valid: false, formatted: '' };

  let val = raw.trim();
  // Remove prefixos como "R$" ou "r$" se existirem
  val = val.replace(/^R\$\s*/i, '').trim();

  if (!val) return { valid: false, formatted: '' };

  // Se o usuário digitou com ponto no lugar de vírgula decimal (ex: "79.90")
  if (val.includes('.') && !val.includes(',')) {
    val = val.replace('.', ',');
  }

  // Validação por Regex: dígitos opcionais com separador de milhar e exatamente duas casas decimais após vírgula
  // Ex: "79,90" ou "1.299,00" ou "9,99"
  const priceRegex = /^\d{1,3}(\.\d{3})*,\d{2}$|^\d+,\d{2}$/;
  if (priceRegex.test(val)) {
    return { valid: true, formatted: val };
  }

  // Se digitou inteiro sem vírgula (ex: "79"), formata para "79,00"
  if (/^\d+$/.test(val)) {
    return { valid: true, formatted: `${val},00` };
  }

  // Se digitou com 1 casa decimal (ex: "79,9"), completa para "79,90"
  if (/^\d+,\d{1}$/.test(val)) {
    return { valid: true, formatted: `${val}0` };
  }

  return { valid: false, formatted: val };
}

/**
 * Componente AdminProductForm
 * 
 * Props:
 * - isOpen: boolean
 * - onClose: function() => void
 * - onProductSaved: function(product) => void
 * - initialProduct: object | null (quando fornecido, opera em modo de EDIÇÃO)
 */
export default function AdminProductForm({
  isOpen,
  onClose,
  onProductSaved,
  initialProduct = null
}) {
  const isEditing = Boolean(initialProduct && initialProduct.id);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: '',
    price: '',
    old_price: '',
    platform: '',
    image: '',
    link: ''
  });

  // Origem da seleção atual de marketplace: 'none' | 'auto' | 'manual' | 'initial'
  const [platformOrigin, setPlatformOrigin] = useState('none');
  // Resultado da última análise local do link digitado/colado
  const [linkDetection, setLinkDetection] = useState({ status: 'idle', platform: null });

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Controla transições de abertura para gerar o código uma única vez por abertura de novo cadastro,
  // sem regenerar acidentalmente em re-renderizações enquanto o modal estiver aberto.
  const wasOpenRef = useRef(false);
  const lastProductIdRef = useRef(null);

  // Carrega os dados do produto quando entra em modo de edição ou inicializa novo cadastro com código automático.
  // Em edição, preserva integralmente link, código e marketplace salvos sem disparar preenchimento automático.
  useEffect(() => {
    if (!isOpen) {
      wasOpenRef.current = false;
      lastProductIdRef.current = null;
      return;
    }

    const currentProductId = initialProduct?.id ?? null;
    const justOpened = !wasOpenRef.current;
    const switchedTarget = lastProductIdRef.current !== currentProductId;

    if (!justOpened && !switchedTarget) {
      return;
    }

    wasOpenRef.current = true;
    lastProductIdRef.current = currentProductId;

    if (initialProduct) {
      setFormData({
        code: initialProduct.code || '',
        name: initialProduct.name || '',
        category: typeof initialProduct.category === 'string' ? initialProduct.category.trim() : '',
        price: initialProduct.price || '',
        old_price: initialProduct.old_price || initialProduct.oldPrice || '',
        platform: initialProduct.platform || '',
        image: initialProduct.image || '',
        link: initialProduct.link || ''
      });
      setPlatformOrigin('initial');
    } else {
      setFormData({
        code: generateProductCode(),
        name: '',
        category: '',
        price: '',
        old_price: '',
        platform: '',
        image: '',
        link: ''
      });
      setPlatformOrigin('none');
    }

    setLinkDetection({ status: 'idle', platform: null });
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [isOpen, initialProduct]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'platform') {
      setFormData((prev) => ({ ...prev, platform: value }));
      setPlatformOrigin(value ? 'manual' : 'none');
      if (errorMessage) setErrorMessage(null);
      return;
    }

    if (name === 'link') {
      const trimmed = value.trim();

      if (!trimmed) {
        setLinkDetection({ status: 'idle', platform: null });
        if (!isEditing && platformOrigin === 'auto') {
          setFormData((prev) => ({ ...prev, link: value, platform: '' }));
          setPlatformOrigin('none');
        } else {
          setFormData((prev) => ({ ...prev, link: value }));
        }
        if (errorMessage) setErrorMessage(null);
        return;
      }

      const detection = detectMarketplaceFromUrl(trimmed);
      setLinkDetection(detection);

      if (detection.status === 'detected') {
        // Novo cadastro sem escolha manual: aplica automaticamente a plataforma identificada
        if (!isEditing && platformOrigin !== 'manual') {
          setFormData((prev) => ({ ...prev, link: value, platform: detection.platform }));
          setPlatformOrigin('auto');
        } else {
          // Edição ou escolha manual anterior: não sobrescreve silenciosamente
          setFormData((prev) => ({ ...prev, link: value }));
        }
      } else {
        // Link desconhecido, encurtador genérico ou ainda inválido:
        // se o marketplace atual veio de detecção automática anterior, limpa para não induzir erro
        if (!isEditing && platformOrigin === 'auto') {
          setFormData((prev) => ({ ...prev, link: value, platform: '' }));
          setPlatformOrigin('none');
        } else {
          setFormData((prev) => ({ ...prev, link: value }));
        }
      }

      if (errorMessage) setErrorMessage(null);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleApplyDetectedPlatform = () => {
    if (linkDetection.status === 'detected' && linkDetection.platform) {
      setFormData((prev) => ({ ...prev, platform: linkDetection.platform }));
      setPlatformOrigin(isEditing ? 'manual' : 'auto');
      if (errorMessage) setErrorMessage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validações obrigatórias (acompanhando a ordem visual do formulário)
    const trimmedLink = formData.link.trim();
    if (!trimmedLink) {
      setErrorMessage('O link de afiliado é obrigatório.');
      return;
    }
    if (!isValidHttpUrl(trimmedLink)) {
      setErrorMessage('O link de afiliado deve ser uma URL válida iniciando com http:// ou https://');
      return;
    }

    const trimmedCode = formData.code.trim();
    if (!trimmedCode) {
      setErrorMessage('O código do produto é obrigatório.');
      return;
    }
    if (trimmedCode.length > 10) {
      setErrorMessage('O código do produto deve ter no máximo 10 caracteres.');
      return;
    }

    const trimmedPlatform = formData.platform ? formData.platform.trim() : '';
    if (!trimmedPlatform) {
      setErrorMessage('Selecione o marketplace do produto.');
      return;
    }

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setErrorMessage('O nome do produto é obrigatório.');
      return;
    }

    const trimmedCategory = formData.category ? formData.category.trim() : '';
    if (!isEditing && !trimmedCategory) {
      setErrorMessage('Selecione uma categoria para o produto.');
      return;
    }

    // Validação e padronização monetária do preço atual
    const priceValidation = formatAndValidatePrice(formData.price);
    if (!priceValidation.valid) {
      setErrorMessage('Preço atual inválido. Utilize o formato brasileiro, ex: "79,90".');
      return;
    }
    const validatedPrice = priceValidation.formatted;

    // Validação e padronização monetária do preço anterior (opcional)
    let validatedOldPrice = null;
    const trimmedOldPrice = formData.old_price ? formData.old_price.trim() : '';
    if (trimmedOldPrice) {
      const oldPriceValidation = formatAndValidatePrice(trimmedOldPrice);
      if (!oldPriceValidation.valid) {
        setErrorMessage('Preço anterior inválido. Utilize o formato brasileiro, ex: "119,90", ou deixe em branco.');
        return;
      }
      validatedOldPrice = oldPriceValidation.formatted;
    }

    const trimmedImage = formData.image.trim();
    if (!trimmedImage) {
      setErrorMessage('A URL da imagem é obrigatória.');
      return;
    }
    if (!isValidHttpUrl(trimmedImage)) {
      setErrorMessage('A URL da imagem deve ser um link válido iniciando com http:// ou https://');
      return;
    }

    setSaving(true);

    try {
      if (isEditing) {
        // MODO EDIÇÃO: Atualiza exclusivamente os campos editáveis filtrando por id
        // Regra estrita: NÃO altera code, is_active, id, created_at, rating ou reviews
        // Inclui category somente quando houve mudança em relação ao valor salvo,
        // preservando category: null em produtos legados e valores desconhecidos preexistentes.
        const initialCategory =
          typeof initialProduct.category === 'string' ? initialProduct.category.trim() : '';

        const updatePayload = {
          name: trimmedName,
          price: validatedPrice,
          old_price: validatedOldPrice,
          platform: trimmedPlatform,
          image: trimmedImage,
          link: trimmedLink
        };

        if (trimmedCategory !== initialCategory) {
          updatePayload.category = trimmedCategory || null;
        }

        const { data: updatedRow, error: updateError } = await supabase
          .from('products')
          .update(updatePayload)
          .eq('id', initialProduct.id)
          .select('id')
          .single();

        if (updateError) {
          // Código PGRST116: nenhuma linha correspondeu ao filtro — registro não encontrado
          if (updateError.code === 'PGRST116') {
            setErrorMessage('O produto não foi encontrado. Pode ter sido removido. Recarregue a listagem e tente novamente.');
          } else {
            setErrorMessage(updateError.message || 'Erro ao atualizar produto no banco.');
          }
          return;
        }

        // Garantia adicional: só confirma sucesso se o Supabase retornou o id do registro atualizado
        if (!updatedRow?.id) {
          setErrorMessage('A atualização não pôde ser confirmada pelo servidor. Recarregue a listagem antes de tentar novamente.');
          return;
        }

        setSuccessMessage('Alterações salvas com sucesso!');

        if (onProductSaved) {
          onProductSaved();
        }

        setTimeout(() => {
          onClose();
        }, 700);
      } else {
        // MODO NOVO CADASTRO: Inserção com is_active explicitamente false (Rascunho)
        // Utiliza a constraint UNIQUE de products.code como fonte definitiva de unicidade,
        // com retry limitado a MAX_CODE_ATTEMPTS em caso de colisão comprovada no código.
        let currentCode = trimmedCode;

        for (let attempt = 1; attempt <= MAX_CODE_ATTEMPTS; attempt++) {
          const insertPayload = {
            code: currentCode,
            name: trimmedName,
            category: trimmedCategory,
            price: validatedPrice,
            old_price: validatedOldPrice,
            platform: trimmedPlatform,
            image: trimmedImage,
            link: trimmedLink,
            is_active: false // Regra obrigatória: novo produto sempre nasce como rascunho
          };

          const { data: insertedRow, error: insertError } = await supabase
            .from('products')
            .insert([insertPayload])
            .select('id')
            .single();

          if (!insertError) {
            // Garantia adicional: só confirma sucesso se o Supabase retornou o id do registro inserido
            if (!insertedRow?.id) {
              setErrorMessage('O cadastro não pôde ser confirmado pelo servidor. Verifique a listagem antes de tentar novamente.');
              return;
            }

            setSuccessMessage(`Produto cadastrado como rascunho! (CÓD: ${currentCode})`);

            if (onProductSaved) {
              onProductSaved();
            }

            setTimeout(() => {
              onClose();
            }, 700);
            return;
          }

          // Retry SOMENTE quando o erro 23505 for comprovadamente violação de unicidade em products.code
          if (isProductCodeUniqueViolation(insertError)) {
            if (attempt < MAX_CODE_ATTEMPTS) {
              currentCode = generateProductCode();
              setFormData((prev) => ({ ...prev, code: currentCode }));
              continue;
            }

            setErrorMessage(
              'Não foi possível gerar um código único após várias tentativas. Tente novamente em instantes.'
            );
            return;
          }

          // Qualquer outro erro (inclusive 23505 de outra constraint) interrompe imediatamente sem retry
          setErrorMessage(insertError.message || 'Erro ao cadastrar produto no banco.');
          return;
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Falha inesperada ao comunicar com o banco.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={saving ? undefined : onClose}>
      <style>{formModalStyles}</style>

      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="admin-modal-title-wrap">
            <div className="admin-modal-icon-badge">
              {isEditing ? <Pencil size={20} strokeWidth={2.4} /> : <PackagePlus size={20} strokeWidth={2.4} />}
            </div>
            <div>
              <h3 className="admin-modal-title">
                {isEditing ? `Editar Produto (CÓD: ${initialProduct.code})` : 'Novo Produto'}
              </h3>
              <p className="admin-modal-subtitle">
                {isEditing
                  ? 'Altere as informações do produto. O status de publicação atual será preservado.'
                  : 'O produto será salvo como rascunho e não aparecerá na vitrine pública até ser aprovado.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-close-modal"
            onClick={onClose}
            disabled={saving}
            title="Fechar formulário"
          >
            <X size={18} />
          </button>
        </div>

        {errorMessage && (
          <div className="admin-form-alert admin-alert-error" role="alert">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="admin-form-alert admin-alert-success" role="status">
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="product-link">
              Link de Afiliado <span className="required-star">*</span>
            </label>
            <input
              id="product-link"
              name="link"
              type="url"
              required
              placeholder="https://mercadolivre.com/..., https://shope.ee/... ou https://amzn.to/..."
              className="admin-form-input"
              value={formData.link}
              onChange={handleChange}
              disabled={saving}
              autoFocus={!isEditing}
            />

            {!isEditing &&
              platformOrigin === 'auto' &&
              linkDetection.status === 'detected' &&
              formData.platform === linkDetection.platform && (
                <div className="admin-link-feedback admin-link-feedback-detected" role="status">
                  <span className="admin-link-feedback-text">
                    <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
                    <span>
                      Marketplace identificado pelo link: <strong>{linkDetection.platform}</strong>.
                    </span>
                  </span>
                </div>
              )}

            {linkDetection.status === 'detected' &&
              linkDetection.platform &&
              formData.platform !== linkDetection.platform && (
                <div className="admin-link-feedback admin-link-feedback-suggestion" role="status">
                  <span className="admin-link-feedback-text">
                    <Info size={14} style={{ flexShrink: 0 }} />
                    <span>
                      Link identificado como <strong>{linkDetection.platform}</strong>.
                    </span>
                  </span>
                  <button
                    type="button"
                    className="btn-apply-platform"
                    onClick={handleApplyDetectedPlatform}
                    disabled={saving}
                  >
                    Aplicar {linkDetection.platform}
                  </button>
                </div>
              )}

            {linkDetection.status === 'shortener_generic' && (
              <div className="admin-link-feedback admin-link-feedback-hint" role="status">
                <span className="admin-link-feedback-text">
                  <Info size={14} style={{ flexShrink: 0 }} />
                  <span>Link encurtado genérico — selecione o marketplace manualmente.</span>
                </span>
              </div>
            )}

            {linkDetection.status === 'unknown' && (
              <div className="admin-link-feedback admin-link-feedback-hint" role="status">
                <span className="admin-link-feedback-text">
                  <Info size={14} style={{ flexShrink: 0 }} />
                  <span>Domínio não reconhecido automaticamente — selecione o marketplace manualmente.</span>
                </span>
              </div>
            )}
          </div>

          <div className="admin-form-grid-2">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="product-code">
                Código <span className="required-star">*</span>
              </label>
              <input
                id="product-code"
                name="code"
                type="text"
                maxLength={10}
                required
                readOnly
                className="admin-form-input admin-form-input-readonly"
                value={formData.code}
                disabled={saving}
                aria-readonly="true"
              />
              <p className="admin-form-note">
                {isEditing
                  ? 'Código público preservado (não editável).'
                  : 'Gerado automaticamente (6 caracteres).'}
              </p>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="product-platform">
                Marketplace <span className="required-star">*</span>
              </label>
              <select
                id="product-platform"
                name="platform"
                required
                className="admin-form-select"
                value={formData.platform}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="">Selecione o marketplace</option>
                {SUPPORTED_MARKETPLACES.map((marketplace) => (
                  <option key={marketplace} value={marketplace}>
                    {marketplace}
                  </option>
                ))}
                {formData.platform && !SUPPORTED_MARKETPLACES.includes(formData.platform) && (
                  <option value={formData.platform}>{formData.platform}</option>
                )}
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="product-name">
              Nome do Produto <span className="required-star">*</span>
            </label>
            <input
              id="product-name"
              name="name"
              type="text"
              required
              placeholder="Ex: Luminária de Mesa Articulada LED"
              className="admin-form-input"
              value={formData.name}
              onChange={handleChange}
              disabled={saving}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="product-category">
              Categoria do produto {!isEditing && <span className="required-star">*</span>}
            </label>
            <select
              id="product-category"
              name="category"
              required={!isEditing}
              className="admin-form-select"
              value={formData.category}
              onChange={handleChange}
              disabled={saving}
            >
              <option value="">Selecione uma categoria</option>
              {SUPPORTED_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              {formData.category && !SUPPORTED_CATEGORIES.includes(formData.category) && (
                <option value={formData.category}>{formData.category}</option>
              )}
            </select>
            {isEditing && !formData.category && (
              <p className="admin-form-note">
                Produto ainda sem categoria. Você pode classificá-lo agora ou manter como está.
              </p>
            )}
          </div>

          <div className="admin-form-grid-2">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="product-price">
                Preço Atual (R$) <span className="required-star">*</span>
              </label>
              <input
                id="product-price"
                name="price"
                type="text"
                required
                placeholder="Ex: 79,90"
                className="admin-form-input"
                value={formData.price}
                onChange={handleChange}
                disabled={saving}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="product-old-price">
                Preço Anterior / Riscado
              </label>
              <input
                id="product-old-price"
                name="old_price"
                type="text"
                placeholder="Ex: 119,90"
                className="admin-form-input"
                value={formData.old_price}
                onChange={handleChange}
                disabled={saving}
              />
              <p className="admin-form-note">Opcional (para ancoragem visual de preço).</p>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="product-image">
              URL da Imagem <span className="required-star">*</span>
            </label>
            <input
              id="product-image"
              name="image"
              type="url"
              required
              placeholder="https://images.unsplash.com/... ou https://..."
              className="admin-form-input"
              value={formData.image}
              onChange={handleChange}
              disabled={saving}
            />
          </div>

          <div className="admin-modal-actions">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-modal-submit"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>{isEditing ? 'Salvando...' : 'Cadastrando...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>{isEditing ? 'Salvar Alterações' : 'Salvar como Rascunho'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
