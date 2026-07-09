/* =========================================================
   FELLAS HABERDASHERY & SALON — interactions
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rafThrottle = function (fn) {
    var ticking = false;
    return function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { fn(); ticking = false; });
    };
  };

  /* ---------- Preloader ---------- */
  var preloader = document.getElementById('preloader');
  function dismissPreloader() {
    if (!preloader) return;
    preloader.classList.add('is-done');
    window.setTimeout(function () { if (preloader.parentNode) preloader.parentNode.removeChild(preloader); }, 800);
  }
  if (preloader && !reduceMotion) {
    window.addEventListener('load', function () { window.setTimeout(dismissPreloader, 900); });
    // hard failsafe so it never traps content
    window.setTimeout(dismissPreloader, 4000);
  } else {
    dismissPreloader();
  }

  /* ---------- Nav: shade, hide-on-down, progress ---------- */
  var nav = document.getElementById('nav');
  var progress = document.getElementById('scrollProgress');
  var lastY = window.scrollY;

  var onScroll = rafThrottle(function () {
    var y = window.scrollY;
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    if (nav) {
      nav.classList.toggle('is-scrolled', y > 40);
      // hide when scrolling down past hero, show on scroll up
      if (y > 600 && y > lastY + 6) nav.classList.add('is-hidden');
      else if (y < lastY - 6) nav.classList.remove('is-hidden');
    }
    if (progress) progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';
    lastY = y;
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  function closeMenu() {
    if (!nav) return;
    nav.classList.remove('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  if (mobileMenu) mobileMenu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Scroll reveal ---------- */
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.dataset.revealDelay || '0', 10);
        window.setTimeout(function () { el.classList.add('is-in'); }, delay);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Parallax ---------- */
  var parallaxEls = [].slice.call(document.querySelectorAll('[data-parallax]'));
  if (parallaxEls.length && !reduceMotion) {
    var onParallax = rafThrottle(function () {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        var speed = parseFloat(el.dataset.parallax) || 0.15;
        var offset = (rect.top + rect.height / 2 - vh / 2) * speed;
        el.style.transform = 'translate3d(0,' + (-offset).toFixed(1) + 'px,0)';
      });
    });
    window.addEventListener('scroll', onParallax, { passive: true });
    window.addEventListener('resize', onParallax);
    onParallax();
  }

  /* ---------- Count-up stats ---------- */
  function formatNum(n, format) {
    if (format === 'k' && n >= 1000) {
      var v = n / 1000;
      return (v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)) + 'k';
    }
    return Math.round(n).toLocaleString('en-US');
  }
  var counters = [].slice.call(document.querySelectorAll('[data-count]'));
  if (counters.length) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.dataset.count) || 0;
        var suffix = el.dataset.suffix || '';
        var format = el.dataset.format || '';
        if (reduceMotion) { el.textContent = formatNum(target, format) + suffix; cObs.unobserve(el); return; }
        var start = null, dur = 1600;
        (function step(ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = formatNum(target * eased, format) + suffix;
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = formatNum(target, format) + suffix;
        })(performance.now ? performance.now() : Date.now());
        cObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cObs.observe(el); });
  }

  /* ---------- Scrollspy (active nav link) ---------- */
  var navLinks = [].slice.call(document.querySelectorAll('.nav__links a'));
  var sections = navLinks.map(function (a) {
    var id = a.getAttribute('href').slice(1);
    return document.getElementById(id);
  });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (a) {
          a.setAttribute('aria-current', a.getAttribute('href') === '#' + id ? 'true' : 'false');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { if (s) spy.observe(s); });
  }

  /* ---------- Custom cursor + magnetic ---------- */
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var cursor = document.getElementById('cursor');
  var cursorDot = document.getElementById('cursorDot');
  if (finePointer && !reduceMotion && cursor && cursorDot) {
    document.body.classList.add('has-cursor');
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
    });
    (function ring() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      cursor.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(ring);
    })();
    var hoverTargets = 'a, button, [data-magnetic], .svc-row, .gal';
    document.addEventListener('mouseover', function (e) { if (e.target.closest(hoverTargets)) cursor.classList.add('is-hover'); });
    document.addEventListener('mouseout', function (e) { if (e.target.closest(hoverTargets)) cursor.classList.remove('is-hover'); });

    // magnetic pull
    [].slice.call(document.querySelectorAll('[data-magnetic]')).forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
        var dy = (e.clientY - (r.top + r.height / 2)) * 0.35;
        el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- Services floating preview ---------- */
  var svcPreview = document.getElementById('svcPreview');
  if (svcPreview && finePointer) {
    var imgKey = { signature: '--img-g1', fade: '--img-g2', beard: '--img-g3', shave: '--img-g2' };
    var cs = getComputedStyle(document.documentElement);
    var previewX = 0, previewY = 0;
    document.addEventListener('mousemove', function (e) { previewX = e.clientX; previewY = e.clientY; });
    [].slice.call(document.querySelectorAll('.svc-row')).forEach(function (row) {
      row.addEventListener('mouseenter', function () {
        var key = imgKey[row.dataset.img];
        if (key) svcPreview.style.backgroundImage = cs.getPropertyValue(key).trim();
        svcPreview.classList.add('is-visible');
      });
      row.addEventListener('mousemove', function () {
        svcPreview.style.left = (previewX + 28) + 'px';
        svcPreview.style.top = (previewY - 160) + 'px';
      });
      row.addEventListener('mouseleave', function () { svcPreview.classList.remove('is-visible'); });
    });
  }

  /* ---------- Testimonials ---------- */
  var stage = document.getElementById('quotesStage');
  var dotsWrap = document.getElementById('quotesDots');
  if (stage && dotsWrap) {
    var quotes = [].slice.call(stage.querySelectorAll('.quote'));
    var idx = 0, timer;
    quotes.forEach(function (q, i) {
      var b = document.createElement('button');
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Testimonial ' + (i + 1));
      if (i === 0) b.classList.add('is-active');
      b.addEventListener('click', function () { show(i); reset(); });
      dotsWrap.appendChild(b);
    });
    var dots = [].slice.call(dotsWrap.children);
    function show(i) {
      quotes[idx].classList.remove('is-active');
      dots[idx].classList.remove('is-active');
      idx = i;
      quotes[idx].classList.add('is-active');
      dots[idx].classList.add('is-active');
    }
    function next() { show((idx + 1) % quotes.length); }
    function reset() { window.clearInterval(timer); timer = window.setInterval(next, 5500); }
    if (!reduceMotion) reset();
  }

  /* ---------- Open-now status + today's hours ---------- */
  // schedule[day] = [openMinutes, closeMinutes] or null
  var schedule = {
    0: null,               // Sun
    1: [510, 1140],        // Mon 8:30–19:00
    2: [510, 1260], 3: [510, 1260], 4: [510, 1260], 5: [510, 1260], // Tue–Fri 8:30–21:00
    6: [510, 840]          // Sat 8:30–14:00
  };
  function fmtTime(mins) {
    var h = Math.floor(mins / 60), m = mins % 60;
    var ap = h >= 12 ? 'p' : 'a';
    var hh = h % 12; if (hh === 0) hh = 12;
    return hh + (m ? ':' + (m < 10 ? '0' + m : m) : '') + ap;
  }
  var statusEl = document.getElementById('openStatus');
  if (statusEl) {
    var now = new Date();
    var day = now.getDay();
    var mins = now.getHours() * 60 + now.getMinutes();
    var today = schedule[day];
    var isOpen = today && mins >= today[0] && mins < today[1];
    statusEl.classList.remove('is-open', 'is-closed');
    statusEl.classList.add(isOpen ? 'is-open' : 'is-closed');
    var label;
    if (isOpen) {
      label = 'Open now · until ' + fmtTime(today[1]);
    } else if (today && mins < today[0]) {
      label = 'Opens ' + fmtTime(today[0]) + ' today';
    } else {
      // find next open day
      for (var i = 1; i <= 7; i++) {
        var d = (day + i) % 7;
        if (schedule[d]) {
          var names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          label = 'Closed · opens ' + fmtTime(schedule[d][0]) + ' ' + names[d];
          break;
        }
      }
    }
    statusEl.innerHTML = '<span class="dot"></span> ' + (label || 'Call for hours');
  }
  // highlight today's row
  var todayRow = document.querySelector('.hours li[data-day="' + (new Date()).getDay() + '"]');
  if (todayRow) todayRow.classList.add('is-today');

  /* ---------- Newsletter ---------- */
  var form = document.getElementById('newsletter');
  if (form) {
    var msg = document.getElementById('nlMsg');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = document.getElementById('nl-email');
      var val = (input.value || '').trim();
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      if (!ok) { msg.textContent = 'Please enter a valid email address.'; msg.style.color = '#e0a15a'; input.focus(); return; }
      msg.textContent = 'You’re on the list — welcome to Fellas.';
      msg.style.color = '';
      form.reset();
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
