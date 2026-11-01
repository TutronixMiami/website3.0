(() => {
// Mobile menu and current-page state for the static site pages.
const nav = document.querySelector('.site-nav');
const toggle = nav && nav.querySelector('.nav-toggle');
const menu = nav && nav.querySelector('.nav-mid');

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
const normalize = path => path.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/\/$/, '') || '/';
const here = normalize(location.pathname);
document.querySelectorAll('.site-nav .nav-mid a').forEach((a) => {
  const target = new URL(a.href, location.href);
  if (!target.hash && normalize(target.pathname) === here) a.setAttribute('aria-current', 'page');
});

})();
