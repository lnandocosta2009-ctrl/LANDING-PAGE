/**
 * PORTFÓLIO LUIZ FERNANDO (LF) — SCRIPT PRINCIPAL
 * Funcionalidades:
 * 1. Introdução cinematográfica com LF e indicador de progresso
 * 2. Efeitos de cursor interativo (inspirado na Cartier)
 * 3. Sistema de degradê e iluminação dinâmicos vinculados à rolagem (Belgrade Arbor)
 * 4. Apresentação cinematográfica de projetos controlada pelo scroll (1 por vez)
 * 5. Linha do tempo interativa da evolução na TI
 * 6. Navegação com destaque de seção ativa e menu responsivo
 * 7. Botão "Voltar ao topo" e observador de revelação suave
 */

(function () {
  'use strict';

  // ==============================================================
  // 1. CONFIGURAÇÕES GLOBAIS E ESTADO
  // ==============================================================
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Atualizar ano atual no rodapé
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // ==============================================================
  // 2. INTRODUÇÃO CINEMATOGRÁFICA LF (Lando Norris style)
  // ==============================================================
  const introScreen = document.getElementById('introScreen');
  const introProgressFill = document.getElementById('introProgressFill');
  const introCounter = document.getElementById('introCounter');
  const introSkipBtn = document.getElementById('introSkipBtn');

  function finishIntro() {
    if (!introScreen) return;
    document.body.classList.remove('is-loading');
    introScreen.classList.add('intro-screen--exit');
    setTimeout(() => {
      introScreen.style.display = 'none';
    }, 850);
  }

  if (introScreen) {
    if (isReducedMotion) {
      finishIntro();
    } else {
      let count = 0;
      const duration = 1300; // 1.3s total
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        count = Math.floor(progress * 100);

        if (introProgressFill) introProgressFill.style.width = count + '%';
        if (introCounter) introCounter.textContent = count + '%';

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          setTimeout(finishIntro, 180);
        }
      }

      requestAnimationFrame(updateCounter);

      if (introSkipBtn) {
        introSkipBtn.addEventListener('click', finishIntro);
      }

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !introScreen.classList.contains('intro-screen--exit')) {
          finishIntro();
        }
      });
    }
  }

  // ==============================================================
  // 3. CURSOR INTERATIVO (Inspirado na Cartier)
  // ==============================================================
  const cursor = document.getElementById('customCursor');
  const cursorLabel = document.getElementById('cursorLabel');

  if (cursor && isFinePointer && !isReducedMotion) {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = mouseX;
    let ringY = mouseY;
    let isVisible = false;

    const dot = cursor.querySelector('.cursor-dot');
    const ring = cursor.querySelector('.cursor-ring');

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        cursor.style.opacity = '1';
        isVisible = true;
        ringX = mouseX;
        ringY = mouseY;
      }

      // Atualização imediata no ponteiro do mouse: 0ms de latência, precisão cirúrgica
      if (dot) {
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      isVisible = false;
    });

    // Animação suave com amortecimento para a auréola (ring) do cursor
    function animateCursorRing() {
      if (isVisible) {
        ringX += (mouseX - ringX) * 0.22;
        ringY += (mouseY - ringY) * 0.22;

        if (ring) {
          ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0)`;
        }
      }

      requestAnimationFrame(animateCursorRing);
    }
    requestAnimationFrame(animateCursorRing);

    // Efeito de expansão ao passar por elementos interativos
    const interactiveTargets = document.querySelectorAll(
      'a, button, .photo-composition, .project-card, .cinema-card, .skill-card, .objectives-card, [data-cursor-text]'
    );

    interactiveTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hovering');
        const customText = el.getAttribute('data-cursor-text');
        if (cursorLabel) {
          cursorLabel.textContent = customText || '';
        }
      });

      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hovering');
        if (cursorLabel) {
          cursorLabel.textContent = '';
        }
      });
    });
  }

  // ==============================================================
  // 4. SISTEMA DE FUNDO DINÂMICO & DEGRADÊS (Belgrade Arbor)
  // ==============================================================
  const glow1 = document.getElementById('glow1');
  const glow2 = document.getElementById('glow2');
  const glow3 = document.getElementById('glow3');
  const scrollProgressLine = document.getElementById('scrollProgressLine');

  function updateDynamicBackground(scrollProgress) {
    if (isReducedMotion) return;

    if (glow1) {
      const yOffset1 = scrollProgress * 180;
      const xOffset1 = Math.sin(scrollProgress * Math.PI * 2) * 60;
      glow1.style.transform = `translate(${xOffset1}px, ${yOffset1}px)`;
    }

    if (glow2) {
      const yOffset2 = -scrollProgress * 220;
      const xOffset2 = Math.cos(scrollProgress * Math.PI * 2) * 80;
      glow2.style.transform = `translate(${xOffset2}px, ${yOffset2}px)`;
    }

    if (glow3) {
      const yOffset3 = Math.sin(scrollProgress * Math.PI) * 120;
      glow3.style.transform = `translate(0px, ${yOffset3}px)`;
    }
  }

  // ==============================================================
  // 5. APRESENTAÇÃO CINEMATOGRÁFICA DOS PROJETOS (Sticky Scroll)
  // ==============================================================
  const cinemaTracks = document.querySelectorAll('.cinema-track');

  function updateCinematicProjects() {
    if (window.innerWidth <= 992 || isReducedMotion) {
      // Em telas menores, limpa transforms inline para garantir responsividade perfeita
      cinemaTracks.forEach((track) => {
        const mediaCol = track.querySelector('.cinema-media-col');
        const infoCol = track.querySelector('.cinema-info-col');
        if (mediaCol) mediaCol.style.transform = '';
        if (infoCol) {
          infoCol.style.opacity = '';
          infoCol.style.transform = '';
          infoCol.style.pointerEvents = '';
        }
      });
      return;
    }

    cinemaTracks.forEach((track) => {
      const rect = track.getBoundingClientRect();
      const totalScrollable = track.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      let progress = currentScroll / totalScrollable;
      progress = Math.max(0, Math.min(1, progress));

      const mediaCol = track.querySelector('.cinema-media-col');
      const infoCol = track.querySelector('.cinema-info-col');

      if (!mediaCol || !infoCol) return;

      // No início (progress = 0), a imagem começa centralizada na composição
      // Conforme o scroll avança (progress 0 -> 0.6), ela se move para a esquerda (posição natural)
      // E a coluna de descrição surge à direita suavemente
      const transitionProgress = Math.min(1, Math.max(0, progress / 0.55));

      // Deslocamento da capa: de +32% (centralizada) para 0% (à esquerda)
      const mediaTranslateX = (1 - transitionProgress) * 32;
      const mediaScale = 1.04 - (1 - transitionProgress) * 0.04;

      // Revelação da descrição: opacidade de 0 a 1 e slide lateral
      const infoOpacity = Math.min(1, Math.max(0, (transitionProgress - 0.2) / 0.8));
      const infoTranslateX = (1 - transitionProgress) * 50;

      mediaCol.style.transform = `translateX(${mediaTranslateX}%) scale(${mediaScale})`;
      infoCol.style.opacity = infoOpacity;
      infoCol.style.transform = `translateX(${infoTranslateX}px)`;
      infoCol.style.pointerEvents = infoOpacity > 0.4 ? 'auto' : 'none';
    });
  }

  // ==============================================================
  // 6. LINHA DO TEMPO DA EVOLUÇÃO NA TI (Desenho progressivo)
  // ==============================================================
  const timelineSection = document.getElementById('trajetoria');
  const timelineTrackFill = document.getElementById('timelineTrackFill');
  const timelineItems = document.querySelectorAll('.timeline-item');

  function updateTimelineProgress() {
    if (!timelineSection || !timelineTrackFill) return;

    const rect = timelineSection.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    const windowH = window.innerHeight;

    // Progresso relativo ao ponto central da tela
    let progress = (windowH * 0.65 - sectionTop) / (sectionHeight * 0.85);
    progress = Math.max(0, Math.min(1, progress));

    timelineTrackFill.style.height = (progress * 100) + '%';

    // Ilumina os nós alcançados pela linha e desativa ao subir a página
    timelineItems.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      const itemTriggerPoint = itemRect.top + itemRect.height * 0.5;

      if (itemTriggerPoint < windowH * 0.7) {
        item.classList.add('is-active');
      } else {
        item.classList.remove('is-active');
      }
    });
  }

  // ==============================================================
  // 7. BOTÃO "VOLTAR AO TOPO" (Preservado)
  // ==============================================================
  const btnTopo = document.getElementById('btnTopo');

  if (btnTopo) {
    btnTopo.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: isReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  function updateBackToTop(scrollY) {
    if (!btnTopo) return;
    if (scrollY > 350) {
      btnTopo.classList.add('is-visible');
    } else {
      btnTopo.classList.remove('is-visible');
    }
  }

  // ==============================================================
  // 8. ROLAGEM GLOBAL COORDENADA (rAF otimizado)
  // ==============================================================
  let isScrolling = false;

  function onGlobalScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const globalProgress = docHeight > 0 ? scrollY / docHeight : 0;

    // Atualiza linha de progresso no topo da tela
    if (scrollProgressLine) {
      scrollProgressLine.style.width = (globalProgress * 100) + '%';
    }

    updateBackToTop(scrollY);
    updateDynamicBackground(globalProgress);
    updateCinematicProjects();
    updateTimelineProgress();
    updateActiveNav();

    isScrolling = false;
  }

  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(onGlobalScroll);
      isScrolling = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(onGlobalScroll);
      isScrolling = true;
    }
  }, { passive: true });

  // Disparo inicial
  window.requestAnimationFrame(onGlobalScroll);

  // ==============================================================
  // 9. NAVEGAÇÃO SUPERIOR & SEÇÕES ATIVAS
  // ==============================================================
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollPosition = window.scrollY + 200;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('is-active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('is-active');
          }
        });
      }
    });
  }

  // Menu móvel toggle
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Fecha o menu ao clicar em qualquer link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ==============================================================
  // 10. REVELAÇÃO SUAVE DE ELEMENTOS (IntersectionObserver)
  // ==============================================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback para navegadores antigos
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  // ==============================================================
  // 11. EFEITO SPOTLIGHT / TILT 3D SUTIL EM CARTÕES
  // ==============================================================
  if (isFinePointer && !isReducedMotion) {
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

})();