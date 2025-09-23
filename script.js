document.addEventListener('DOMContentLoaded', () => {
  // ===== Mobile nav toggle =====
  const btn  = document.querySelector('.nav-toggle');
  const menu = document.querySelector('#site-menu') || document.querySelector('.nav-links');
  if (btn && menu) {
    const setState = (open) => {
      menu.classList.toggle('open', open);
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      menu.style.display = menu.style.opacity = menu.style.visibility = '';
    };
    btn.addEventListener('click', () => setState(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setState(false)));
    window.addEventListener('resize', () => { if (window.innerWidth > 768) setState(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setState(false); });
  }

  // ===== Floating Back-to-top =====
  (function(){
    const b = document.createElement('button');
    b.className = 'back-to-top'; b.type = 'button';
    b.setAttribute('aria-label','Back to top');
    b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5l7 7-1.41 1.41L13 9.83V20h-2V9.83L6.41 13.41 5 12z" fill="currentColor"/></svg>';
    document.body.appendChild(b);
    const show = () => { (window.scrollY > 200 ? b.classList.add : b.classList.remove).call(b.classList,'show'); };
    window.addEventListener('scroll', show, { passive:true }); show();
    b.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  })();

  // ===== Quicknav scroll-spy (stable on mobile + bottom) =====
  (function(){
    const links = Array.from(document.querySelectorAll('.menu-quicknav a[href^="#"]'));
    if (!links.length) return;

    const sections = links
      .map(a => a.getAttribute('href').slice(1))
      .map(id => document.getElementById(id))
      .filter(Boolean);

    const activate = (id) => {
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    };

    const headerH = () => (document.querySelector('header')?.getBoundingClientRect().height || 0);
    const quickH  = () => (document.querySelector('.menu-quicknav')?.getBoundingClientRect().height || 0);
    const offset  = () => Math.round(headerH() + quickH() + 8);

    let tops = [];
    const recalc = () => { tops = sections.map(el => Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset())); };

    const onScroll = () => {
      const y = window.scrollY + 1;
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
        activate(sections[sections.length - 1].id); return;
      }
      let idx = 0;
      for (let i = 0; i < tops.length; i++) { if (y >= tops[i]) idx = i; else break; }
      activate(sections[idx].id);
    };

    links.forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        const y = el.getBoundingClientRect().top + window.scrollY - offset();
        window.scrollTo({ top: y, behavior: 'smooth' });
        activate(id);
      });
    });

    recalc(); onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });
    window.addEventListener('resize', () => { recalc(); onScroll(); });
    window.addEventListener('orientationchange', () => setTimeout(() => { recalc(); onScroll(); }, 250));
    setTimeout(() => { recalc(); onScroll(); }, 300);
  })();

  // ===== FORCE mobile header sizes with inline !important (Home + Visit) =====
  (function(){
    if (window.innerWidth > 900) return; // only phones/tablets

    const path = (location.pathname || '').toLowerCase();
    const isHome  = !!document.querySelector('.hero') && (path.endsWith('/index.html') || path === '/' || path === '' || path.endsWith('/'));
    const isVisit = /location|visit/.test(path) || /visit/i.test(document.title) || /visit/i.test(document.querySelector('.page-hero h1')?.textContent || '');

    // Helper to set inline styles with !important
    const setImp = (el, prop, val) => { if (el) el.style.setProperty(prop, val, 'important'); };

    if (isHome) {
      const h1 = document.querySelector('.hero h1') || document.querySelector('.hero .hero-content h1');
      const p  = document.querySelector('.hero p')  || document.querySelector('.hero .hero-content p');
      const heroContent = document.querySelector('.hero .hero-content');
      setImp(h1, 'font-size', '1.05rem');
      setImp(h1, 'line-height', '1.15');
      setImp(p , 'font-size', '.90rem');
      setImp(p , 'line-height', '1.30');
      setImp(heroContent, 'padding', '1.6rem 1rem');
    } else if (isVisit) {
      const h1 = document.querySelector('.page-hero h1');
      const p  = document.querySelector('.page-hero p');
      const hero = document.querySelector('.page-hero');
      setImp(h1, 'font-size', '1.05rem');
      setImp(h1, 'line-height', '1.15');
      setImp(p , 'font-size', '.95rem');
      setImp(p , 'line-height', '1.35');
      setImp(hero, 'padding', '3.2rem 1rem 1.6rem');
    } else {
      // Menu + About: make headers bigger on phones
      const h1 = document.querySelector('.page-hero h1');
      setImp(h1, 'font-size', '1.95rem');
      setImp(h1, 'line-height', '1.20');
      document.querySelectorAll('.menu-section h2').forEach(h2 => {
        setImp(h2, 'font-size', '1.65rem');
        setImp(h2, 'line-height', '1.25');
      });
      document.querySelectorAll('.about-content h2').forEach(h2 => {
        setImp(h2, 'font-size', '1.55rem');
        setImp(h2, 'line-height', '1.25');
      });
    }

    // Re-apply after orientation change
    window.addEventListener('orientationchange', () => setTimeout(() => {
      // rerun the block
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
    }, 300));
  })();

  // ===== Hero video safe-play =====
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    const p = heroVideo.play?.();
    if (p && typeof p.catch === 'function') {
      const tryPlay = () => { heroVideo.play?.().catch(()=>{}); };
      p.catch(()=>{
        document.addEventListener('touchstart', tryPlay, { once:true, passive:true });
        document.addEventListener('click', tryPlay, { once:true });
      });
    }
  }
});
