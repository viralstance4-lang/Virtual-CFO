/* ===========================
   VIRTUAL CFO - MAIN JS
=========================== */

/* ── PREMIUM NAVBAR: enhanced scroll behavior ── */
(function () {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  var lastY = 0;
  var ticking = false;

  function updateNav() {
    var y = window.scrollY;

    /* Scrolled state */
    navbar.classList.toggle('scrolled', y > 40);

    /* Hide/show on scroll direction (optional premium UX) */
    if (y > 120) {
      if (y > lastY + 4) {
        navbar.style.transform = 'translateY(-100%)';
      } else if (lastY > y + 4) {
        navbar.style.transform = 'translateY(0)';
      }
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(updateNav); ticking = true; }
  }, { passive: true });
})();

/* ── FOOTER STATS: count-up animation on scroll ── */
(function () {
  var footerStats = document.querySelectorAll('.footer-stat-num');
  if (!footerStats.length) return;

  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.dataset.target || el.textContent, 10);
        var suffix = el.dataset.suffix || '';
        if (isNaN(target)) return;
        var start = 0;
        var step = target / 40;
        var timer = setInterval(function() {
          start = Math.min(start + step, target);
          el.textContent = Math.floor(start) + suffix;
          if (start >= target) clearInterval(timer);
        }, 30);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.6 });

  footerStats.forEach(function(el) { obs.observe(el); });
})();

/* ── PRC: connector line fill + dot animation on scroll ── */
(function () {
  var fill = document.getElementById('prcFill');
  var connector = document.getElementById('prcConnector');
  if (!fill || !connector) return;

  var obs = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      fill.style.width = '100%';
      // Activate moving dots after fill animation completes
      setTimeout(function() {
        connector.classList.add('prc-dots-active');
      }, 2400);
      obs.disconnect();
    }
  }, { threshold: 0.4 });

  obs.observe(connector);
})();

/* ── TST: Premium Testimonial Carousel ── */
(function () {
  var track    = document.getElementById('tstTrack');
  var prevBtn  = document.getElementById('tstPrev');
  var nextBtn  = document.getElementById('tstNext');
  var dotsEl   = document.getElementById('tstDots');
  if (!track || !dotsEl) return;

  var slides    = track.querySelectorAll('.tst-slide');
  var total     = slides.length;
  var current   = 0;
  var autoTimer = null;
  var DELAY     = 5000;
  var dragStartX = 0;
  var isDragging = false;

  /* ── Responsive visible count ── */
  function getVisible() {
    var w = window.innerWidth;
    var visibleOverride = parseInt((outer && outer.dataset.visible) || (track && track.dataset.visible), 10);
    if (!isNaN(visibleOverride) && visibleOverride > 0) {
      return visibleOverride;
    }
    if (w < 640)  return 1;
    if (w < 1024) return 2;
    return Math.min(3, total);
  }

  /* ── Max index before loop ── */
  function getMax() { return Math.max(0, total - getVisible()); }

  /* ── Set each slide width ── */
  function setSizes() {
    var pct = (100 / getVisible()) + '%';
    slides.forEach(function(s) { s.style.flexBasis = pct; s.style.maxWidth = pct; });
  }

  /* ── Move to index ── */
  function moveTo(idx) {
    var max = getMax();
    current = idx < 0 ? max : (idx > max ? 0 : idx);
    var pct = -(current * (100 / getVisible()));
    track.style.transform = 'translateX(' + pct + '%)';
    updateDots();
  }

  /* ── Auto-play ── */
  function startAuto() {
    autoTimer = setInterval(function() { moveTo(current + 1); }, DELAY);
  }
  function resetAuto() { clearInterval(autoTimer); startAuto(); }

  /* ── Build dots ── */
  function buildDots() {
    dotsEl.innerHTML = '';
    var count = getMax() + 1;
    for (var i = 0; i < count; i++) {
      var d = document.createElement('button');
      d.className = 'tst-dot';
      d.setAttribute('aria-label', 'Testimonial ' + (i + 1));
      (function(idx) {
        d.addEventListener('click', function() { moveTo(idx); resetAuto(); });
      })(i);
      dotsEl.appendChild(d);
    }
    updateDots();
  }

  function updateDots() {
    dotsEl.querySelectorAll('.tst-dot').forEach(function(d, i) {
      d.classList.toggle('tst-dot-active', i === current);
    });
  }

  /* ── Touch / drag support ── */
  track.addEventListener('touchstart', function(e) {
    dragStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', function(e) {
    var diff = dragStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 45) { diff > 0 ? moveTo(current + 1) : moveTo(current - 1); resetAuto(); }
  }, { passive: true });

  track.addEventListener('mousedown', function(e) {
    isDragging = true; dragStartX = e.clientX;
  });
  document.addEventListener('mouseup', function(e) {
    if (!isDragging) return;
    isDragging = false;
    var diff = dragStartX - e.clientX;
    if (Math.abs(diff) > 45) { diff > 0 ? moveTo(current + 1) : moveTo(current - 1); resetAuto(); }
  });

  /* ── Navigation buttons ── */
  prevBtn.addEventListener('click', function() { moveTo(current - 1); resetAuto(); });
  nextBtn.addEventListener('click', function() { moveTo(current + 1); resetAuto(); });

  /* ── Resize handler ── */
  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      setSizes();
      buildDots();
      moveTo(Math.min(current, getMax()));
    }, 150);
  });

  /* ── Pause on hover ── */
  var outer = document.querySelector('.tst-slider-outer');
  if (outer) {
    outer.addEventListener('mouseenter', function() { clearInterval(autoTimer); });
    outer.addEventListener('mouseleave', function() { startAuto(); });
  }

  /* ── Init ── */
  setSizes();
  buildDots();
  moveTo(0);
  startAuto();
})();

