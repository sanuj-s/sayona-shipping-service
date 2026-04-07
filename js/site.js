/* ═══════════════════════════════════════════════
   SAYONA SHIPPING — Site JS 2026
   Unified: Navbar · Reveal · Counter · Dark Mode · Progress
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Navbar Scroll Behavior ───
  function initNavbar() {
    const nav = document.querySelector('.corporate-nav');
    const menuBtn = document.getElementById('menuBtn');
    const navMenu = document.getElementById('navMenu');
    if (!nav) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > 60) {
        nav.classList.add('docked');
      } else {
        nav.classList.remove('docked');
      }
      lastScroll = scrollY;
    }, { passive: true });

    // Mobile menu toggle
    if (menuBtn && navMenu) {
      menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuBtn.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
      });

      // Close menu on link click
      navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          menuBtn.textContent = '☰';
        });
      });
    }
  }

  // ─── Scroll Reveal (IntersectionObserver) ───
  function initReveal() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const reveals = document.querySelectorAll('.reveal');
    if (prefersReduced) {
      reveals.forEach(el => el.classList.add('active'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  // ─── Counter Animation (IntersectionObserver triggered) ───
  function initCounter() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animateCounter(el) {
      const target = Number(el.getAttribute('data-target'));
      if (prefersReduced) {
        el.textContent = target + '+';
        return;
      }

      let count = 0;
      const duration = 1500; // ms
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out quad
        const eased = 1 - (1 - progress) * (1 - progress);
        count = Math.ceil(eased * target);
        const formattedCount = (count >= target ? target : count).toLocaleString();
        el.textContent = formattedCount + (count >= target ? '+' : '');
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  // ─── Dark Mode Toggle ───
  function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;

    const html = document.documentElement;
    const stored = localStorage.getItem('sayona-theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    function applyDark() {
      html.classList.add('dark-mode');
      html.classList.remove('light-mode');
      toggle.innerHTML = '☀️';
    }

    function applyLight() {
      html.classList.remove('dark-mode');
      html.classList.add('light-mode');
      toggle.innerHTML = '🌙';
    }

    // On load: apply stored preference or follow system
    if (stored === 'dark') {
      applyDark();
    } else if (stored === 'light') {
      applyLight();
    } else {
      // No stored pref: follow system
      if (systemDark) {
        applyDark();
      } else {
        applyLight();
      }
    }

    toggle.addEventListener('click', () => {
      const isDark = html.classList.contains('dark-mode');
      if (isDark) {
        applyLight();
        localStorage.setItem('sayona-theme', 'light');
      } else {
        applyDark();
        localStorage.setItem('sayona-theme', 'dark');
      }
    });
  }

  // ─── Scroll Progress Bar ───
  function initProgressBar() {
    const bar = document.getElementById('progress-bar');
    if (!bar) return;

    bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:var(--accent);z-index:99999;transition:width 0.1s;width:0;';

    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  // ─── GSAP Hero (strictly hero only) ───
  function initHeroAnimation() {
    if (typeof gsap === 'undefined') return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const heroContent = document.querySelector('.hero-content');
    const heroMetrics = document.querySelector('.hero-metrics');

    if (heroContent) {
      gsap.from(heroContent.children, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        delay: 0.2,
        clearProps: 'all',
      });
    }

    if (heroMetrics) {
      gsap.from(heroMetrics.children, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.6,
        clearProps: 'all',
      });

      // Safety fallback: force metrics visible if GSAP fails
      setTimeout(() => {
        Array.from(heroMetrics.children).forEach(card => {
          card.style.opacity = '1';
          card.style.transform = 'none';
        });
      }, 2000);
    }
  }

  // ─── Quote Form Enhancement ───
  function initQuoteForm() {
    const form = document.getElementById('quote-form');
    if (!form) return;

    // Autofocus first input
    const firstInput = form.querySelector('input:not([type="hidden"])');
    if (firstInput && window.innerWidth > 768) {
      // Only autofocus on desktop to avoid mobile keyboard popup
      setTimeout(() => firstInput.focus(), 500);
    }

    // Inline validation
    form.querySelectorAll('input[required], textarea[required]').forEach(input => {
      input.addEventListener('blur', () => {
        if (!input.value.trim()) {
          input.classList.add('invalid');
        } else {
          input.classList.remove('invalid');
        }
      });

      input.addEventListener('input', () => {
        input.classList.remove('invalid');
      });
    });

    // Submit with loading state
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;

      // Validate all required fields
      let valid = true;
      form.querySelectorAll('input[required]').forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('invalid');
          valid = false;
        }
      });

      if (!valid) return;

      let msgEl = form.querySelector('.form-message');
      if (!msgEl) {
        msgEl = document.createElement('div');
        msgEl.className = 'form-message';
        msgEl.style.marginTop = '12px';
        msgEl.style.fontSize = '0.9rem';
        msgEl.style.fontWeight = '500';
        form.appendChild(msgEl);
      }
      msgEl.style.display = 'none';

      btn.textContent = 'Sending...';
      btn.classList.add('btn-loading');

      try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        const res = await fetch('/api/v1/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          btn.textContent = 'Quote Sent ✓';
          msgEl.textContent = 'Quote request sent successfully! We will contact you soon.';
          msgEl.style.color = 'var(--status-delivered, #10b981)';
          msgEl.style.display = 'block';
          form.reset();
          setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('btn-loading');
            msgEl.style.display = 'none';
          }, 5000);
        } else {
          throw new Error('Failed to send');
        }
      } catch (err) {
        btn.textContent = 'Try Again';
        btn.classList.remove('btn-loading');
        msgEl.textContent = 'Failed to convey request. Please try again.';
        msgEl.style.color = 'var(--status-exception, #ef4444)';
        msgEl.style.display = 'block';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 3000);
      }
    });
  }

  // ─── Year Auto-update ───
  function initYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  // ─── Active Nav Link Highlighting ───
  function initActiveNav() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    document.querySelectorAll('.nav-links > li > a, #navMenu a').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      
      // Split href to get file and hash separately
      var parts = href.split('#');
      var linkFile = parts[0].split('/').pop();
      var hasHash = parts.length > 1 && parts[1] !== '';
      
      // Only mark as active if it's an exact page match WITHOUT a hash fragment
      // This prevents Services (#services) and Industries (#industries) from being active on index.html
      if (!hasHash && (linkFile === filename || (filename === 'index.html' && (linkFile === '' || linkFile === 'index.html')))) {
        link.classList.add('active');
      }
    });
  }

  // ─── Initialize Everything ───
  document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initReveal();
    initCounter();
    initDarkMode();
    initProgressBar();
    initHeroAnimation();
    initQuoteForm();
    initYear();
    initActiveNav();
  });

})();
