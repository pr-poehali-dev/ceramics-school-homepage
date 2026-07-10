/* ============================================================
   Дымов Керамика — общий JS статической вёрстки.
   ТОЛЬКО визуальный интерактив (без корзины, API и фильтрации).
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initScrollReveal();
    initToTop();
    initVisualFilters();
  });

  /* ---------- Мобильное меню (бургер) ---------- */
  function initMobileMenu() {
    var burger = document.querySelector('[data-burger]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!burger || !menu) return;

    burger.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });

    // закрывать по клику на ссылку
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
      });
    });
  }

  /* ---------- Появление блоков при скролле ---------- */
  function initScrollReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length || !('IntersectionObserver' in window)) {
      items.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Кнопка «наверх» ---------- */
  function initToTop() {
    var btn = document.querySelector('[data-to-top]');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Визуальные кнопки-фильтры (formats.html) ----------
     Только переключают активное состояние.
     НИЧЕГО не фильтруют — данные статичны. */
  function initVisualFilters() {
    var groups = document.querySelectorAll('[data-filter-group]');
    groups.forEach(function (group) {
      group.querySelectorAll('[data-filter-btn]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          group.querySelectorAll('[data-filter-btn]').forEach(function (b) {
            b.classList.remove('is-active');
          });
          btn.classList.add('is-active');
        });
      });
    });
  }
})();
