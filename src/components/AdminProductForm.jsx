import React, { useState } from 'react';
import {
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  PackagePlus,
  HelpCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';

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

  .admin-draft-notice {
    background: #fffbeb;
    border: 1px solid #fef3c7;
    border-radius: 10px;
    padding: 0.75rem 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: #92400e;
    margin-bottom: 1.25rem;
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
 * Componente AdminProductForm
 * 
 * Props:
 * - isOpen: boolean
 * - onClose: function() => void
 * - onProductCreated: function(newProduct) => void
 */
export default function AdminProductForm({ isOpen, onClose, onProductCreated }) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    price: '',
    old_price: '',
    platform: 'Shopee',
    image: '',
    link: ''
  });

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validações obrigatórias
    const trimmedCode = formData.code.trim();
    if (!trimmedCode) {
      setErrorMessage('O código do produto é obrigatório.');
      return;
    }
    if (trimmedCode.length > 10) {
      setErrorMessage('O código do produto deve ter no máximo 10 caracteres.');
      return;
    }

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setErrorMessage('O nome do produto é obrigatório.');
      return;
    }

    const trimmedPrice = formData.price.trim();
    if (!trimmedPrice) {
      setErrorMessage('O preço atual é obrigatório.');
      return;
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

    const trimmedLink = formData.link.trim();
    if (!trimmedLink) {
      setErrorMessage('O link de afiliado é obrigatório.');
      return;
    }
    if (!isValidHttpUrl(trimmedLink)) {
      setErrorMessage('O link de afiliado deve ser uma URL válida iniciando com http:// ou https://');
      return;
    }

    const trimmedOldPrice = formData.old_price.trim();

    setSaving(true);

    try {
      // Inserção com is_active explicitamente false (Rascunho)
      const payload = {
        code: trimmedCode,
        name: trimmedName,
        price: trimmedPrice,
        old_price: trimmedOldPrice || null,
        platform: formData.platform,
        image: trimmedImage,
        link: trimmedLink,
        is_active: false // Regra obrigatória: novo cadastro é sempre rascunho
      };

      const { data, error } = await supabase
        .from('products')
        .insert([payload])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          setErrorMessage(`Já existe um produto cadastrado com o código "${trimmedCode}".`);
        } else {
          setErrorMessage(error.message || 'Erro ao cadastrar produto no banco.');
        }
        return;
      }

      setSuccessMessage('Produto cadastrado com sucesso como rascunho!');

      // Notifica o componente pai para atualizar a listagem
      if (onProductCreated) {
        onProductCreated(data);
      }

      // Fecha o modal após breve confirmação
      setTimeout(() => {
        onClose();
      }, 700);
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
              <PackagePlus size={20} strokeWidth={2.4} />
            </div>
            <div>
              <h3 className="admin-modal-title">Novo Produto</h3>
              <p className="admin-modal-subtitle">
                O produto será salvo como rascunho e não aparecerá na vitrine pública até ser aprovado.
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

        <div className="admin-draft-notice">
          <HelpCircle size={16} style={{ flexShrink: 0 }} />
          <span>Status inicial automático: <strong>Rascunho</strong> (invisível para clientes).</span>
        </div>

        <form onSubmit={handleSubmit} noValidate>
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
                placeholder="Ex: 007"
                className="admin-form-input"
                value={formData.code}
                onChange={handleChange}
                disabled={saving}
                autoFocus
              />
              <p className="admin-form-note">Identificador único exibido no vídeo (máx. 10 caracteres).</p>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="product-platform">
                Marketplace <span className="required-star">*</span>
              </label>
              <select
                id="product-platform"
                name="platform"
                className="admin-form-select"
                value={formData.platform}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="Shopee">Shopee</option>
                <option value="Mercado Livre">Mercado Livre</option>
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

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="product-link">
              Link de Afiliado <span className="required-star">*</span>
            </label>
            <input
              id="product-link"
              name="link"
              type="url"
              required
              placeholder="https://shope.ee/... ou https://mercadolivre.com/..."
              className="admin-form-input"
              value={formData.link}
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
                  <span>Cadastrando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Salvar como Rascunho</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

