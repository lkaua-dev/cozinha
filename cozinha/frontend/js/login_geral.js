/**
 * login_geral.js
 * Lógica de autenticação para login, cadastro e recuperação.
 * Armazenamento: localStorage (simulação de banco de dados)
 */

/* =====================================================
   CONSTANTES E CONFIGURAÇÃO
   ===================================================== */

// Usuário padrão para testes (independe de cadastro)
const DEFAULT_USER = {
  nome: 'Admin',
  email: 'admin@teste.com',
  senha: '123456'
};

// Chave usada no localStorage para armazenar usuários
const STORAGE_KEY = 'auth_usuarios';

/* =====================================================
   UTILITÁRIOS DE ARMAZENAMENTO
   ===================================================== */

/**
 * Retorna todos os usuários cadastrados no localStorage.
 * Inclui sempre o usuário padrão de teste.
 */
function getUsuarios() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const cadastrados = raw ? JSON.parse(raw) : [];

  // Garante que o usuário padrão sempre esteja disponível
  const existe = cadastrados.some(u => u.email === DEFAULT_USER.email);
  if (!existe) {
    cadastrados.push(DEFAULT_USER);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cadastrados));
  }

  return cadastrados;
}

/**
 * Salva a lista de usuários no localStorage.
 * @param {Array} usuarios
 */
function salvarUsuarios(usuarios) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
}

/**
 * Busca um usuário pelo email (case-insensitive).
 * @param {string} email
 * @returns {Object|null}
 */
function buscarPorEmail(email) {
  const usuarios = getUsuarios();
  return usuarios.find(u => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
}

/* =====================================================
   VALIDAÇÕES
   ===================================================== */

/**
 * Verifica se o email tem formato válido.
 * @param {string} email
 * @returns {boolean}
 */
function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Verifica se o campo não está vazio (ignora espaços).
 * @param {string} valor
 * @returns {boolean}
 */
function campoPreenchido(valor) {
  return valor.trim().length > 0;
}

/**
 * Verifica se a senha tem mínimo de 6 caracteres.
 * @param {string} senha
 * @returns {boolean}
 */
function senhaForte(senha) {
  return senha.length >= 6;
}

/**
 * Calcula a força da senha (0–3).
 * Retorna: { nivel: 0|1|2|3, texto: string, cor: string }
 */
function calcularForcaSenha(senha) {
  if (senha.length === 0) return { nivel: 0, texto: '', cor: '' };

  let pontos = 0;
  if (senha.length >= 6)  pontos++;
  if (senha.length >= 10) pontos++;
  if (/[A-Z]/.test(senha) && /[0-9]/.test(senha)) pontos++;
  if (/[^A-Za-z0-9]/.test(senha)) pontos++;

  const niveis = [
    { nivel: 1, texto: 'Fraca',    cor: '#f43f5e', pct: '25%' },
    { nivel: 2, texto: 'Razoável', cor: '#fbbf24', pct: '55%' },
    { nivel: 3, texto: 'Boa',      cor: '#22d3a8', pct: '80%' },
    { nivel: 4, texto: 'Forte',    cor: '#3b82f6', pct: '100%' }
  ];

  return niveis[Math.min(pontos, 3)];
}

/* =====================================================
   MANIPULAÇÃO DE UI — HELPERS
   ===================================================== */

/**
 * Exibe o alerta global do card.
 * @param {string} tipo  - 'error' | 'success' | 'info'
 * @param {string} icone - emoji ou símbolo
 * @param {string} msg   - mensagem
 */
function exibirAlerta(tipo, icone, msg) {
  const el = document.getElementById('alertGlobal');
  if (!el) return;

  el.className = `auth-alert alert-${tipo} active`;
  el.innerHTML = `<span class="alert-icon">${icone}</span><span>${msg}</span>`;

  // Remove automaticamente após 5s em caso de sucesso/info
  if (tipo !== 'error') {
    setTimeout(() => el.classList.remove('active'), 5000);
  }
}

/** Limpa o alerta global */
function limparAlerta() {
  const el = document.getElementById('alertGlobal');
  if (el) el.classList.remove('active');
}

/**
 * Marca um campo como inválido e exibe mensagem.
 * @param {string} inputId
 * @param {string} errorId
 * @param {string} msg
 */
function marcarErro(inputId, errorId, msg) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);

  if (input) {
    input.classList.add('error');
    input.classList.remove('success');
    // Efeito shake
    input.classList.remove('shake');
    void input.offsetWidth; // force reflow
    input.classList.add('shake');
  }
  if (error) {
    error.textContent = msg.replace('⚠ ', ''); // remove ícone duplicado
    error.classList.add('active');
  }
}

/**
 * Marca um campo como válido.
 * @param {string} inputId
 * @param {string} errorId
 */
function marcarSucesso(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);

  if (input) {
    input.classList.remove('error', 'shake');
    input.classList.add('success');
  }
  if (error) error.classList.remove('active');
}

