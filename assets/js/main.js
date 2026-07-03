/* Fellas Haberdashery & Salon — interactions */
(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  /* ---- Sticky nav shade on scroll ---- */
  var lastKnown = 0;
  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', function () {
    if (!lastKnown) {
      window.requestAnimationFrame(function () {
        onScroll();
        lastKnown = 0;
      });
      lastKnown = 1;
    }
  }, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  function closeMenu() {
    nav.classList.remove('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  if (mobileMenu) {
    mobileMenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // stagger siblings a touch for a cinematic cascade
          var el = entry.target;
          var delay = el.dataset.revealDelay || 0;
          setTimeout(function () { el.classList.add('is-in'); }, delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

    reveals.forEach(function (el, i) {
      // gentle stagger within groups
      var group = el.parentElement;
      var siblings = group ? group.querySelectorAll(':scope > .reveal') : [];
      if (siblings.length > 1) {
        el.dataset.revealDelay = (Array.prototype.indexOf.call(siblings, el) % 6) * 80;
      }
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- Footer year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
