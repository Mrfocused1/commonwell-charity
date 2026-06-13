/* ============================================================
   COMMONWELL — interactions & motion
   Lenis smooth scroll · GSAP + ScrollTrigger · Swiper
   Manual line-split text reveals (no premium plugin needed)
   ============================================================ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     LENIS smooth scroll  (+ GSAP ScrollTrigger sync)
     ============================================================ */
  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true, lerp: 0.1 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ---------- Anchor links via Lenis ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#' || id === '#top') {
        if (id === '#top') { e.preventDefault(); lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' }); }
        return;
      }
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = -70;
      lenis ? lenis.scrollTo(target, { offset }) : target.scrollIntoView({ behavior: 'smooth' });
      // close mobile menu if open
      navLinks && navLinks.classList.remove('open');
    });
  });

  /* ============================================================
     NAV — scrolled state + mobile burger
     ============================================================ */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const navLinks = document.querySelector('.nav__links');

  const onScroll = () => {
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (burger) {
    burger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
  }

  /* ============================================================
     SPLIT-TEXT line reveals (manual, dependency-free)
     Wrap each heading's words; animate in on scroll.
     ============================================================ */
  function splitToWords(el) {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.innerHTML = '';
    text.split(/\s+/).forEach((word, i, arr) => {
      const outer = document.createElement('span');
      outer.className = 'split-line';
      outer.style.display = 'inline-block';
      outer.style.overflow = 'hidden';
      outer.style.verticalAlign = 'top';
      const inner = document.createElement('span');
      inner.textContent = word;
      inner.setAttribute('aria-hidden', 'true');
      outer.appendChild(inner);
      el.appendChild(outer);
      if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
    });
    return el.querySelectorAll('.split-line > span');
  }

  if (window.gsap && !reduceMotion) {
    document.querySelectorAll('[data-split]').forEach((heading) => {
      const words = splitToWords(heading);
      gsap.set(words, { yPercent: 115 });
      gsap.to(words, {
        yPercent: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.06,
        scrollTrigger: { trigger: heading, start: 'top 88%' }
      });
    });

    /* ---------- generic reveal blocks ---------- */
    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.fromTo(el,
        { y: 50, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 86%' } }
      );
    });

    /* ---------- programme rows: panels slide in with a stagger ---------- */
    const progRows = gsap.utils.toArray('.prog-row');
    progRows.forEach((row) => {
      gsap.fromTo(row.children,
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: row, start: 'top 84%' } }
      );
    });

    /* ---------- stacking depth: each card shrinks slightly as the next
       one rises up to cover it (desktop/tablet, where sticky is active) ---------- */
    if (window.matchMedia('(min-width:721px)').matches) {
      progRows.forEach((row, i) => {
        const next = progRows[i + 1];
        if (!next) return;
        // read the covering card's actual sticky offset so this tracks the CSS
        const coverTop = parseInt(getComputedStyle(next).top, 10) || 150;
        gsap.fromTo(row,
          { scale: 1 },
          { scale: 0.94, ease: 'none',
            scrollTrigger: { trigger: next, start: 'top 90%', end: 'top ' + coverTop + 'px', scrub: true } }
        );
      });
    }

    /* ---------- give cards stagger ---------- */
    gsap.fromTo('.give-card',
      { y: 50, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: '.give-grid', start: 'top 82%' } }
    );

    /* ---------- hero video subtle parallax ---------- */
    gsap.to('.hero__video', {
      yPercent: 12, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    /* ---------- about image float ---------- */
    gsap.to('.blobshape', {
      y: -30, ease: 'none',
      scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  } else {
    // reduced motion: just show everything
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
  }

  /* ============================================================
     IMPACT COUNTERS
     ============================================================ */
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (reduceMotion) { el.textContent = target.toLocaleString(); return; }
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 2.2, delay: 0.5, ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.floor(obj.v).toLocaleString(); }
    });
  }
  if (window.gsap && window.ScrollTrigger) {
    ScrollTrigger.create({
      trigger: '.hero__strip', start: 'top 95%', once: true,
      onEnter: () => document.querySelectorAll('[data-count]').forEach(animateCount)
    });
  } else {
    document.querySelectorAll('[data-count]').forEach((el) => { el.textContent = (parseInt(el.dataset.count,10)||0).toLocaleString(); });
  }

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  document.querySelectorAll('.acc-item').forEach((item) => {
    const q = item.querySelector('.acc-q');
    const a = item.querySelector('.acc-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // close siblings
      document.querySelectorAll('.acc-item.open').forEach((other) => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.acc-a').style.maxHeight = null;
          other.querySelector('.acc-q').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('open', !isOpen);
      q.setAttribute('aria-expanded', String(!isOpen));
      a.style.maxHeight = isOpen ? null : a.scrollHeight + 'px';
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });

  /* ============================================================
     VOICES — Swiper carousel
     ============================================================ */
  if (window.Swiper && document.querySelector('.voices-swiper')) {
    new Swiper('.voices-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      grabCursor: true,
      autoplay: { delay: 6000, disableOnInteraction: false },
      pagination: { el: '.voices-pagination', clickable: true },
      a11y: { enabled: true }
    });
  }

  /* ============================================================
     WAYS TO GIVE — monthly / one-off toggle
     ============================================================ */
  const giveToggle = document.getElementById('giveToggle');
  if (giveToggle) {
    giveToggle.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        giveToggle.querySelectorAll('button').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const monthly = btn.dataset.mode === 'month';
        document.querySelectorAll('[data-per]').forEach((p) => {
          p.textContent = monthly ? '/month' : ' one-off';
        });
      });
    });
  }

  /* ============================================================
     GET INVOLVED — form (demo, no backend)
     ============================================================ */
  const form = document.getElementById('involvedForm');
  const status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#iname').value.trim();
      const email = form.querySelector('#iemail').value.trim();
      const type = form.querySelector('#itype').value;
      if (!name || !email || !type) {
        status.textContent = 'Please add your name, email and what you’d like to do.';
        status.className = 'form-status err';
        return;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        status.textContent = 'That email doesn’t look quite right — mind checking it?';
        status.className = 'form-status err';
        return;
      }
      status.textContent = `Thank you, ${name.split(' ')[0]}! We’ve got it — a real person will be in touch within two working days.`;
      status.className = 'form-status ok';
      form.reset();
    });
  }

})();