/** Limpa todos os estados de validação */
function limparValidacoes(...inputIds) {
  inputIds.forEach(id => {
    const input = document.getElementById(id);
    if (input) input.classList.remove('error', 'success', 'shake');
    const error = document.getElementById(id + 'Error');
    if (error) error.classList.remove('active');
  });
}

function configurarVisualizadorSenha() {
  const eyeIcon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3.2" stroke="currentColor" stroke-width="1.8"/></svg>`;
  const eyeOffIcon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 4l16 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;

  document.querySelectorAll('.password-toggle').forEach(toggle => {
    const target = toggle.dataset.target;
    const input = target ? document.getElementById(target) : toggle.closest('.password-wrapper')?.querySelector('input');
    if (!input) return;

    const atualizar = () => {
      const isHidden = input.type === 'password';
      toggle.innerHTML = isHidden ? eyeIcon : eyeOffIcon;
      toggle.setAttribute('aria-label', isHidden ? 'Mostrar senha' : 'Ocultar senha');
    };

    atualizar();
    toggle.addEventListener('click', () => {
      input.type = input.type === 'password' ? 'text' : 'password';
      atualizar();
    });
  });
}

/**
 * Ativa/desativa o loading no botão submit.
 * @param {string} btnId
 * @param {boolean} ativo
 * @param {string} textoOriginal
 */
function setBtnLoading(btnId, ativo, textoOriginal) {
  const btn = document.getElementById(btnId);
  if (!btn) return;

  if (ativo) {
    btn.classList.add('loading');
    btn.textContent = 'Aguarde...';
    btn.disabled = true;
  } else {
    btn.classList.remove('loading');
    btn.textContent = textoOriginal;
    btn.disabled = false;
  }
}

/* =====================================================
   LÓGICA DE LOGIN
   ===================================================== */

function iniciarLogin() {
  const form = document.getElementById('formLogin');
  if (!form) return;

  // Listener: limpa erro ao digitar
  ['email', 'senha'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('error', 'shake');
        document.getElementById(id + 'Error')?.classList.remove('active');
        limparAlerta();
      });
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    limparAlerta();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    let valido = true;

    // Validação: email
    if (!campoPreenchido(email)) {
      marcarErro('email', 'emailError', 'O email é obrigatório.');
      valido = false;
    } else if (!emailValido(email)) {
      marcarErro('email', 'emailError', 'Digite um email válido.');
      valido = false;
    } else {
      marcarSucesso('email', 'emailError');
    }

    // Validação: senha
    if (!campoPreenchido(senha)) {
      marcarErro('senha', 'senhaError', 'A senha é obrigatória.');
      valido = false;
    } else if (!senhaForte(senha)) {
      marcarErro('senha', 'senhaError', 'Senha deve ter ao menos 6 caracteres.');
      valido = false;
    } else {
      marcarSucesso('senha', 'senhaError');
    }

    if (!valido) {
      exibirAlerta('error', '🚫', 'Corrija os campos sinalizados para continuar.');
      return;
    }

    // Simula delay de rede (UX)
    setBtnLoading('btnEntrar', true, 'Entrar');
    await delay(700);

    // Verifica credenciais
    const usuario = buscarPorEmail(email);

    if (!usuario || usuario.senha !== senha) {
      setBtnLoading('btnEntrar', false, 'Entrar');
      exibirAlerta('error', '🔒', 'Email ou senha incorretos. Verifique suas credenciais.');
      marcarErro('email', 'emailError', '');
      marcarErro('senha', 'senhaError', '');
      return;
    }

    // Login bem-sucedido
    sessionStorage.setItem('usuario_logado', JSON.stringify({ nome: usuario.nome, email: usuario.email }));
    exibirAlerta('success', '✅', `Bem-vindo, ${usuario.nome}! Redirecionando...`);

    setTimeout(() => {
      // Aqui seria o redirecionamento real — simulado com alert
      alert(`✅ Login realizado com sucesso!\n\nBem-vindo, ${usuario.nome}!\n(Integrar com redirect para dashboard)`);
      setBtnLoading('btnEntrar', false, 'Entrar');
    }, 1200);
  });
}

/* =====================================================
   LÓGICA DE CADASTRO
   ===================================================== */

