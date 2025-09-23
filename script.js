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
      // clear any legacy inline styles
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

  // ===== Quicknav scroll-spy (robust on iPhone + bottom of page) =====
  (function(){
    const links = Array.from(document.querySelectorAll('.menu-quicknav a[href^="#"]'));
    if (!links.length) return;

    const targets = links
      .map(a => a.getAttribute('href').slice(1))
      .map(id => document.getElementById(id))
      .filter(Boolean);

    // get vertical offset to clear sticky header + quicknav
    const getOffset = () => {
      const header = document.querySelector('header');
      const qnav   = document.querySelector('.menu-quicknav');
      const h = header ? header.getBoundingClientRect().height : 0;
      const q = qnav   ? qnav.getBoundingClientRect().height   : 0;
      return Math.round(h + q + 8); // small breathing room
    };

    let offset = getOffset();

    // cache section tops (accounting for offset)
    let tops = [];
    const recalc = () => {
      offset = getOffset();
      tops = targets.map(el => Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset));
    };

    const activate = (el) => {
      const id = el.id;
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    };

    const onScroll = () => {
      const y = window.scrollY + 1; // epsilon to avoid flicker at boundaries
      // If near bottom, force last section
      const bottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
      let idx;
      if (bottom) {
        idx = targets.length - 1;
      } else {
        // last section whose top is <= current scroll
        idx = 0;
        for (let i = 0; i < tops.length; i++) {
          if (y >= tops[i]) idx = i; else break;
        }
      }
      activate(targets[idx]);
    };

    // click: smooth scroll and set active immediately
    links.forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        const y = el.getBoundingClientRect().top + window.scrollY - getOffset();
        window.scrollTo({ top: y, behavior: 'smooth' });
        links.forEach(x => x.classList.remove('active'));
        a.classList.add('active');
      });
    });

    // init + listeners
    recalc(); onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });
    window.addEventListener('resize', () => { recalc(); onScroll(); });
    window.addEventListener('orientationchange', () => { setTimeout(()=>{ recalc(); onScroll(); }, 250); });
    // iOS Safari sometimes reports 0 heights until paint; recalc once more
    setTimeout(() => { recalc(); onScroll(); }, 300);
  })();

  // ===== Hero video safe-play (unchanged) =====
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    const p = heroVideo.play?.();
    if (p && typeof p.catch === 'function') {
      const tryPlay = () => { heroVideo.play?.().catch(()=>{}); };
      p.catch(()=>{ document.addEventListener('touchstart', tryPlay, { once:true, passive:true }); document.addEventListener('click', tryPlay, { once:true }); });
    }
  }
});
