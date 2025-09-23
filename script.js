document.addEventListener('DOMContentLoaded', () => {
  // ----- Mobile nav toggle -----
  const btn  = document.querySelector('.nav-toggle');
  const menu = document.querySelector('#site-menu') || document.querySelector('.nav-links');

  if (btn && menu) {
    const openMenu = () => {
      menu.classList.add('open');
      btn.classList.add('open');
      document.body.classList.add('nav-open');
      btn.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
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

    menu.addEventListener('click', e => {
      if (e.target.tagName === 'A') closeMenu();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  // ----- Floating Back-to-top -----
  (function(){
    const back = document.createElement('button');
    back.className = 'back-to-top';
    back.type = 'button';
    back.setAttribute('aria-label','Back to top');
    back.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5l7 7-1.41 1.41L13 9.83V20h-2V9.83L6.41 13.41 5 12z" fill="currentColor"/></svg>';
    document.body.appendChild(back);

    const toggle = () => {
      if (window.scrollY > 200) back.classList.add('show');
      else back.classList.remove('show');
    };
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();

    back.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  // ----- Quicknav active highlighting -----
  (function(){
    const links = Array.from(document.querySelectorAll('.menu-quicknav a[href^="#"]'));
    if (!links.length) return;

    const byId = Object.fromEntries(
      links.map(a => [a.getAttribute('href').slice(1), a])
    );
    const sections = Object.keys(byId)
      .map(id => document.getElementById(id))
      .filter(Boolean);

    const activate = (id) => {
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    };

    // Activate on click
    links.forEach(a => {
      a.addEventListener('click', () => {
        const id = a.getAttribute('href').slice(1);
        activate(id);
      });
    });

    // Activate on scroll
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) activate(entry.target.id);
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      sections.forEach(sec => io.observe(sec));
    } else {
      const onScroll = () => {
        let chosen = sections[0]?.id;
        const mid = window.scrollY + window.innerHeight * 0.5;
        sections.forEach(sec => {
          const top = sec.offsetTop;
          if (mid >= top) chosen = sec.id;
        });
        if (chosen) activate(chosen);
      };
      document.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  })();
});
