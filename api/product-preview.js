/**
 * Vercel Serverless Function — Open Graph Dinâmico para Produtos
 * Rota: /produto/:code -> /api/product-preview?code=:code
 *
 * Entrega o HTML inicial compilado pelo Vite com metadados Open Graph
 * específicos para crawlers (WhatsApp, Facebook, Twitter, Telegram)
 * e hidratação perfeita para navegadores de usuários reais.
 */
import fs from 'node:fs';
import path from 'node:path';

// Domínio público de produção verificado do projeto na Vercel
const KNOWN_PRODUCTION_ORIGIN = 'https://vitrine-codigos.vercel.app';

// Cache em memória do HTML base na instância serverless quente (warm lambda)
let cachedHtmlShell = null;

/**
 * Escapa caracteres especiais para prevenir injeção de HTML / XSS em atributos e tags.
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Limpa e formata a descrição do produto para uso em metatags (máx. 155 caracteres).
 */
export function formatDescription(desc, productName) {
  if (typeof desc === 'string' && desc.trim().length > 0) {
    const cleaned = desc.replace(/\s+/g, ' ').trim();
    if (cleaned.length <= 155) return cleaned;
    const truncated = cleaned.slice(0, 155);
    const lastSpace = truncated.lastIndexOf(' ');
    return (lastSpace > 120 ? truncated.slice(0, lastSpace) : truncated) + '...';
  }
  return `Confira os detalhes e a oferta de ${productName} na Vitrine Oficial.`;
}

/**
 * Obtém a casca HTML compilada (dist/index.html).
 * Em ambiente publicado (Vercel Production ou Preview), falha de forma controlada
 * se os assets compilados do Vite estiverem ausentes, impedindo a entrega
 * silenciosa de páginas quebradas que não inicializem o React.
 */
export function getHtmlShell() {
  if (cachedHtmlShell) return cachedHtmlShell;

  // 1. Tenta dist/index.html empacotado via includeFiles na Vercel
  const distPath = path.join(process.cwd(), 'dist', 'index.html');
  if (fs.existsSync(distPath)) {
    try {
      const content = fs.readFileSync(distPath, 'utf8');
      if (content.includes('id="root"')) {
        cachedHtmlShell = content;
        return cachedHtmlShell;
      }
    } catch (err) {
      console.warn('[OpenGraph] Erro ao ler dist/index.html:', err.message);
    }
  }

  const isPublishedEnv = Boolean(process.env.VERCEL_ENV || process.env.NODE_ENV === 'production');

  // Em produção ou preview, a ausência de dist/index.html é uma falha de empacotamento crítica
  // Não retornamos arquivos de desenvolvimento silenciosamente
  if (isPublishedEnv) {
    const err = new Error('Arquivo compilado dist/index.html ausente no bundle da Vercel.');
    err.code = 'HTML_BUNDLE_MISSING';
    throw err;
  }

  // 2. Apenas em desenvolvimento local permitimos fallback para index.html da raiz
  const rootPath = path.join(process.cwd(), 'index.html');
  if (fs.existsSync(rootPath)) {
    try {
      cachedHtmlShell = fs.readFileSync(rootPath, 'utf8');
      console.warn('[OpenGraph] Usando index.html da raiz em ambiente de desenvolvimento local.');
      return cachedHtmlShell;
    } catch {
      // continua para erro
    }
  }

  const err = new Error('Nenhum arquivo HTML válido (dist/index.html ou index.html) pôde ser carregado.');
  err.code = 'HTML_BUNDLE_MISSING';
  throw err;
}

/**
 * Remove metatags genéricas pré-existentes para evitar duplicações ou conflitos.
 */
export function stripGenericMetaTags(html) {
  return html
    .replace(/<title>[^<]*<\/title>/gi, '')
    .replace(/<meta\s+name=["']description["'][^>]*\/?>/gi, '')
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*\/?>/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*\/?>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*\/?>/gi, '');
}

/**
 * Sanitiza e normaliza uma origem HTTPS garantindo ausência de caminhos ou barras finais.
 */
export function sanitizeHttpsOrigin(rawUrl) {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) return null;
  try {
    const trimmed = rawUrl.trim();
    const withProto = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(withProto);
    if (!parsed.hostname || !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(:\d+)?$/.test(parsed.host)) {
      return null;
    }
    return `https://${parsed.host}`;
  } catch {
    return null;
  }
}

/**
 * Determina a origem pública canônica para metadados Open Graph.
 * Em Preview (VERCEL_ENV=preview), a origem do próprio Preview possui prioridade absoluta,
 * impedindo que SITE_URL de produção substitua acidentalmente o endereço do Preview.
 * Não confia em cabeçalhos arbitrários de Host ou spoofing em desenvolvimento local.
 */
