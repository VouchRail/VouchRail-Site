(() => {
  'use strict';

  // ---------- Countdown to EU AI Act enforcement (2 Aug 2026) ----------
  const target = new Date('2026-08-02T00:00:00Z');
  const cdEl = document.querySelector('[data-countdown]');
  if (cdEl) {
    const render = () => {
      const ms = target.getTime() - Date.now();
      if (ms <= 0) { cdEl.textContent = 'live'; return; }
      const days = Math.floor(ms / 86400000);
      const hrs  = Math.floor((ms % 86400000) / 3600000);
      cdEl.textContent = `${days}d ${hrs}h`;
    };
    render();
    setInterval(render, 60_000);
  }

  // ---------- Current year ----------
  const yEl = document.getElementById('year');
  if (yEl) yEl.textContent = String(new Date().getFullYear());

  // ---------- Mobile nav ----------
  const toggle = document.getElementById('navToggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- Animated hash-chain visualisation ----------
  const track = document.getElementById('chainTrack');
  if (track) {
    const rand = () => Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0');
    const makeHash = () => `sha256:${rand()}${rand()}…${rand()}${rand()}`;
    const labels   = [
      'candidate-12345 · score',
      'candidate-12346 · score',
      'loan-44781 · decision',
      'triage-90021 · route',
      'essay-7712 · grade',
      'underwrite-3091 · price',
      'candidate-12347 · score',
    ];
    let i = 0;
    const push = () => {
      const link = document.createElement('div');
      link.className = 'chain-link';
      const label = labels[i % labels.length]; i++;
      link.innerHTML = `<span class="dot"></span><span class="hash"><strong>${label}</strong> &nbsp;${makeHash()}</span>`;
      track.appendChild(link);
      while (track.children.length > 5) track.removeChild(track.firstChild);
    };
    for (let k = 0; k < 4; k++) push();
    setInterval(push, 2200);
  }

  // ---------- Contact form → mailto: jeffry1829@gmail.com ----------
  const form     = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name     = (data.get('name')     || '').toString().trim();
      const email    = (data.get('email')    || '').toString().trim();
      const company  = (data.get('company')  || '').toString().trim();
      const role     = (data.get('role')     || '').toString().trim();
      const vertical = (data.get('vertical') || '').toString().trim();
      const message  = (data.get('message')  || '').toString().trim();

      if (!name || !email || !message) {
        statusEl.style.color = '#fb7185';
        statusEl.textContent = '! name, email, and message are required.';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        statusEl.style.color = '#fb7185';
        statusEl.textContent = '! that email does not look valid.';
        return;
      }

      const subject = `VouchRail enquiry — ${name}${company ? ' · ' + company : ''}`;
      const body = [
        `Name:     ${name}`,
        `Email:    ${email}`,
        company  ? `Company:  ${company}`  : null,
        role     ? `Role:     ${role}`     : null,
        vertical ? `Vertical: ${vertical}` : null,
        '',
        '--- message ---',
        message,
        '',
        '— sent via vouchrail static site',
      ].filter(Boolean).join('\n');

      const href = `mailto:jeffry1829@gmail.com`
        + `?subject=${encodeURIComponent(subject)}`
        + `&body=${encodeURIComponent(body)}`;

      statusEl.style.color = '#5eead4';
      statusEl.textContent = '✓ opening your mail client…';

      // give the status a frame to paint before navigating
      setTimeout(() => { window.location.href = href; }, 80);
    });
  }

  // ---------- Reveal on scroll (subtle) ----------
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.style.opacity = '1';
          en.target.style.transform = 'translateY(0)';
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.section, .stack-card, .problem-card, .vert-card, .price-card, .timeline li, .meta-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity .55s ease, transform .55s ease';
      io.observe(el);
    });
  }
})();
