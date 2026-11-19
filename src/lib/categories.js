/**
 * Módulo puro para gerenciamento e normalização de categorias da Vitrine Oficial.
 *
 * Regras:
 * - Valores nulos, indefinidos ou vazios são interpretados como "Outros" na exibição,
 *   sem modificar os registros originais no banco de dados.
 * - Valores desconhecidos já existentes (não vazios) são preservados intactos,
 *   nunca convertidos silenciosamente para "Outros".
 */

export const ALL_CATEGORIES_FILTER = 'Todas';
export const DEFAULT_CATEGORY = 'Outros';

export const SUPPORTED_CATEGORIES = Object.freeze([
  'Eletrônicos',
  'Casa e Cozinha',
  'Moda',
  'Beleza e Cuidados',
  'Ferramentas',
  'Automotivo',
  'Esportes e Lazer',
  'Pets',
  'Infantil e Brinquedos',
  'Outros'
]);

/**
 * Normaliza o valor da categoria para exibição e filtragem:
 * - null, undefined, não-string ou string vazia/espaços -> "Outros"
 * - Categoria oficial (mesmo com espaços extras nas pontas) -> valor canônico oficial
 * - Qualquer outro valor não vazio já existente -> preservado (apenas com trim)
 *
 * @param {string | null | undefined} rawCategory
 * @returns {string}
 */
export function normalizeCategory(rawCategory) {
  if (typeof rawCategory !== 'string') {
    return DEFAULT_CATEGORY;
  }

  const trimmed = rawCategory.trim();
  if (!trimmed) {
    return DEFAULT_CATEGORY;
  }

  const exactMatch = SUPPORTED_CATEGORIES.find((item) => item === trimmed);
  if (exactMatch) {
    return exactMatch;
  }

  // Preserva valores desconhecidos já existentes sem convertê-los silenciosamente
  return trimmed;
}

/**
 * Verifica se o valor informado corresponde a uma das categorias oficiais suportadas.
 *
 * @param {string | null | undefined} category
 * @returns {boolean}
 */
export function isSupportedCategory(category) {
  if (typeof category !== 'string') {
    return false;
  }
  return SUPPORTED_CATEGORIES.includes(category.trim());
}
