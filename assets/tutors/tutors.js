// Shared behavior for every page: navigation, scroll effects, and reveal animations.
document.documentElement.classList.remove('no-js');

const nav = document.querySelector('.site-nav');
const toggle = nav && nav.querySelector('.nav-toggle');
const menu = nav && nav.querySelector('.nav-mid');
const progress = document.querySelector('.scroll-progress');

function setMenu(open) {
  nav.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

if (toggle) {
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); toggle.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target)) setMenu(false);
  });
  matchMedia('(min-width: 1061px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
}

// Mark the current page in the nav.
const here = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
document.querySelectorAll('.site-nav .nav-mid a').forEach((a) => {
  const target = new URL(a.href, location.href);
  if (!target.hash && (target.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/') === here) a.setAttribute('aria-current', 'page');
});

// Solid nav once scrolled; hide it when scrolling down, show it when scrolling up.
let lastY = scrollY;
let ticking = false;
function onScroll() {
  const y = scrollY;
  if (nav) {
    nav.classList.toggle('scrolled', y > 24);
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    if (goingDown && y > 400 && !nav.classList.contains('open')) nav.classList.add('hidden');
    else if (goingUp || y < 400) nav.classList.remove('hidden');
  }
  if (progress) {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
  }
  lastY = y;
  ticking = false;
}
addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();

// Keep the nav visible while keyboard users tab through it.
if (nav) nav.addEventListener('focusin', () => nav.classList.remove('hidden'));

// Reveal elements as they scroll into view.
const revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('on'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('on'));
}

// Photos with a data-fallback attribute show their initials if the image file is missing.
document.querySelectorAll('img[data-fallback]').forEach((img) => {
  const frame = img.closest('[data-initials]');
  if (!frame) return;
  const fail = () => frame.classList.add('no-photo');
  if (img.complete && img.naturalWidth === 0) fail();
  else img.addEventListener('error', fail);
});