export function resolveCanonicalOrigin(req) {
  // 1. Ambiente Vercel Preview (deploy temporário de branch ou PR)
  // Prioridade absoluta: em Preview, utiliza o próprio domínio do Preview (VERCEL_URL),
  // mesmo que SITE_URL ou PUBLIC_URL estejam configuradas para produção no projeto.
  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
    const previewOrigin = sanitizeHttpsOrigin(process.env.VERCEL_URL);
    if (previewOrigin) return previewOrigin;
  }

  // 2. Configuração explícita de domínio do projeto (prioridade máxima para futuro domínio customizado em produção)
  if (process.env.SITE_URL) {
    const siteOrigin = sanitizeHttpsOrigin(process.env.SITE_URL);
    if (siteOrigin) return siteOrigin;
  }
  if (process.env.PUBLIC_URL) {
    const publicOrigin = sanitizeHttpsOrigin(process.env.PUBLIC_URL);
    if (publicOrigin) return publicOrigin;
  }

  // 3. Vercel Produção (domínio oficial ou atribuído ao projeto na Vercel)
  if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    const prodProjectOrigin = sanitizeHttpsOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL);
    if (prodProjectOrigin) return prodProjectOrigin;
  }

  // 4. Se tiver VERCEL_PROJECT_PRODUCTION_URL presente sem VERCEL_ENV explícito
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    const prodProjectOrigin = sanitizeHttpsOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL);
    if (prodProjectOrigin) return prodProjectOrigin;
  }

  // 5. Ambiente local de desenvolvimento / simulação de testes
  // Validação estrita: aceita unicamente "localhost" ou "127.0.0.1" com porta opcional válida.
  // Rejeita tentativas de spoofing como "attacker-localhost.com" ou cabeçalhos arbitrários.
  const isLocalEnv = !process.env.VERCEL_ENV && process.env.NODE_ENV !== 'production';
  const rawHost = (req?.headers && (req.headers['x-forwarded-host'] || req.headers.host)) || '';
  const host = typeof rawHost === 'string' ? rawHost.trim() : '';

  if (isLocalEnv) {
    if (/^(localhost|127\.0\.0\.1)(:\d{1,5})?$/.test(host)) {
      return `http://${host}`;
    }
  }

  // 6. Vercel deployment URL genérica se presente e válida
  if (process.env.VERCEL_URL) {
    const vercelOrigin = sanitizeHttpsOrigin(process.env.VERCEL_URL);
    if (vercelOrigin) return vercelOrigin;
  }

  // 7. Fallback seguro e verificado do projeto oficial na Vercel
  return KNOWN_PRODUCTION_ORIGIN;
}

/**
 * Consulta segura ao Supabase REST utilizando apenas a chave anônima pública e RLS.
 */
export async function fetchActiveProduct(code) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    const err = new Error('Variáveis do Supabase ausentes no runtime da Vercel Function.');
    err.code = 'CONFIG_MISSING';
    throw err;
  }

  const sanitizedUrl = supabaseUrl.replace(/\/+$/, '');
  const endpoint = `${sanitizedUrl}/rest/v1/products?select=code,name,image,description,is_active&code=eq.${encodeURIComponent(code)}&is_active=eq.true&limit=1`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4500); // 4.5s timeout resiliente

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const err = new Error(`Falha no Supabase: HTTP ${response.status}`);
      err.status = response.status;
      throw err;
    }

    const data = await response.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Handler principal da Vercel Serverless Function
 */
