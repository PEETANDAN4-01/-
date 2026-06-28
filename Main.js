/* ===================================================
   Dark Games Hub — main.js
   JavaScript สำหรับ animation และ interaction ทั้งเว็บ
=================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- Scroll-reveal (IntersectionObserver) ----- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  /* ----- Stat bar fill (hero + popular page) ----- */
  const bars = document.querySelectorAll('.stat-bar-fill');
  if (bars.length) {
    const barIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('animate');
          barIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(b => barIO.observe(b));
  }

  /* ----- Counter animation (hero stats) ----- */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const isDecimal = String(target).includes('.');
    const duration = 1400;
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3); // ease-out-cubic
      const val = target * ease;
      el.textContent = (isDecimal ? val.toFixed(1) : Math.floor(val)) + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('.count-up');
  if (counters.length) {
    const cIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          cIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cIO.observe(c));
  }

  /* ----- Floating particles (hero) ----- */
  const particleContainer = document.querySelector('.hero-particles');
  if (particleContainer) {
    const colors = ['#9f67ff', '#06b6d4', '#ffffff'];
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${Math.random() * 100}%;
        bottom: -10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        --dur: ${Math.random() * 6 + 7}s;
        --delay: ${Math.random() * 8}s;
      `;
      particleContainer.appendChild(p);
    }
  }

  /* ----- Navbar active link ----- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });

  /* ----- Filter buttons (index + categories page) ----- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // remove active from siblings in same bar
      btn.closest('.filter-bar').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const genre = btn.dataset.genre;
      const cards = document.querySelectorAll('.game-card[data-genre], .featured-card[data-genre]');

      cards.forEach(card => {
        const match = genre === 'all' || card.dataset.genre === genre;
        card.style.transition = 'opacity 0.3s, transform 0.3s';
        if (match) {
          card.style.opacity = '1';
          card.style.transform = '';
          card.style.pointerEvents = '';
        } else {
          card.style.opacity = '0.2';
          card.style.transform = 'scale(0.96)';
          card.style.pointerEvents = 'none';
        }
      });
    });
  });

  /* ----- Card click → game detail page ----- */
  document.querySelectorAll('[data-game-id]').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.gameId;
      window.location.href = `game.html?id=${id}`;
    });
  });

  /* ----- Navbar scroll shadow ----- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 20
        ? '0 4px 24px rgba(0,0,0,0.5)'
        : 'none';
    }, { passive: true });
  }

  /* ----- Stagger card entrance ----- */
  const staggerCards = document.querySelectorAll('.game-grid .game-card, .featured-grid .featured-card');
  staggerCards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.45s ${i * 0.07}s ease, transform 0.45s ${i * 0.07}s ease`;
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 80 + i * 70);
  });

  /* ----- Rank list stagger (popular page) ----- */
  const rankItems = document.querySelectorAll('.rank-item');
  rankItems.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-16px)';
    item.style.transition = `opacity 0.4s ${i * 0.06}s ease, transform 0.4s ${i * 0.06}s ease`;
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
    }, 100 + i * 60);
  });

  /* ----- Category card stagger ----- */
  const catCards = document.querySelectorAll('.category-card');
  catCards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.94)';
    card.style.transition = `opacity 0.4s ${i * 0.06}s ease, transform 0.4s ${i * 0.06}s ease`;
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
    }, 80 + i * 55);
  });

  /* ----- Buy button ripple effect (detail page) ----- */
  const buyBtn = document.querySelector('.buy-btn');
  if (buyBtn) {
    buyBtn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = buyBtn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute; border-radius:50%; pointer-events:none;
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top - size/2}px;
        background: rgba(255,255,255,0.25);
        transform: scale(0); animation: ripple 0.5s ease forwards;
      `;
      buyBtn.style.position = 'relative';
      buyBtn.style.overflow = 'hidden';
      buyBtn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
    // inject ripple keyframe once
    if (!document.querySelector('#ripple-style')) {
      const s = document.createElement('style');
      s.id = 'ripple-style';
      s.textContent = `@keyframes ripple { to { transform: scale(2.5); opacity: 0; } }`;
      document.head.appendChild(s);
    }
  }

});