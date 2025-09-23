// Mobile popup nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const btn  = document.querySelector('.nav-toggle');
  const menu = document.getElementById('site-menu');
  if (!btn || !menu) return;

  const openMenu = () => {
    menu.classList.add('open');
    btn.classList.add('open');
    document.body.classList.add('nav-open');
    btn.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    // clear legacy inline styles
    menu.style.display = menu.style.opacity = menu.style.visibility = '';
  };

  const closeMenu = () => {
    menu.classList.remove('open');
    btn.classList.remove('open');
    document.body.classList.remove('nav-open');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    menu.style.display = menu.style.opacity = menu.style.visibility = '';
  };

  btn.addEventListener('click', () => {
    (menu.classList.contains('open') ? closeMenu : openMenu)();
  });

  // Close on link click, ESC, or resize to desktop
  menu.addEventListener('click', e => { if (e.target.tagName === 'A') closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 768) closeMenu(); });
});
