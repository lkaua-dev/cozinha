/* ============================================================
  MERCADO — Login Controller
  login_geral.js
   ============================================================ */

'use strict';


// ── Seletores ──────────────────────────────────────────────────
const form = document.getElementById('form-login');
const inputUser = document.getElementById('input-user');
const inputPass = document.getElementById('input-pass');
const btnLogin = document.getElementById('btn-login');
const alertBox = document.getElementById('alert-global');
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

function showAlert(msg, type = 'error') {
  alertBox.textContent = '';

  // Ícone SVG inline
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('width', '18');
  icon.setAttribute('height', '18');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('fill', 'none');
  icon.setAttribute('stroke', 'currentColor');
  icon.setAttribute('stroke-width', '2');
  icon.setAttribute('stroke-linecap', 'round');
  icon.setAttribute('stroke-linejoin', 'round');
  icon.setAttribute('style', 'flex-shrink:0; margin-top:1px');
  icon.setAttribute('aria-hidden', 'true');

  if (type === 'error') {
    icon.innerHTML = '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>';
  } else {
    icon.innerHTML = '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>';
  }

  const span = document.createElement('span');
  span.textContent = msg;

  alertBox.appendChild(icon);
  alertBox.appendChild(span);
  alertBox.className = `alert alert-${type} show`;
}

function hideAlert() {
  alertBox.classList.remove('show');
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
  hideAlert();

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
  const response = await fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      usuario: user,
      senha: password
    })
  });

  return response.ok;
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

    if (await authenticate(userVal, passVal)) {
      showAlert('Login realizado com sucesso! Redirecionando...', 'success');
      // Redireciona após breve feedback
      setTimeout(function () {
        window.location.href = '../dashboard.html';
      }, 1200);
    } else {
      showAlert('Usuário ou senha incorretos. Verifique e tente novamente.');
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
  hideAlert();
});

inputPass.addEventListener('input', function () {
  clearFieldError(fieldPass);
  hideAlert();
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