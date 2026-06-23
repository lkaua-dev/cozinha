/* ============================================================
  MERCADO - Login Controller
  login_geral.js
   ============================================================ */

'use strict';

const LEGACY_AUTH_KEY = 'cozinha-auth-token';
const AUTH_FLAG_KEY = 'cozinha-authenticated';
const AUTH_MODE_KEY = 'cozinha-auth-mode';
const USER_KEY = 'cozinha-user';
const DEMO_MODE = 'demo';
const REAL_MODE = 'cookie';

const SAFE_LOGIN_RE = /^[a-zA-Z0-9@._-]{3,120}$/;
const EMAIL_RE = /^[^\s@]{3,120}@[^\s@]{2,120}\.[^\s@]{2,20}$/;

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

function migrateLegacyAuth() {
  const legacyToken = localStorage.getItem(LEGACY_AUTH_KEY);
  if (!legacyToken) return;

  sessionStorage.setItem(AUTH_FLAG_KEY, 'true');
  sessionStorage.setItem(AUTH_MODE_KEY, legacyToken === 'demo-token' ? DEMO_MODE : REAL_MODE);
  localStorage.removeItem(LEGACY_AUTH_KEY);
}

function isLoggedIn() {
  migrateLegacyAuth();
  return sessionStorage.getItem(AUTH_FLAG_KEY) === 'true';
}

if (window.history && window.history.replaceState) {
  window.history.replaceState(null, '', window.location.href);
}

if (isLoggedIn()) {
  window.location.replace('dashboard.html');
}

function setFieldError(fieldEl, errEl, msg) {
  fieldEl.classList.add('has-error');
  errEl.textContent = msg;
}

function clearFieldError(fieldEl, errEl) {
  fieldEl.classList.remove('has-error');
  if (errEl) errEl.textContent = '';
}

function normalizarLogin(value) {
  return String(value || '').trim().slice(0, 120);
}

function normalizarSenha(value) {
  return String(value || '').slice(0, 128);
}

function isDemoCredential(user, password) {
  const validDemoUsers = ['admin', 'cozinha@teste.com'];
  return validDemoUsers.includes(user.toLowerCase()) && password === '123456';
}

function showToast(msg, type = 'info') {
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast ${['success', 'error', 'info'].includes(type) ? type : 'info'}`;

  const icon = document.createElement('i');
  icon.textContent = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ⓘ';

  const msgSpan = document.createElement('span');
  msgSpan.className = 'toast-msg';
  msgSpan.textContent = String(msg).slice(0, 180);

  toast.append(icon, msgSpan);
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function setLoading(state) {
  btnLogin.classList.toggle('loading', state);
  btnLogin.replaceChildren();

  if (state) {
    const spinner = document.createElement('span');
    spinner.className = 'spinner';
    btnLogin.append(spinner, document.createTextNode(' Entrando...'));
    return;
  }

  btnLogin.textContent = 'Entrar';
}

function validateFields() {
  let valid = true;

  clearFieldError(fieldUser, errUser);
  clearFieldError(fieldPass, errPass);

  const userVal = normalizarLogin(inputUser.value);
  const passVal = normalizarSenha(inputPass.value);

  if (!userVal || !SAFE_LOGIN_RE.test(userVal)) {
    setFieldError(fieldUser, errUser, 'Informe um usuário ou e-mail válido.');
    valid = false;
  }

  if (!passVal || passVal.length < 4 || passVal.length > 128) {
    setFieldError(fieldPass, errPass, 'Informe uma senha válida.');
    valid = false;
  }

  return valid;
}

async function authenticate(user, password) {
  if (isDemoCredential(user, password)) {
    return { success: true, email: user, mode: DEMO_MODE };
  }

  if (!EMAIL_RE.test(user)) {
    return { success: false };
  }

  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user.toLowerCase(),
        senha: password
      })
    });

    if (!response.ok) return { success: false };

    const data = await response.json();
    return { success: true, email: data.usuario || user, mode: REAL_MODE };
  } catch {
    return { success: false };
  }
}

function salvarSessao(authResult) {
  sessionStorage.setItem(AUTH_FLAG_KEY, 'true');
  sessionStorage.setItem(AUTH_MODE_KEY, authResult.mode || REAL_MODE);
  sessionStorage.setItem(USER_KEY, JSON.stringify({ email: authResult.email }));
  localStorage.removeItem(LEGACY_AUTH_KEY);
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (!validateFields()) return;

  const userVal = normalizarLogin(inputUser.value);
  const passVal = normalizarSenha(inputPass.value);

  setLoading(true);

  setTimeout(async function () {
    const authResult = await authenticate(userVal, passVal);
    setLoading(false);

    if (authResult.success) {
      salvarSessao(authResult);
      showToast('Login realizado com sucesso! Redirecionando...', 'success');
      setTimeout(function () {
        window.location.replace('dashboard.html');
      }, 1200);
      return;
    }

    showToast('Usuário ou senha incorretos. Tente novamente.', 'error');
    fieldUser.classList.add('has-error');
    fieldPass.classList.add('has-error');
    errUser.textContent = '';
    errPass.textContent = '';
    form.classList.add('shake');
    setTimeout(() => form.classList.remove('shake'), 500);
  }, 650);
});

inputUser.addEventListener('input', function () {
  clearFieldError(fieldUser, errUser);
});

inputPass.addEventListener('input', function () {
  clearFieldError(fieldPass, errPass);
});

function createEyeIcon(hidden) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '18');
  svg.setAttribute('height', '18');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');

  const addPath = (d) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
  };

  if (hidden) {
    addPath('M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '12');
    circle.setAttribute('cy', '12');
    circle.setAttribute('r', '3');
    svg.appendChild(circle);
  } else {
    addPath('M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94');
    addPath('M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19');
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '1');
    line.setAttribute('y1', '1');
    line.setAttribute('x2', '23');
    line.setAttribute('y2', '23');
    svg.appendChild(line);
  }

  return svg;
}

togglePwd.addEventListener('click', function () {
  const isText = inputPass.type === 'text';
  inputPass.type = isText ? 'password' : 'text';
  togglePwd.setAttribute('aria-label', isText ? 'Mostrar senha' : 'Ocultar senha');
  togglePwd.replaceChildren(createEyeIcon(isText));
});
