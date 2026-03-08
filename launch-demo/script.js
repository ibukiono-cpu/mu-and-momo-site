(function () {
  'use strict';

  var header = document.querySelector('.header');
  var menuBtn = document.querySelector('.menu-btn');
  var drawer = document.querySelector('.drawer');
  var drawerLinks = document.querySelectorAll('.drawer a');

  // Header scroll state（requestAnimationFrame でスロットル）
  var ticking = false;
  function updateHeader() {
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    ticking = false;
  }
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  updateHeader();

  // Mobile menu
  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', function () {
      menuBtn.classList.toggle('open');
      drawer.classList.toggle('open');
      document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
    });

    drawerLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        menuBtn.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Inview animation（初回描画後に監視開始・表示は少しずつずらしてカクつき防止）
  var inviewEls = document.querySelectorAll('[data-inview]');
  if (inviewEls.length === 0) return;

  var observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.05
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      window.setTimeout(function () {
        entry.target.classList.add('is-inview');
      }, i * 55);
    });
  }, observerOptions);

  function startObserving() {
    inviewEls.forEach(function (el) { observer.observe(el); });
  }
  requestAnimationFrame(function () {
    requestAnimationFrame(startObserving);
  });
})();
