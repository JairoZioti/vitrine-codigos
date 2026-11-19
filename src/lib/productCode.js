/**
 * Módulo puro para geração criptograficamente segura de códigos públicos de produtos.
 *
 * Padrão aprovado:
 * - Exatamente 6 caracteres
 * - Alfabeto: A-Z (maiúsculas) e 0-9 (36 caracteres, incluindo O, 0, I e 1)
 * - Distribuição perfeitamente uniforme usando crypto.getRandomValues + rejection sampling
 */

export const PRODUCT_CODE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export const PRODUCT_CODE_LENGTH = 6;

// 252 = 36 * 7 (maior múltiplo de 36 <= 256)
// Descartar bytes >= 252 elimina o viés de módulo na conversão para índice 0..35.
const MAX_UNBIASED_BYTE = Math.floor(256 / PRODUCT_CODE_ALPHABET.length) * PRODUCT_CODE_ALPHABET.length;

/**
 * Gera um código público aleatório de 6 caracteres [A-Z0-9].
 * Utiliza crypto.getRandomValues() com rejection sampling.
 *
 * @returns {string}
 */
export function generateProductCode() {
  const cryptoObj = globalThis.crypto;
  if (!cryptoObj || typeof cryptoObj.getRandomValues !== 'function') {
    throw new Error('Ambiente sem suporte a crypto.getRandomValues() para geração segura de código.');
  }

  let result = '';
  const buffer = new Uint8Array(16);

  while (result.length < PRODUCT_CODE_LENGTH) {
    cryptoObj.getRandomValues(buffer);
    for (let i = 0; i < buffer.length && result.length < PRODUCT_CODE_LENGTH; i++) {
      const byte = buffer[i];
      if (byte < MAX_UNBIASED_BYTE) {
        result += PRODUCT_CODE_ALPHABET[byte % PRODUCT_CODE_ALPHABET.length];
      }
    }
  }

  return result;
}

/**
 * Verifica se um erro retornado pelo Supabase/PostgreSQL corresponde
 * especificamente a uma violação de unicidade (23505) na coluna products.code.
 *
 * Evita disparar retry para outras constraints UNIQUE que também retornem 23505.
 *
 * @param {{ code?: string, message?: string, details?: string, constraint?: string } | null | undefined} error
 * @returns {boolean}
 */
export function isProductCodeUniqueViolation(error) {
  if (!error || error.code !== '23505') {
    return false;
  }

  const combined = [
    error.constraint,
    error.message,
    error.details
  ]
    .filter((part) => typeof part === 'string')
    .join(' ')
    .toLowerCase();

  return (
    combined.includes('products_code_key') ||
    combined.includes('key (code)') ||
    combined.includes('products_code_idx') ||
    combined.includes('products_code_unique')
  );
}
