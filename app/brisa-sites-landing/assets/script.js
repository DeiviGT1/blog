/* Brisa Sites - Interactividad: idioma, región, FAQ, animaciones */

(function() {
  // ─── LANGUAGE TOGGLE ──────────────────────────
  // Detect saved language or default to Spanish
  const savedLang = localStorage.getItem('brisa-lang');
  const initialLang = savedLang || 'es';
  document.documentElement.lang = initialLang;

  function toggleLanguage() {
    const current = document.documentElement.lang;
    const newLang = current === 'es' ? 'en' : 'es';
    document.documentElement.lang = newLang;
    localStorage.setItem('brisa-lang', newLang);
    updateToggleButton();
  }

  function updateToggleButton() {
    const buttons = document.querySelectorAll('.lang-toggle');
    const current = document.documentElement.lang;
    buttons.forEach(btn => {
      // Show the OTHER language as the action label
      btn.textContent = current === 'es' ? 'EN' : 'ES';
    });
  }

  // ─── REGION TOGGLE ────────────────────────────
  function initRegion() {
    var savedRegion = localStorage.getItem('brisa-region') || 'usa';
    applyRegion(savedRegion);
  }

  function applyRegion(region) {
    document.body.dataset.region = region;
    localStorage.setItem('brisa-region', region);

    // Update toggle buttons
    var regionBtns = document.querySelectorAll('.region-btn');
    regionBtns.forEach(function(btn) {
      var isActive = btn.dataset.region === region;
      btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });

    if (region === 'co') {
      // Colombia: force Spanish, hide lang toggle
      document.documentElement.lang = 'es';
      var langToggles = document.querySelectorAll('.lang-toggle');
      langToggles.forEach(function(btn) { btn.style.display = 'none'; });
    } else {
      // USA: restore lang toggle visibility and respect saved language
      var langToggles = document.querySelectorAll('.lang-toggle');
      langToggles.forEach(function(btn) { btn.style.display = ''; });
      var savedLang = localStorage.getItem('brisa-lang') || 'es';
      document.documentElement.lang = savedLang;
      updateToggleButton();
    }
  }

  // Wait for DOM ready
  document.addEventListener('DOMContentLoaded', function() {

    // Set up language toggle buttons
    var langButtons = document.querySelectorAll('.lang-toggle');
    langButtons.forEach(function(btn) {
      btn.addEventListener('click', toggleLanguage);
    });
    updateToggleButton();

    // Set up region toggle buttons
    var regionBtns = document.querySelectorAll('.region-btn');
    regionBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        applyRegion(btn.dataset.region);
      });
    });

    // Initialize region
    initRegion();

    // ─── FAQ ACCORDION ───────────────────────────
    var faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function(item) {
      var question = item.querySelector('.faq-q');
      if (question) {
        question.addEventListener('click', function() {
          item.classList.toggle('open');
        });
      }
    });

    // ─── FADE-IN AL SCROLL ───────────────────────
    var fadeEls = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
      });

      fadeEls.forEach(function(el) { observer.observe(el); });
    } else {
      fadeEls.forEach(function(el) { el.classList.add('visible'); });
    }

    // ─── SMOOTH SCROLL EN ANCLAS ─────────────────
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          var offset = 80;
          var targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
      });
    });

  });
})();
