/**
 * Módulo puro para identificação segura de marketplaces por URL
 * e padronização das classes visuais das plataformas.
 *
 * Sem dependências externas, sem requisições de rede e sem mutação da URL original.
 */

export const SUPPORTED_MARKETPLACES = ['Shopee', 'Mercado Livre', 'Amazon'];

const MARKETPLACE_DOMAINS = [
  {
    platform: 'Shopee',
    domains: ['shopee.com.br', 'shopee.com', 'shope.ee']
  },
  {
    platform: 'Mercado Livre',
    domains: ['mercadolivre.com.br', 'mercadolivre.com', 'mercadolibre.com', 'meli.la']
  },
  {
    platform: 'Amazon',
    domains: ['amazon.com.br', 'amazon.com', 'amzn.to', 'a.co', 'amzn.eu']
  }
];

const GENERIC_SHORTENER_DOMAINS = [
  'bit.ly',
  'tinyurl.com',
  't.co',
  'cutt.ly',
  'rb.gy',
  'is.gd',
  'ow.ly',
  'shorturl.at',
  'rebrand.ly',
  'tiny.cc',
  'goo.gl',
  'lnkd.in',
  'v.gd'
];

/**
 * Verifica se o hostname corresponde exatamente ao domínio
 * ou a um subdomínio legítimo precedido por ponto.
 * Ex.: "produto.mercadolivre.com.br" corresponde a "mercadolivre.com.br",
 * mas "fake-shopee.com" e "shopee.com.br.evil.example" NÃO correspondem.
 *
 * @param {string} hostname
 * @param {string} domain
 * @returns {boolean}
 */
function matchesDomain(hostname, domain) {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

/**
 * Analisa uma URL (HTTP/HTTPS) e identifica o marketplace exclusivamente
 * pelo hostname normalizado, sem alterar a URL original.
 *
 * @param {string} rawUrl
 * @returns {{
 *   status: 'detected' | 'shortener_generic' | 'unknown' | 'invalid',
 *   platform: 'Shopee' | 'Mercado Livre' | 'Amazon' | null
 * }}
 */
export function detectMarketplaceFromUrl(rawUrl) {
  if (typeof rawUrl !== 'string') {
    return { status: 'invalid', platform: null };
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { status: 'invalid', platform: null };
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(trimmed);
  } catch {
    return { status: 'invalid', platform: null };
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return { status: 'invalid', platform: null };
  }

  // Normaliza hostname para minúsculas e remove ponto final (FQDN trailing dot) se existir
  const hostname = parsedUrl.hostname.toLowerCase().replace(/\.$/, '');
  if (!hostname) {
    return { status: 'invalid', platform: null };
  }

  for (const entry of MARKETPLACE_DOMAINS) {
    if (entry.domains.some((domain) => matchesDomain(hostname, domain))) {
      return { status: 'detected', platform: entry.platform };
    }
  }

  if (GENERIC_SHORTENER_DOMAINS.some((domain) => matchesDomain(hostname, domain))) {
    return { status: 'shortener_generic', platform: null };
  }

  return { status: 'unknown', platform: null };
}

/**
 * Retorna a classe CSS padronizada para o badge do marketplace.
 * Plataformas desconhecidas sempre recebem 'platform-default'.
 *
 * @param {string | null | undefined} platform
 * @returns {string}
 */
export function getMarketplaceClass(platform) {
  switch (platform) {
    case 'Shopee':
      return 'platform-shopee';
    case 'Mercado Livre':
      return 'platform-mercadolivre';
    case 'Amazon':
      return 'platform-amazon';
    default:
      return 'platform-default';
  }
}
