/* ===================================================
   STUNNING SMILES — HOLISTIC DENTAL
   Main Script
   =================================================== */

(function () {
  'use strict';

  /* --- NAVBAR: sticky shadow + scroll indicator --- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 60;
    navbar.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  /* --- HAMBURGER MENU --- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* --- BACK TO TOP --- */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* --- INTERSECTION OBSERVER: fade-in animations --- */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.fade-in-left, .fade-in-right').forEach(el => observer.observe(el));

  /* --- SERVICE / WHY CARDS: staggered entrance --- */
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, idx * 80);
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.service-card, .why-card, .testi-card').forEach(card => {
    card.style.opacity    = '0';
    card.style.transform  = 'translateY(20px)';
    card.style.transition = 'opacity .5s ease, transform .5s ease, box-shadow .25s, border-color .25s';
    cardObserver.observe(card);
  });

  /* --- SMOOTH ACTIVE NAV LINK on scroll --- */
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-links a:not(.btn-nav)');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          allNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(sec => sectionObserver.observe(sec));

  // Highlight active link style
  const style = document.createElement('style');
  style.textContent = `
    .nav-links a.active { color: var(--green) !important; }
    .nav-links a.active::after { width: 100% !important; }
  `;
  document.head.appendChild(style);

  /* --- COUNTER ANIMATION on About stats --- */
  function animateCounter(el, target, duration = 1500) {
    const start     = performance.now();
    const isDecimal = target.toString().includes(',');
    const numTarget = parseInt(target.replace(/,|\+/g, ''), 10);
    const suffix    = target.includes('+') ? '+' : '';

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.floor(eased * numTarget);
      el.textContent = numTarget >= 1000
        ? current.toLocaleString() + suffix
        : current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = el.dataset.target;
          animateCounter(el, target);
          statsObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-num').forEach(el => {
    el.dataset.target = el.textContent;
    el.textContent    = '0';
    statsObserver.observe(el);
  });

  /* --- FORM SUBMISSION --- */
  const form    = document.getElementById('appointmentForm');
  const success = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple client-side validation
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#e53e3e';
          valid = false;
          field.addEventListener('input', () => {
            field.style.borderColor = '';
          }, { once: true });
        }
      });
      if (!valid) return;

      // Simulate submission
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled    = true;
      btn.textContent = 'Sending…';

      setTimeout(() => {
        form.style.display    = 'none';
        success.style.display = 'flex';
        success.classList.add('visible');
      }, 1000);
    });
  }

  /* --- HERO PARALLAX (subtle) --- */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroBg.style.transform = `translateY(${y * 0.3}px)`;
    }, { passive: true });
  }

  /* --- ANNOUNCE BANNER CLOSE (optional UX) --- */
  const announce = document.querySelector('.announce');
  if (announce) {
    announce.addEventListener('dblclick', () => {
      announce.style.transition = 'max-height .4s ease, opacity .4s ease, padding .4s ease';
      announce.style.maxHeight  = '0';
      announce.style.opacity    = '0';
      announce.style.padding    = '0';
      setTimeout(() => announce.remove(), 400);
    });
  }

})();
