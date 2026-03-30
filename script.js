(function () {
  'use strict';

  const header = document.getElementById('site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const allLinks = document.querySelectorAll('a[href^="#"]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const revealItems = document.querySelectorAll('[data-reveal]');
  const sections = document.querySelectorAll('main section[id]');

  function setHeaderState() {
    header.classList.toggle('scrolled', window.scrollY > 10);
    updateActiveLink();
  }

  function setMenu(open) {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function updateActiveLink() {
    const offset = window.scrollY + (header?.offsetHeight || 80) + 24;
    let activeId = '';

    sections.forEach((section) => {
      if (offset >= section.offsetTop) activeId = section.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
    });
  }

  allLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      const headerOffset = header ? header.offsetHeight + 8 : 82;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({ top, behavior: 'smooth' });
      if (history.pushState) history.pushState(null, '', targetId);
      setMenu(false);
    });
  });

  menuToggle?.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('open');
    setMenu(open);
  });

  mobileLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  document.addEventListener('click', (event) => {
    if (!mobileMenu?.classList.contains('open')) return;
    if (mobileMenu.contains(event.target) || menuToggle.contains(event.target)) return;
    setMenu(false);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('revealed'));
  }

  window.addEventListener('scroll', setHeaderState, { passive: true });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 980) setMenu(false);
  });

  setHeaderState();
})();
