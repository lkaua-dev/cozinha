/* ============================================================
  MERCADO — Login Controller
  login_geral.js
   ============================================================ */

'use strict';

const AUTH_KEY = 'cozinha-auth-token';
const USER_KEY = 'cozinha-user';
const DEMO_TOKEN = 'demo-token';

function isLoggedIn() {
  return !!localStorage.getItem(AUTH_KEY);
}

if (window.history && window.history.replaceState) {
  window.history.replaceState(null, '', window.location.href);
}

if (isLoggedIn()) {
  window.location.replace('dashboard.html');
}

// ── Seletores ──────────────────────────────────────────────────
const form = document.getElementById('form-login');
const inputUser = document.getElementById('input-user');
const inputPass = document.getElementById('input-pass');
const btnLogin = document.getElementById('btn-login');
const toastContainer = document.getElementById('toast-container');
const fieldUser = document.getElementById('field-user');
const fieldPass = document.getElementById('field-pass');
const errUser = document.getElementById('err-user');
const errPass = document.getElementById('err-pass');
const togglePwd = document.getElementById('toggle-pwd');

// ── Utilitários ────────────────────────────────────────────────
function setFieldError(fieldEl, errEl, msg) {
  fieldEl.classList.add('has-error');
  errEl.textContent = msg;
}

function clearFieldError(fieldEl) {
  fieldEl.classList.remove('has-error');
}

// ── Toast Notification ────────────────────────────────────────
function showToast(msg, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icon = document.createElement('i');
  if (type === 'success') {
    icon.innerHTML = '✓';
  } else if (type === 'error') {
    icon.innerHTML = '✕';
  } else {
    icon.innerHTML = 'ⓘ';
  }

  const msgSpan = document.createElement('span');
  msgSpan.className = 'toast-msg';
  msgSpan.textContent = msg;

  toast.appendChild(icon);
  toast.appendChild(msgSpan);
  toastContainer.appendChild(toast);

  // Auto-remover após 4 segundos
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function setLoading(state) {
  if (state) {
    btnLogin.classList.add('loading');
    btnLogin.innerHTML = '<span class="spinner"></span> Entrando...';
  } else {
    btnLogin.classList.remove('loading');
    btnLogin.innerHTML = 'Entrar';
  }
}

// ── Validação dos campos ───────────────────────────────────────
function validateFields() {
  let valid = true;

  clearFieldError(fieldUser);
  clearFieldError(fieldPass);

  const userVal = inputUser.value.trim();
  const passVal = inputPass.value;

  if (!userVal) {
    setFieldError(fieldUser, errUser, 'Informe seu usuário ou e-mail.');
    valid = false;
  }

  if (!passVal) {
    setFieldError(fieldPass, errPass, 'Informe sua senha.');
    valid = false;
  }

  return valid;
}

// ── Autenticação ──────────────────────────────────────
async function authenticate(user, password) {
  // Credenciais demo exibidas na tela de login.
  const validDemoUsers = ['admin', 'cozinha@teste.com'];
  const demoPassword = '123456';

  if (validDemoUsers.includes(user) && password === demoPassword) {
    return { success: true, token: DEMO_TOKEN, email: user };
  }

  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user,
        senha: password
      })
    });

    if (!response.ok) {
      return { success: false };
    }

    const data = await response.json();
    return { success: true, token: data.token || DEMO_TOKEN, email: data.usuario || user };
  } catch (error) {
    return { success: false };
  }
}

// ── Submit ─────────────────────────────────────────────────────
form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (!validateFields()) return;

  const userVal = inputUser.value.trim();
  const passVal = inputPass.value;

  setLoading(true);

  // Simula delay de rede (650ms)
  setTimeout(async function () {
    setLoading(false);

    const authResult = await authenticate(userVal, passVal);
    if (authResult.success) {
      localStorage.setItem(AUTH_KEY, authResult.token);
      localStorage.setItem(USER_KEY, JSON.stringify({ email: authResult.email }));
      showToast('Login realizado com sucesso! Redirecionando...', 'success');
      // Redireciona após breve feedback
      setTimeout(function () {
        window.location.replace('dashboard.html');
      }, 1200);
    } else {
      showToast('Usuário ou senha incorretos. Tente novamente.', 'error');
      // Destaca os campos
      fieldUser.classList.add('has-error');
      fieldPass.classList.add('has-error');
      errUser.textContent = '';
      errPass.textContent = '';
      // Agita visualmente o formulário
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
    }
  }, 650);
});

// ── Limpa erros ao digitar ─────────────────────────────────────
inputUser.addEventListener('input', function () {
  clearFieldError(fieldUser);
});

inputPass.addEventListener('input', function () {
  clearFieldError(fieldPass);
});

// ── Toggle senha ───────────────────────────────────────────────
togglePwd.addEventListener('click', function () {
  const isText = inputPass.type === 'text';
  inputPass.type = isText ? 'password' : 'text';
  togglePwd.setAttribute('aria-label', isText ? 'Mostrar senha' : 'Ocultar senha');

  // Troca ícone
  togglePwd.innerHTML = isText
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>`;
});