(function () {
  'use strict';

  var observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.08
  };

  // スクロールで表示（data-anim-reveal / data-anim-line）
  var revealEls = document.querySelectorAll('[data-anim-reveal], [data-anim-line]');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  // カード3Dチルト（マウス位置で傾く）— data-tilt が付いた要素のみ
  var tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;
      var tiltX = (y - 0.5) * -10;
      var tiltY = (x - 0.5) * 10;
      card.style.transform = 'perspective(800px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateY(-6px)';
      card.style.boxShadow = '0 16px 40px rgba(15,23,42,.12)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
})();