/* ── VCD diagram: item stagger reveal ── */
(function () {
  var items = document.querySelectorAll('.vcd-item, .vcd-best');
  if (!items.length) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('vcd-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  items.forEach(function(el) { obs.observe(el); });
})();

/* ── About page: progress bars + stats animation ── */
(function () {
  /* Progress bar fills */
  var aboutBars = document.querySelectorAll('.about-prog-fill[data-width]');
  if (aboutBars.length) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.width;
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    aboutBars.forEach(function(b) { obs.observe(b); });
  }

  /* About section: draw progress bars on load if in view (above fold on desktop) */
  setTimeout(function() {
    aboutBars.forEach(function(b) {
      var rect = b.getBoundingClientRect();
      if (rect.top < window.innerHeight) { b.style.width = b.dataset.width; }
    });
  }, 600);
})();

/* ── HTL: horizontal timeline — line fill + item reveal ── */
(function () {
  var fill    = document.getElementById('htlLineFill');
  var track   = document.getElementById('htlLineTrack');
  var items   = document.querySelectorAll('.htl-item');
  if (!items.length) return;

  /* Item reveal observer */
  var itemObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('htl-visible'); itemObs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  items.forEach(function(el) { itemObs.observe(el); });

  /* Line fill + dots */
  if (fill && track) {
    var lineObs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        fill.style.width = '100%';
        setTimeout(function() { track.classList.add('htl-dots-active'); }, 2500);
        lineObs.disconnect();
      }
    }, { threshold: 0.3 });
    lineObs.observe(track);
  }
})();

/* ── SD: service detail progress bars ── */
(function () {
  var bars = document.querySelectorAll('.sd-prog-fill[data-width]');
  if (!bars.length) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.style.width = e.target.dataset.width; obs.unobserve(e.target); }
    });
  }, { threshold: 0.3 });
  bars.forEach(function(b) { obs.observe(b); });
})();

