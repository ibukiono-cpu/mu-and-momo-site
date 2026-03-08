(function () {
  'use strict';

  var observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
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

  // 数値カウントアップ
  var counterEls = document.querySelectorAll('[data-anim-counter]');
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    var duration = 1600;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easeOut = 1 - Math.pow(1 - progress, 2);
      var current = Math.round(target * easeOut);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counterEls.forEach(function (el) {
    counterObserver.observe(el);
  });

  // カード3Dチルト（マウス位置で傾く）
  var tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;
      var tiltX = (y - 0.5) * -12;
      var tiltY = (x - 0.5) * 12;
      card.style.transform = 'perspective(800px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateY(-8px)';
      card.style.boxShadow = '0 20px 48px rgba(44, 42, 40, 0.18)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });

  // パララックス（スクロール量でレイヤーが違う速度で動く）
  var parallaxLayers = document.querySelectorAll('[data-parallax-speed]');
  var parallaxSection = document.querySelector('.anim-section--parallax');
  if (parallaxLayers.length && parallaxSection) {
    function updateParallax() {
      var rect = parallaxSection.getBoundingClientRect();
      var centerY = window.innerHeight * 0.5;
      var sectionCenter = rect.top + rect.height * 0.5;
      var offset = (sectionCenter - centerY) * 0.15;

      parallaxLayers.forEach(function (layer) {
        var speed = parseFloat(layer.getAttribute('data-parallax-speed')) || 0.5;
        var y = offset * speed;
        layer.style.transform = 'translate(-50%, calc(-50% + ' + y + 'px))';
      });
    }

    window.addEventListener('scroll', function () {
      requestAnimationFrame(updateParallax);
    }, { passive: true });
    updateParallax();
  }
})();
