// ============================================================
// CatiraX — index.js (Melhorado)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Referências ────────────────────────────────────────────
  const navTriggers    = document.querySelectorAll('.nav-trigger');
  const paginas        = document.querySelectorAll('.pagina');
  const navLinks       = document.querySelectorAll('.nav-link');
  const hamburgerBtn   = document.getElementById('hamburger-btn');
  const navMenu        = document.getElementById('nav-menu');
  const navOverlay     = document.getElementById('nav-overlay');
  const scrollProgress = document.getElementById('scroll-progress');
  const header         = document.getElementById('header');
  const desktopQuery   = window.matchMedia('(min-width: 901px)');
  let scrollTicking    = false;

  // ── Navegação entre páginas ────────────────────────────────
  function mostrarPagina(targetId) {
    // Esconder todas
    paginas.forEach(p => p.classList.remove('animando'));

    // Mostrar a selecionada
    const alvo = document.getElementById(targetId);
    if (alvo) {
      // Forçar reflow para reiniciar a animação
      void alvo.offsetWidth;
      alvo.classList.add('animando');

      // Resetar e re-observar cards da nova página
      setTimeout(() => triggerRevealObserver(), 50);

      // Animar progress bars se for a seção de metas
      if (targetId === 'solucoes') {
        setTimeout(animarProgressBars, 300);
      }
    }

    // Atualizar nav ativo
    navLinks.forEach(link => {
      link.classList.toggle('ativo', link.getAttribute('data-target') === targetId);
    });

    // Travar scroll na seção de metas apenas no desktop.
    document.body.classList.toggle('no-scroll', targetId === 'solucoes' && desktopQuery.matches);

    // Fechar menu mobile
    fecharMenuMobile();

    // No mobile, rolagem instantânea evita briga com o gesto do dedo.
    window.scrollTo({ top: 0, behavior: desktopQuery.matches ? 'smooth' : 'auto' });
  }

  // Event listeners de navegação
  navTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-target');
      if (targetId) mostrarPagina(targetId);
    });
  });

  // Mostrar página inicial
  const primeiraPagina = paginas[0];
  if (primeiraPagina) mostrarPagina(primeiraPagina.id);

  // ── Menu Mobile (Hamburger) ────────────────────────────────
  function abrirMenuMobile() {
    hamburgerBtn.classList.add('open');
    navMenu.classList.add('mobile-open');
    navOverlay.classList.add('visible');
    navOverlay.style.display = 'block';
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function fecharMenuMobile() {
    hamburgerBtn.classList.remove('open');
    navMenu.classList.remove('mobile-open');
    navOverlay.classList.remove('visible');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    // Aguardar transição antes de esconder
    setTimeout(() => {
      if (!navMenu.classList.contains('mobile-open')) {
        navOverlay.style.display = '';
      }
    }, 300);
  }

  function toggleMenu() {
    if (navMenu.classList.contains('mobile-open')) {
      fecharMenuMobile();
    } else {
      abrirMenuMobile();
    }
  }

  hamburgerBtn?.addEventListener('click', toggleMenu);
  navOverlay?.addEventListener('click', fecharMenuMobile);

  // Fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharMenuMobile();
  });

  // ── Scroll Progress Bar ────────────────────────────────────
  function atualizarScrollProgress() {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const progress     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgress) {
      scrollProgress.style.transform = `scaleX(${Math.min(progress, 100) / 100})`;
      scrollProgress.setAttribute('aria-valuenow', Math.round(progress));
    }

    // Header sombra ao rolar
    if (header) {
      header.classList.toggle('scrolled', scrollTop > 20);
    }
  }

  function solicitarScrollProgress() {
    if (scrollTicking) return;

    scrollTicking = true;
    window.requestAnimationFrame(() => {
      atualizarScrollProgress();
      scrollTicking = false;
    });
  }

  window.addEventListener('scroll', solicitarScrollProgress, { passive: true });

  // ── Scroll Reveal (IntersectionObserver) ──────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  function triggerRevealObserver() {
    // Remover classes existentes para poder re-animar ao trocar de aba
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('visible');
    });

    // Adicionar classe reveal nos elementos da página visível
    const paginaAtiva = document.querySelector('.pagina.animando');
    if (!paginaAtiva) return;

    const elementos = paginaAtiva.querySelectorAll(
      '.meta-card, .team-member, .feature-card, .stat-item, .split-text, .split-image'
    );

    if (!desktopQuery.matches) {
      elementos.forEach(el => {
        el.classList.add('reveal', 'visible');
        el.style.transitionDelay = '0ms';
      });
      return;
    }

    elementos.forEach((el, idx) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        // Delay escalonado
        const delay = Math.min(idx * 80, 400);
        el.style.transitionDelay = `${delay}ms`;
      }
      // Forçar reobservação
      revealObserver.observe(el);
    });
  }

  // ── Progress Bars (seção de metas) ────────────────────────
  function animarProgressBars() {
    document.querySelectorAll('.progress-bar').forEach(bar => {
      const progress = bar.getAttribute('data-progress');
      if (progress) {
        bar.style.setProperty('--progress-width', `${progress}%`);
        // Força reflow antes de adicionar classe
        void bar.offsetWidth;
        bar.classList.add('animated');
      }
    });
  }

  // ── Efeito Ripple nos Botões ───────────────────────────────
  function adicionarRipple(e) {
    const btn  = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x    = e.clientX - rect.left - size / 2;
    const y    = e.clientY - rect.top  - size / 2;

    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    Object.assign(ripple.style, {
      width:  `${size}px`,
      height: `${size}px`,
      left:   `${x}px`,
      top:    `${y}px`,
    });

    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);

    ripple.addEventListener('animationend', () => ripple.remove());
  }

  document.querySelectorAll('.btn-acao1, .btn-entrar').forEach(btn => {
    btn.addEventListener('click', adicionarRipple);
  });

  // ── Keyboard: logo navega para home ───────────────────────
  document.querySelector('.logo')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      mostrarPagina('home');
    }
  });

  // ── Fechar menu ao redimensionar para desktop ──────────────
  desktopQuery.addEventListener('change', (e) => {
    if (e.matches) fecharMenuMobile();

    const paginaAtiva = document.querySelector('.pagina.animando')?.id;
    document.body.classList.toggle('no-scroll', paginaAtiva === 'solucoes' && e.matches);
  });

  // ── Inicialização ──────────────────────────────────────────
  atualizarScrollProgress();
  setTimeout(triggerRevealObserver, 100);

});