/* ── BVA: stagger list item reveal ── */
(function () {
  var items = document.querySelectorAll('.bva-li');
  if (!items.length) return;

  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('bva-li-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(function(li) { obs.observe(li); });
})();

/* ── BVA: efficiency meter fill on scroll ── */
(function () {
  var bars = document.querySelectorAll('.bva-meter-fill[data-bva-width]');
  if (!bars.length) return;

  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.bvaWidth;
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(function(bar) { obs.observe(bar); });
})();

/* ── Comparison table: stagger row reveal on scroll ── */
(function () {
  var rows = document.querySelectorAll('.cmp-trow');
  if (!rows.length) return;

  var rowObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('row-visible');
        rowObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  rows.forEach(function(row) { rowObs.observe(row); });
})();

/* ── Premium: stagger on scroll for any .stagger-reveal grid ── */
document.querySelectorAll('.services-grid, .testimonials-grid, .stats-grid, .process-grid').forEach(function(grid) {
  grid.querySelectorAll(':scope > *').forEach(function(card, i) {
    card.style.transitionDelay = (i * 0.08) + 's';
  });
});

/* ── Premium: hover glow ripple on CTA buttons ── */
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(function(btn) {
  btn.addEventListener('mouseenter', function(e) {
    var rect = btn.getBoundingClientRect();
    var ripple = document.createElement('span');
    ripple.style.cssText = 'position:absolute;border-radius:50%;width:80px;height:80px;background:rgba(255,255,255,0.15);transform:scale(0);animation:rippleOut 0.6s ease forwards;pointer-events:none;top:' + (e.clientY - rect.top - 40) + 'px;left:' + (e.clientX - rect.left - 40) + 'px;';
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(function() { ripple.remove(); }, 600);
  });
});

/* rippleOut keyframe injected once */
(function() {
  if (!document.getElementById('vcfo-ripple-style')) {
    var s = document.createElement('style');
    s.id = 'vcfo-ripple-style';
    s.textContent = '@keyframes rippleOut{to{transform:scale(4);opacity:0;}}';
    document.head.appendChild(s);
  }
})();

// Scroll progress bar — inject if not already in HTML
if (!document.getElementById('scroll-progress')) {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);
}
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  if (scrollProgress) {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    scrollProgress.style.width = scrolled + '%';
  }
}, { passive: true });

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Hamburger menu — initialized after DOM is ready
var hamburger, navMenu, navOverlay;

function closeMenu() {
  if (hamburger) { hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded', 'false'); }
  if (navMenu) {
    navMenu.classList.remove('open');
    navMenu.querySelectorAll('.nav-dropdown').forEach(function (d) { d.classList.remove('mobile-open', 'open'); });
  }
  if (navOverlay) navOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

function initMobileNav() {
  hamburger  = document.querySelector('.hamburger');
  navMenu    = document.querySelector('.nav-menu');
  navOverlay = document.querySelector('.nav-overlay');

  if (!hamburger || !navMenu) return;

  // Open / close the mobile slide-in panel
  hamburger.addEventListener('click', function () {
    var isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (navOverlay) navOverlay.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on overlay click
  if (navOverlay) navOverlay.addEventListener('click', closeMenu);

  // Close button (X) inside panel
  var navClose = document.getElementById('navClose');
  if (navClose) navClose.addEventListener('click', closeMenu);

  // Leaf nav-links close the panel and navigate normally
  // Dropdown PARENT links on mobile do NOT close — they expand the sub-menu instead
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      var isMobile     = window.innerWidth <= 768;
      var isDropParent = !!link.closest('.nav-dropdown');
      if (isMobile && isDropParent) return; // handled by dropdown toggle below
      closeMenu();
    });
  });

  // Sub-items inside the Services dropdown: close panel on tap
  document.querySelectorAll('.nav-dropdown-menu a').forEach(function (subLink) {
    subLink.addEventListener('click', closeMenu);
  });

  // Dropdown parent link: on mobile toggle sub-menu; on touch-only tablet open below nav
  document.querySelectorAll('.nav-dropdown > .nav-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var dropdown = link.closest('.nav-dropdown');
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle('mobile-open');
      } else if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        e.preventDefault();
        var wasOpen = dropdown.classList.contains('open');
        document.querySelectorAll('.nav-dropdown').forEach(function (d) { d.classList.remove('open'); });
        if (!wasOpen) dropdown.classList.add('open');
      }
    });
  });
}

// Close tablet dropdown when clicking outside
document.addEventListener('click', function (e) {
  if (!e.target.closest('.nav-dropdown')) {
    document.querySelectorAll('.nav-dropdown').forEach(function (d) { d.classList.remove('open'); });
  }
});

// Run immediately (scripts at bottom of body, components.js already injected nav)
initMobileNav();

// Active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// Intersection Observer - fade in
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-up').forEach(el => {
  observer.observe(el);
});

