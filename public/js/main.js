const hd = document.querySelector('.site-header'), tg = document.querySelector('.nav-toggle'), body = document.body;
const sc = () => hd.classList.toggle('scrolled', window.scrollY > 8); sc(); window.addEventListener('scroll', sc, { passive: true });
const setMenu = (o) => { body.classList.toggle('menu-open', o); tg.setAttribute('aria-expanded', o); tg.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); };
tg.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
document.querySelectorAll('.mpanel a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
window.addEventListener('resize', () => { if (window.innerWidth > 1020) setMenu(false); });
document.querySelectorAll('.filters').forEach(f => f.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  f.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
  document.querySelectorAll('[data-cat]').forEach(c => c.hidden = b.dataset.f !== 'all' && c.dataset.cat !== b.dataset.f);
}));
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1 }) : null;
document.querySelectorAll('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));
document.querySelectorAll('form').forEach(f => f.addEventListener('submit', () => { const b = f.querySelector('button.btn'); if (b) setTimeout(() => { b.disabled = true; b.textContent = 'Submitting...'; }, 0); }));
