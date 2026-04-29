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
  let headerScrolled   = false;
  let pageTransitionTimeout;
  const touchNavigation = new WeakMap();
  const scrollGestureLimit = 10;

  // ── Navegação entre páginas ────────────────────────────────
  function ativarPagina(targetId) {
    const alvo = document.getElementById(targetId);
    if (alvo) {
      paginas.forEach(p => p.classList.remove('animando', 'saindo'));
      void alvo.offsetWidth;
      alvo.classList.add('animando');

      // Resetar e re-observar cards da nova página
      setTimeout(() => triggerRevealObserver(), 50);

      // Animar progress bars se for a seção de metas
      if (targetId === 'solucoes') {
        setTimeout(animarProgressBars, 300);
      }
    }
  }

  function atualizarNavegacao(targetId) {
    // Atualizar nav ativo
    navLinks.forEach(link => {
      link.classList.toggle('ativo', link.getAttribute('data-target') === targetId);
    });

    // Travar scroll na seção de metas apenas no desktop.
    document.body.classList.toggle('no-scroll', targetId === 'solucoes' && desktopQuery.matches);
  }

  function mostrarPagina(targetId, instantaneo = false) {
    // Fechar menu mobile
    fecharMenuMobile();

    const paginaAtual = document.querySelector('.pagina.animando');
    const mesmaPagina = paginaAtual?.id === targetId;

    if (mesmaPagina) {
      window.scrollTo({ top: 0, behavior: desktopQuery.matches ? 'smooth' : 'auto' });
      return;
    }

    clearTimeout(pageTransitionTimeout);
    atualizarNavegacao(targetId);

    const finalizarTroca = () => {
      ativarPagina(targetId);
      window.scrollTo({ top: 0, behavior: desktopQuery.matches ? 'smooth' : 'auto' });
    };

    if (instantaneo || !paginaAtual) {
      finalizarTroca();
      return;
    }

    paginaAtual.classList.add('saindo');
    pageTransitionTimeout = setTimeout(finalizarTroca, desktopQuery.matches ? 180 : 130);
  }

  // Event listeners de navegação
  navTriggers.forEach(trigger => {
    trigger.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      if (!touch) return;

      touchNavigation.set(trigger, {
        moved: false,
        x: touch.clientX,
        y: touch.clientY,
      });
    }, { passive: true });

    trigger.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      const state = touchNavigation.get(trigger);
      if (!touch || !state) return;

      const movedX = Math.abs(touch.clientX - state.x);
      const movedY = Math.abs(touch.clientY - state.y);

      if (movedX > scrollGestureLimit || movedY > scrollGestureLimit) {
        state.moved = true;
      }
    }, { passive: true });

    trigger.addEventListener('touchend', () => {
      setTimeout(() => touchNavigation.delete(trigger), 350);
    }, { passive: true });

    trigger.addEventListener('click', (e) => {
      const touchState = touchNavigation.get(trigger);
      if (touchState?.moved) {
        e.preventDefault();
        e.stopImmediatePropagation();
        touchNavigation.delete(trigger);
        return;
      }

      e.preventDefault();
      const targetId = trigger.getAttribute('data-target');
      if (targetId) mostrarPagina(targetId);
    });
  });

  // Mostrar página inicial
  const primeiraPagina = paginas[0];
  if (primeiraPagina) mostrarPagina(primeiraPagina.id, true);

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

    if (scrollProgress && desktopQuery.matches) {
      scrollProgress.style.transform = `scaleX(${Math.min(progress, 100) / 100})`;
      scrollProgress.setAttribute('aria-valuenow', Math.round(progress));
    }

    const shouldBeScrolled = scrollTop > 20;
    if (header && shouldBeScrolled !== headerScrolled) {
      headerScrolled = shouldBeScrolled;
      header.classList.toggle('scrolled', headerScrolled);
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