// Counter animation
function animateCounter(el, target, duration = 2000) {
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = prefix + Math.floor(start) + suffix;
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = '1';
      const target = parseInt(entry.target.dataset.target);
      animateCounter(entry.target, target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// FAQ Accordion — premium: also toggles .faq-item-open on parent
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const item   = btn.closest('.faq-item');
    const isOpen = btn.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-question').forEach(q => {
      q.classList.remove('open');
      q.nextElementSibling?.classList.remove('open');
      q.closest('.faq-item')?.classList.remove('faq-item-open');
    });

    // Toggle current
    if (!isOpen) {
      btn.classList.add('open');
      answer?.classList.add('open');
      item?.classList.add('faq-item-open');
    }
  });
});

// Checklist auto-strike animation
function runChecklist() {
  const items = document.querySelectorAll('.check-item:not(.checked)');
  if (!items.length) return;
  let delay = 600;
  items.forEach(item => {
    setTimeout(() => item.classList.add('checked'), delay);
    delay += 700;
  });
}

const checklistEl = document.querySelector('.checklist');
if (checklistEl) {
  const clObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      runChecklist();
      clObs.disconnect();
    }
  }, { threshold: 0.5 });
  clObs.observe(checklistEl);
}

// Chart bars animation (initial entry)
function animateChartBars() {
  const bars = document.querySelectorAll('.chart-bar');
  bars.forEach((bar, i) => {
    setTimeout(() => {
      bar.style.height = bar.dataset.h || (Math.random() * 60 + 30) + '%';
    }, i * 100);
  });
}

// Live micro-animations: bars wiggle like a live market feed + KPI numbers fluctuate
function startLiveDashboard() {
  const bars = Array.from(document.querySelectorAll('.mockup-chart .chart-bar'));
  if (!bars.length) return;

  // Snapshot current heights as baselines
  const baseH = bars.map(b => parseFloat(b.style.height) || 50);

  // Each bar gets its own independent ticker — staggered intervals
  bars.forEach((bar, i) => {
    let curr = baseH[i];
    setInterval(() => {
      curr = Math.max(18, Math.min(98, curr + (Math.random() - 0.47) * 9));
      bar.style.transition = 'height 0.35s cubic-bezier(0.4,0,0.2,1)';
      bar.style.height = curr + '%';
    }, 500 + i * 40);
  });

  // KPI number tickers
  const cards = document.querySelectorAll('.mockup-cards .mockup-card');
  [
    { card: cards[0], base: 4.2,  prefix: 'AED ', suffix: 'M', dec: 2, swing: 0.06 },
    { card: cards[1], base: 68.3, prefix: '',     suffix: '%', dec: 1, swing: 0.35 },
    { card: cards[2], base: 1.1,  prefix: 'AED ', suffix: 'M', dec: 2, swing: 0.03 },
  ].forEach((kpi, i) => {
    const el = kpi.card?.querySelector('.mockup-card-val');
    if (!el) return;
    let curr = kpi.base;

    setInterval(() => {
      const delta = (Math.random() - 0.47) * kpi.swing * 2;
      curr = parseFloat((curr + delta).toFixed(kpi.dec + 1));
      el.textContent = kpi.prefix + curr.toFixed(kpi.dec) + kpi.suffix;

      el.classList.remove('kpi-tick-up', 'kpi-tick-down');
      requestAnimationFrame(() => {
        el.classList.add(delta > 0 ? 'kpi-tick-up' : 'kpi-tick-down');
      });
      setTimeout(() => el.classList.remove('kpi-tick-up', 'kpi-tick-down'), 300);
    }, 600 + i * 150);
  });
}

const chartObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    animateChartBars();
    setTimeout(startLiveDashboard, 1800); // start after entry animation
    chartObs.disconnect();
  }
}, { threshold: 0.5 });

const mockupChart = document.querySelector('.mockup-chart');
if (mockupChart) chartObs.observe(mockupChart);

