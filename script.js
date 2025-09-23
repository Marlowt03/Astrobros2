document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const btn  = document.querySelector('.nav-toggle');
  const menu = document.querySelector('#site-menu') || document.querySelector('.nav-links');
  if (btn && menu) {
    const setState = (open) => {
      menu.classList.toggle('open', open);
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    };
    btn.addEventListener('click', () => setState(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setState(false)));
    window.addEventListener('resize', () => { if (window.innerWidth > 768) setState(false); });
  }

  // Floating Back-to-top
  (function(){
    const b = document.createElement('button');
    b.className = 'back-to-top'; b.type = 'button';
    b.setAttribute('aria-label','Back to top');
    b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5l7 7-1.41 1.41L13 9.83V20h-2V9.83L6.41 13.41 5 12z" fill="currentColor"/></svg>';
    document.body.appendChild(b);
    const show = () => { if (window.scrollY > 200) b.classList.add('show'); else b.classList.remove('show'); };
    window.addEventListener('scroll', show, { passive:true }); show();
    b.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  })();

  // Quicknav active state (works on iOS/Android + desktop)
  (function(){
    const links = Array.from(document.querySelectorAll('.menu-quicknav a[href^="#"]'));
    if (!links.length) return;

    const byId = Object.fromEntries(links.map(a => [a.getAttribute('href').slice(1), a]));
    const sections = Object.keys(byId).map(id => document.getElementById(id)).filter(Boolean);

    const activate = (id) => {
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    };

    // Activate on click immediately
    links.forEach(a => a.addEventListener('click', () => activate(a.getAttribute('href').slice(1))));

    // Activate on scroll — threshold-only, no rootMargin (more reliable on mobile)
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        // choose the section with the largest intersection ratio
        let best = null, ratio = 0;
        entries.forEach(e => { if (e.intersectionRatio > ratio) { ratio = e.intersectionRatio; best = e.target; } });
        if (best) activate(best.id);
      }, { threshold: [0.25, 0.5, 0.75] });
      sections.forEach(sec => io.observe(sec));
    } else {
      // Fallback
      const onScroll = () => {
        const mid = window.scrollY + window.innerHeight * 0.5;
        let chosen = sections[0]?.id;
        sections.forEach(sec => {
          const top = sec.offsetTop, bottom = top + sec.offsetHeight;
          if (mid >= top && mid < bottom) chosen = sec.id;
        });
        if (chosen) activate(chosen);
      };
      document.addEventListener('scroll', onScroll, { passive:true });
      onScroll();
    }

    // Initialize based on current hash or first section
    const startId = location.hash ? location.hash.slice(1) : (sections[0]?.id);
    if (startId) activate(startId);
    window.addEventListener('hashchange', () => { const id = location.hash.slice(1); if (id) activate(id); });
  })();
});