export default async function handler(req, res) {
  // Permite apenas métodos de leitura idempotentes
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).send('Método não permitido');
  }

  // 1. Extração e validação estrita do código público do produto
  let rawCode = req.query?.code;
  if (!rawCode && req.url) {
    try {
      const parsedUrl = new URL(req.url, 'http://localhost');
      rawCode = parsedUrl.searchParams.get('code');
      if (!rawCode) {
        const match = parsedUrl.pathname.match(/\/produto\/([^/?#]+)/i);
        if (match) rawCode = decodeURIComponent(match[1]);
      }
    } catch {
      // URL malformada
    }
  }

  const code = typeof rawCode === 'string' ? rawCode.trim() : (rawCode != null ? String(rawCode).trim() : '');

  // Validação: código deve ser alfanumérico seguro (1 a 64 caracteres)
  // Preserva estritamente zeros à esquerda como "007" e alfanuméricos como "UFAGQL"
  const isValidCode = code.length > 0 && code.length <= 64 && /^[a-zA-Z0-9_-]+$/.test(code);

  let rawShell = '';
  try {
    rawShell = getHtmlShell();
  } catch (shellErr) {
    console.error('[OpenGraph] Erro crítico ao obter casca HTML:', shellErr.message);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    return res.status(500).send('Erro interno do servidor: HTML compilado da aplicação indisponível.');
  }

  const baseHtml = stripGenericMetaTags(rawShell);
  const origin = resolveCanonicalOrigin(req);

  // Se o código for inválido ou ausente: retorna 404 seguro com shell SPA sem cache
  if (!isValidCode) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    const notFoundTags = `
    <!-- Metadados Open Graph: Produto Inválido ou Ausente -->
    <title>Produto não encontrado | Vitrine Oficial</title>
    <meta name="description" content="O produto solicitado não foi encontrado ou não está disponível na Vitrine Oficial." />
    <meta name="robots" content="noindex, nofollow" />
    <meta property="og:site_name" content="Vitrine Oficial" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:title" content="Produto não encontrado | Vitrine Oficial" />
    <meta property="og:description" content="O produto solicitado não foi encontrado ou não está disponível na Vitrine Oficial." />`;

    const finalHtml = baseHtml.replace('</head>', `${notFoundTags}\n  </head>`);
    return res.status(404).send(finalHtml);
  }

  // 2. Consulta de produto ativo no Supabase
  let product = null;
  try {
    product = await fetchActiveProduct(code);
  } catch (error) {
    console.error(`[OpenGraph] Erro ao consultar produto "${code}":`, error.message);

    // Diferencia falha temporária de infraestrutura de produto inexistente
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    const errorTags = `
    <!-- Metadados Open Graph: Indisponibilidade Temporária -->
    <title>Vitrine Oficial de Ofertas | Busque pelo Código</title>
    <meta name="description" content="Encontre os produtos dos vídeos pelo código na Vitrine Oficial." />
    <meta name="robots" content="noindex" />
    <meta property="og:site_name" content="Vitrine Oficial" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:title" content="Vitrine Oficial de Ofertas" />
    <meta property="og:description" content="Encontre os produtos dos vídeos pelo código na Vitrine Oficial." />`;

    const finalHtml = baseHtml.replace('</head>', `${errorTags}\n  </head>`);
    return res.status(503).send(finalHtml);
  }

  // 3. Produto inexistente ou inativo (is_active !== true): HTTP 404 sem cache para permitir publicação imediata
  if (!product || product.is_active !== true) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    const notFoundTags = `
    <!-- Metadados Open Graph: Produto Inexistente ou Inativo -->
    <title>Produto não encontrado | Vitrine Oficial</title>
    <meta name="description" content="O produto com código ${escapeHtml(code)} não está disponível ou foi retirado da vitrine." />
    <meta name="robots" content="noindex, nofollow" />
    <meta property="og:site_name" content="Vitrine Oficial" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:title" content="Produto não encontrado | Vitrine Oficial" />
    <meta property="og:description" content="O produto com código ${escapeHtml(code)} não está disponível ou foi retirado da vitrine." />`;

    const finalHtml = baseHtml.replace('</head>', `${notFoundTags}\n  </head>`);
    return res.status(404).send(finalHtml);
  }

  // 4. Produto ativo encontrado: construção dos metadados enriquecidos
  const safeName = escapeHtml(product.name || 'Produto');
  const safeTitle = `${safeName} | Vitrine Oficial`;
  const safeDescription = escapeHtml(formatDescription(product.description, product.name || 'este produto'));
  const canonicalUrl = `${origin}/produto/${encodeURIComponent(code)}`;
  const safeCanonicalUrl = escapeHtml(canonicalUrl);

  // Tratamento seguro da imagem principal
  let imageTags = '';
  let twitterImageTag = '';
  const rawImage = typeof product.image === 'string' ? product.image.trim() : '';

  if (rawImage.startsWith('https://')) {
    const safeImage = escapeHtml(rawImage);
    let imageType = '';
    if (rawImage.includes('.webp')) imageType = '\n    <meta property="og:image:type" content="image/webp" />';
    else if (rawImage.includes('.png')) imageType = '\n    <meta property="og:image:type" content="image/png" />';
    else if (rawImage.includes('.jpg') || rawImage.includes('.jpeg')) imageType = '\n    <meta property="og:image:type" content="image/jpeg" />';

    imageTags = `
    <meta property="og:image" content="${safeImage}" />
    <meta property="og:image:alt" content="${safeName}" />${imageType}`;

    twitterImageTag = `\n    <meta name="twitter:image" content="${safeImage}" />`;
  }

  const productMetaTags = `
    <!-- Metadados Dinâmicos Open Graph — Vitrine Oficial (Produto ${escapeHtml(code)}) -->
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <link rel="canonical" href="${safeCanonicalUrl}" />
    <meta property="og:site_name" content="Vitrine Oficial" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:url" content="${safeCanonicalUrl}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />${imageTags}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />${twitterImageTag}`;

  const finalHtml = baseHtml.replace('</head>', `${productMetaTags}\n  </head>`);

  // Política de cache conservadora e segura:
  // max-age=0, must-revalidate: o navegador sempre revalida com o servidor
  // s-maxage=30: a borda da Vercel (CDN) armazena por apenas 30 segundos
  // Sem stale-while-revalidate para propagação rápida de alterações
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=30, must-revalidate');

  return res.status(200).send(finalHtml);
}