// Contact form submission
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  /* ── Phone field validation ── */
  const phoneInput = contactForm.querySelector('#phone');
  const phoneError = document.getElementById('phoneError');
  if (phoneInput && !phoneInput.value.trim()) {
    phoneInput.classList.add('error');
    phoneInput.classList.remove('valid');
    if (phoneError) phoneError.classList.add('show');
    phoneInput.focus();
    return;
  }
  if (phoneInput) {
    phoneInput.classList.remove('error');
    if (phoneError) phoneError.classList.remove('show');
  }

  const btn = contactForm.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  const formData = new FormData(contactForm);

  try {
    const res = await fetch('php/contact.php', { method: 'POST', body: formData });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    if (data.success) {
      showAlert('success', data.message || 'Thank you! We will contact you within 24 hours.');
      contactForm.reset();
    } else {
      showAlert('error', data.message || 'Something went wrong. Please try again.');
    }
  } catch (err) {
    if (err.message && err.message.startsWith('Server error')) {
      showAlert('error', 'Server error. Please email us at info@virtualcfo.ae');
    } else {
      showAlert('error', 'Unable to connect. Make sure you are browsing via http://localhost — not opening the file directly.');
    }
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
});

function showAlert(type, message) {
  const alert = document.createElement('div');
  alert.className = `form-alert ${type}`;
  alert.innerHTML = `<i class="fa-solid fa-${type === 'success' ? 'circle-check' : 'circle-exclamation'}"></i> ${message}`;
  alert.style.cssText = `
    padding: 14px 20px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 12px;
    background: ${type === 'success' ? '#f0fdf4' : '#fef2f2'};
    color: ${type === 'success' ? '#16a34a' : '#dc2626'};
    border: 1px solid ${type === 'success' ? '#86efac' : '#fca5a5'};
  `;
  contactForm.appendChild(alert);
  setTimeout(() => alert.remove(), 5000);
}

// Smooth stagger for grid cards
document.querySelectorAll('.services-grid .service-card, .testimonials-grid .testimonial-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.07}s`;
});