function iniciarCadastro() {
  const form = document.getElementById('formCadastro');
  if (!form) return;

  const senhaInput = document.getElementById('senha');

  // Atualiza barra de força ao digitar
  if (senhaInput) {
    senhaInput.addEventListener('input', () => {
      const forca = calcularForcaSenha(senhaInput.value);
      const barraContainer = document.getElementById('strengthContainer');
      const barraFill = document.getElementById('strengthFill');
      const barraLabel = document.getElementById('strengthLabel');

      if (barraContainer) {
        barraContainer.classList.toggle('active', senhaInput.value.length > 0);
      }
      if (barraFill) {
        barraFill.style.width = forca.pct || '0%';
        barraFill.style.background = forca.cor || '';
      }
      if (barraLabel) {
        barraLabel.textContent = forca.texto ? `Força da senha: ${forca.texto}` : '';
        barraLabel.style.color = forca.cor || '';
      }
    });
  }

  // Limpar erros ao digitar
  ['nome', 'email', 'senha', 'confirmarSenha'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('error', 'shake');
        document.getElementById(id + 'Error')?.classList.remove('active');
        limparAlerta();
      });
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    limparAlerta();

    const nome         = document.getElementById('nome').value;
    const email        = document.getElementById('email').value;
    const senha        = document.getElementById('senha').value;
    const confirmar    = document.getElementById('confirmarSenha').value;
    let valido = true;

    // Nome
    if (!campoPreenchido(nome)) {
      marcarErro('nome', 'nomeError', 'O nome é obrigatório.');
      valido = false;
    } else {
      marcarSucesso('nome', 'nomeError');
    }

    // Email
    if (!campoPreenchido(email)) {
      marcarErro('email', 'emailError', 'O email é obrigatório.');
      valido = false;
    } else if (!emailValido(email)) {
      marcarErro('email', 'emailError', 'Digite um email válido.');
      valido = false;
    } else if (buscarPorEmail(email)) {
      marcarErro('email', 'emailError', 'Verifique se você já tem uma conta com este email.');
      valido = false;
    } else {
      marcarSucesso('email', 'emailError');
    }

    // Senha
    if (!campoPreenchido(senha)) {
      marcarErro('senha', 'senhaError', 'A senha é obrigatória.');
      valido = false;
    } else if (!senhaForte(senha)) {
      marcarErro('senha', 'senhaError', 'Senha deve ter ao menos 6 caracteres.');
      valido = false;
    } else {
      marcarSucesso('senha', 'senhaError');
    }

    // Confirmar senha
    if (!campoPreenchido(confirmar)) {
      marcarErro('confirmarSenha', 'confirmarSenhaError', 'Confirme sua senha.');
      valido = false;
    } else if (senha !== confirmar) {
      marcarErro('confirmarSenha', 'confirmarSenhaError', 'As senhas não coincidem.');
      valido = false;
    } else {
      marcarSucesso('confirmarSenha', 'confirmarSenhaError');
    }

    if (!valido) {
      exibirAlerta('error', '🚫', 'Verifique os campos destacados antes de continuar.');
      return;
    }

    // Simula delay de rede
    setBtnLoading('btnCadastrar', true, 'Criar conta');
    await delay(800);

    // Salva usuário
    const usuarios = getUsuarios();
    usuarios.push({ nome: nome.trim(), email: email.trim().toLowerCase(), senha });
    salvarUsuarios(usuarios);

    exibirAlerta('success', '🎉', 'Conta criada com sucesso! Redirecionando para login...');
    form.reset();
    document.getElementById('strengthContainer')?.classList.remove('active');

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
  });
}

/* =====================================================
   LÓGICA DE RECUPERAÇÃO
   ===================================================== */

function iniciarRecuperacao() {
  const form = document.getElementById('formRecuperar');
  if (!form) return;

  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      emailInput.classList.remove('error', 'shake');
      document.getElementById('emailError')?.classList.remove('active');
      limparAlerta();
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    limparAlerta();

    const email = document.getElementById('email').value;
    let valido = true;

    if (!campoPreenchido(email)) {
      marcarErro('email', 'emailError', 'O email é obrigatório.');
      valido = false;
    } else if (!emailValido(email)) {
      marcarErro('email', 'emailError', 'Digite um email válido.');
      valido = false;
    } else {
      marcarSucesso('email', 'emailError');
    }

    if (!valido) {
      exibirAlerta('error', '🚫', 'Corrija o campo destacado para continuar.');
      return;
    }

    setBtnLoading('btnRecuperar', true, 'Enviar instruções');
    await delay(900);

    const usuario = buscarPorEmail(email);

    if (!usuario) {
      setBtnLoading('btnRecuperar', false, 'Enviar instruções');
      exibirAlerta('error', '📭', 'Não encontramos nenhuma conta com esse email.');
      marcarErro('email', 'emailError', 'Email não cadastrado.');
      return;
    }

    // Simula envio bem-sucedido
    setBtnLoading('btnRecuperar', false, 'Enviar instruções');
    exibirAlerta(
      'success',
      '📬',
      `Instruções de recuperação foram enviadas para ${email}. Verifique sua caixa de entrada.`
    );
    form.reset();
  });
}

/* =====================================================
   UTILITÁRIO — DELAY (simulação de rede)
   ===================================================== */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* =====================================================
   INICIALIZAÇÃO — Detecta qual tela está carregada
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Garante que o usuário padrão existe no storage
  getUsuarios();

  const body = document.body;

  configurarVisualizadorSenha();
  if (body.dataset.page === 'login')      iniciarLogin();
  if (body.dataset.page === 'cadastro')   iniciarCadastro();
  if (body.dataset.page === 'recuperar')  iniciarRecuperacao();
});
