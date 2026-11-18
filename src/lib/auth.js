import { supabase } from './supabase.js';

/**
 * Módulo de Autenticação e Autorização Administrativa (Supabase Auth)
 */

/**
 * Realiza login por e-mail e senha.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: object|null, session: object|null, error: string|null }>}
 */
export async function loginWithPassword(email, password) {
  try {
    if (!email || !password) {
      return { user: null, session: null, error: 'E-mail e senha são obrigatórios.' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) {
      return { user: null, session: null, error: error.message };
    }

    return { user: data.user, session: data.session, error: null };
  } catch (err) {
    return { user: null, session: null, error: err.message || 'Erro inesperado ao realizar login.' };
  }
}

/**
 * Encerra a sessão ativa do usuário.
 * @returns {Promise<{ success: boolean, error: string|null }>}
 */
export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err.message || 'Erro inesperado ao realizar logout.' };
  }
}

/**
 * Consulta a sessão atualmente persistida no cliente.
 * @returns {Promise<{ session: object|null, error: string|null }>}
 */
export async function getCurrentSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      return { session: null, error: error.message };
    }
    return { session: data.session, error: null };
  } catch (err) {
    return { session: null, error: err.message || 'Erro ao consultar sessão.' };
  }
}

/**
 * Consulta o usuário autenticado atual validado pelo servidor do Supabase.
 * @returns {Promise<{ user: object|null, error: string|null }>}
 */
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      return { user: null, error: error.message };
    }
    return { user: data.user, error: null };
  } catch (err) {
    return { user: null, error: err.message || 'Erro ao consultar usuário.' };
  }
}

/**
 * Verifica se o usuário autenticado possui autorização administrativa no banco.
 * Utiliza exclusivamente a RPC 'check_is_admin' (SECURITY INVOKER) no schema público.
 * Um usuário autenticado comum NÃO é considerado administrador.
 * 
 * Regras estritas:
 * - Sem sessão: isAdmin: false, error: null (cenário normal de visitante).
 * - Erro na checagem de sessão/usuário: isAdmin: false, error: mensagem de erro.
 * - Erro na RPC: isAdmin: false, error: mensagem de erro.
 * - Usuário autenticado sem autorização (data !== true): isAdmin: false, error: null.
 * - Administrador confirmado: isAdmin: true, error: null (apenas quando data === true).
 * 
 * @returns {Promise<{ isAdmin: boolean, error: string|null }>}
 */
export async function verifyAdminStatus() {
  try {
    // 1. Verifica primeiro a existência de sessão local
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      return { isAdmin: false, error: sessionError.message || 'Erro ao consultar sessão local.' };
    }
    if (!sessionData?.session) {
      return { isAdmin: false, error: null }; // Visitante ou usuário não autenticado
    }

    // 2. Valida a identidade diretamente no servidor Supabase Auth
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      return { isAdmin: false, error: userError.message || 'Erro ao validar identidade do usuário no servidor.' };
    }
    if (!userData?.user) {
      return { isAdmin: false, error: null };
    }

    // 3. Executa a RPC pública que consulta auth_admin.is_admin()
    const { data, error: rpcError } = await supabase.rpc('check_is_admin');
    if (rpcError) {
      return { isAdmin: false, error: rpcError.message || 'Erro ao consultar autorização administrativa.' };
    }

    // 4. Concessão estrita: somente o booleano primitivo true concede acesso
    const isAdmin = data === true;
    return { isAdmin, error: null };
  } catch (err) {
    return { isAdmin: false, error: err.message || 'Erro inesperado ao verificar autorização administrativa.' };
  }
}