// SVG Line chart drawing
function drawLineChart(svgId) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  const data = [30, 55, 40, 70, 60, 85, 75, 95, 80, 100];
  const w = svg.clientWidth || 300;
  const h = svg.clientHeight || 80;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / 100) * h}`).join(' ');
  svg.innerHTML = `
    <defs>
      <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2E6DA4" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#2E6DA4" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <polygon points="${points} ${w},${h} 0,${h}" fill="url(#lineGrad)"/>
    <polyline points="${points}" fill="none" stroke="#2E6DA4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${data.map((v, i) => `<circle cx="${(i / (data.length - 1)) * w}" cy="${h - (v / 100) * h}" r="3" fill="#F5C518"/>`).join('')}
  `;
}

window.addEventListener('load', () => {
  drawLineChart('revenueChart');
  drawLineChart('biLineChart');

  // Hero above fold — start live chart immediately (handles initial render + animation)
  setTimeout(startHeroLiveChart, 150);

  // Fill hero progress bars
  setTimeout(function() {
    document.querySelectorAll('.mp-fill[data-width]').forEach(function(bar) {
      bar.style.width = bar.dataset.width;
    });
  }, 600);

  // Start KPI live number tickers
  setTimeout(startLiveDashboard, 1000);
});

/* ===========================
   HERO — PREMIUM ENHANCEMENTS
=========================== */

// 1. Mouse-follow glow
(function () {
  const heroEl = document.getElementById('hero');
  const glowEl = document.getElementById('heroMouseGlow');
  if (!heroEl || !glowEl) return;

  heroEl.addEventListener('mousemove', (e) => {
    const rect = heroEl.getBoundingClientRect();
    glowEl.style.left = (e.clientX - rect.left) + 'px';
    glowEl.style.top  = (e.clientY - rect.top)  + 'px';
  }, { passive: true });
})();

// 2. Typing headline — type char-by-char, pause, delete, advance, repeat
(function () {
  var el = document.getElementById('typingHeadline');
  if (!el) return;

  // \n becomes <br> at render time — each string is exactly 2 visual lines
  var headlines = [
    'Scale your business with\na Virtual CFO',
    'We turn Data into\nDecisions',
    'Without strategy and systems,\ngrowth becomes risky',
  ];

  var SPEED_TYPE   = 55;   // ms per character while typing
  var SPEED_DELETE = 28;   // ms per character while deleting (faster)
  var PAUSE_FULL   = 2500; // ms to show fully typed text before deleting
  var PAUSE_EMPTY  = 350;  // ms pause after fully deleted before next starts

  var current    = 0;
  var charIdx    = 0;
  var isDeleting = false;

  function render() {
    var visible = headlines[current].substring(0, charIdx).replace(/\n/g, '<br>');
    el.innerHTML = visible + '<span class="typing-cursor" aria-hidden="true"></span>';
  }

  function tick() {
    var len = headlines[current].length;

    if (isDeleting) {
      charIdx--;
      render();
      if (charIdx === 0) {
        isDeleting = false;
        current    = (current + 1) % headlines.length;
        setTimeout(tick, PAUSE_EMPTY);
      } else {
        setTimeout(tick, SPEED_DELETE);
      }
    } else {
      charIdx++;
      render();
      if (charIdx === len) {
        isDeleting = true;
        setTimeout(tick, PAUSE_FULL);
      } else {
        setTimeout(tick, SPEED_TYPE);
      }
    }
  }

  render(); // show empty container with blinking cursor immediately
  setTimeout(tick, 500);
})();

// 3. Hero Live Chart — smooth animated revenue & profit lines
var _heroLiveChartStarted = false;

function drawHeroLineChart() {
  // Delegate to live chart (handles first render + ongoing animation)
  startHeroLiveChart();
}

function startHeroLiveChart() {
  if (_heroLiveChartStarted) return;
  var svg = document.getElementById('heroLineChart');
  if (!svg) return;
  _heroLiveChartStarted = true;

  var W = 300, H = 80, PAD = 5, N = 10;

  // Starting data (normalised 0-100 scale)
  var revTarget  = [38, 50, 44, 62, 55, 74, 68, 85, 78, 95];
  var profTarget = [18, 25, 20, 34, 28, 42, 36, 52, 45, 60];

  // Animated (current displayed) values — start same as target
  var revAnim  = revTarget.slice();
  var profAnim = profTarget.slice();

  var rafId = null;

  // ── Build SVG markup ───────────────────────────────────────────
  function mkPts(data) {
    return data.map(function(v, i) {
      var x = PAD + (i / (N - 1)) * (W - PAD * 2);
      var y = H - PAD - Math.max(0, Math.min(100, v)) / 100 * (H - PAD * 2);
      return x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');
  }

  function render() {
    var rPts  = mkPts(revAnim);
    var pPts  = mkPts(profAnim);
    var lastX = (PAD + (W - PAD * 2)).toFixed(1);
    var baseY = (H - PAD).toFixed(1);
    var rLY   = (H - PAD - Math.max(0, Math.min(100, revAnim[N-1])) / 100 * (H-PAD*2)).toFixed(1);
    var pLY   = (H - PAD - Math.max(0, Math.min(100, profAnim[N-1])) / 100 * (H-PAD*2)).toFixed(1);

    var revUp  = revAnim[N-1] >= revAnim[N-2];
    var profUp = profAnim[N-1] >= profAnim[N-2];

    var rDotColor = revUp  ? '#4ade80' : '#f87171';
    var pDotColor = profUp ? '#4ade80' : '#f87171';
    var rGlow     = revUp  ? 'rgba(74,222,128,0.6)' : 'rgba(248,113,113,0.5)';
    var pGlow     = profUp ? 'rgba(74,222,128,0.6)' : 'rgba(248,113,113,0.5)';

    svg.innerHTML =
      '<defs>' +
        '<linearGradient id="hRG" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="#4a8cc4" stop-opacity="0.25"/>' +
          '<stop offset="100%" stop-color="#4a8cc4" stop-opacity="0"/>' +
        '</linearGradient>' +
        '<linearGradient id="hPG" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="#F5C518" stop-opacity="0.18"/>' +
          '<stop offset="100%" stop-color="#F5C518" stop-opacity="0"/>' +
        '</linearGradient>' +
        '<filter id="glR" x="-20%" y="-20%" width="140%" height="140%">' +
          '<feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b"/>' +
          '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>' +
        '</filter>' +
        '<filter id="glP" x="-20%" y="-20%" width="140%" height="140%">' +
          '<feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="b"/>' +
          '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>' +
        '</filter>' +
      '</defs>' +
      /* Area fills */
      '<polygon points="' + rPts + ' ' + lastX + ',' + baseY + ' ' + PAD + ',' + baseY + '" fill="url(#hRG)"/>' +
      '<polygon points="' + pPts + ' ' + lastX + ',' + baseY + ' ' + PAD + ',' + baseY + '" fill="url(#hPG)"/>' +
      /* Lines */
      '<polyline points="' + rPts + '" fill="none" stroke="#4a8cc4" stroke-width="2"   stroke-linecap="round" stroke-linejoin="round"/>' +
      '<polyline points="' + pPts + '" fill="none" stroke="#F5C518" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      /* Glow halos on last point */
      '<circle cx="' + lastX + '" cy="' + rLY + '" r="7"   fill="' + rGlow + '" opacity="0.35" filter="url(#glR)"/>' +
      '<circle cx="' + lastX + '" cy="' + pLY + '" r="5"   fill="' + pGlow + '" opacity="0.3"  filter="url(#glP)"/>' +
      /* Direction-coloured endpoint dots */
      '<circle cx="' + lastX + '" cy="' + rLY + '" r="3.5" fill="' + rDotColor + '"/>' +
      '<circle cx="' + lastX + '" cy="' + pLY + '" r="2.5" fill="' + pDotColor + '"/>';

    // Update direction badges in legend
    var revEl  = document.getElementById('chartRevVal');
    var profEl = document.getElementById('chartProfVal');
    if (revEl) {
      var rPct = ((revAnim[N-1] - revAnim[N-2]) / Math.max(1, revAnim[N-2]) * 100);
      revEl.textContent = (revUp ? '▲' : '▼') + ' ' + Math.abs(rPct).toFixed(1) + '%';
      revEl.className   = 'chart-live-val' + (revUp ? '' : ' chart-val-down');
    }
    if (profEl) {
      var pPct = ((profAnim[N-1] - profAnim[N-2]) / Math.max(1, profAnim[N-2]) * 100);
      profEl.textContent = (profUp ? '▲' : '▼') + ' ' + Math.abs(pPct).toFixed(1) + '%';
      profEl.className   = 'chart-live-val chart-live-val-yellow' + (profUp ? '' : ' chart-val-down');
    }
  }

  // ── Smooth interpolation loop ────────────────────────────────
  function animLoop() {
    var done = true;
    for (var i = 0; i < N; i++) {
      var rd = revTarget[i]  - revAnim[i];
      var pd = profTarget[i] - profAnim[i];
      if (Math.abs(rd) > 0.06) { revAnim[i]  += rd * 0.13; done = false; }
      if (Math.abs(pd) > 0.06) { profAnim[i] += pd * 0.13; done = false; }
    }
    render();
    rafId = done ? null : requestAnimationFrame(animLoop);
  }

  // ── New data point every 2 s ────────────────────────────────
  function newPoint() {
    var lr = revTarget[N-1];
    var lp = profTarget[N-1];

    // Swing ± with slight upward bias; clamp to realistic range
    var nr = Math.max(22, Math.min(97, lr + (Math.random() - 0.42) * 20));
    var np = Math.max(10, Math.min(70, lp + (Math.random() - 0.42) * 14));

    // Shift buffers
    revTarget  = revTarget.slice(1).concat([nr]);
    profTarget = profTarget.slice(1).concat([np]);

    // Advance animated array too (new point starts at previous last)
    revAnim  = revAnim.slice(1).concat([revAnim[N-1]]);
    profAnim = profAnim.slice(1).concat([profAnim[N-1]]);

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(animLoop);
  }

  // First render immediately, then start live loop
  render();
  setInterval(newPoint, 2000);
}

// Progress bars on other pages (not hero — hero is handled in window.load)
(function () {
  const bars = document.querySelectorAll('.mp-fill[data-width]');
  if (!bars.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width;
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => obs.observe(b));
})();

// Power BI donut chart
function drawDonut(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const segments = [
    { value: 35, color: '#2E6DA4' },
    { value: 25, color: '#F5C518' },
    { value: 20, color: '#4ade80' },
    { value: 20, color: '#a78bfa' }
  ];
  const total = segments.reduce((a, b) => a + b.value, 0);
  const cx = canvas.width / 2, cy = canvas.height / 2;
  const r = Math.min(cx, cy) - 10;
  let startAngle = -Math.PI / 2;
  segments.forEach(seg => {
    const angle = (seg.value / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, startAngle + angle);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();
    startAngle += angle;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.55, 0, 2 * Math.PI);
  ctx.fillStyle = '#1e293b';
  ctx.fill();
}

window.addEventListener('load', () => drawDonut('donutChart'));
