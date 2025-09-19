import ScrollReveal from 'scrollreveal';

const header = document.querySelector('header') as HTMLElement | null;

window.addEventListener('scroll', () => {
  if (!header) return;
  header.classList.toggle('sticky', window.scrollY > 80);
});

// Open Menu
const menu = document.querySelector('#menu-icon') as HTMLElement | null;
const navlist = document.querySelector('.navlist') as HTMLElement | null;

menu?.addEventListener('click', () => {
  menu.classList.toggle('bx-x');
  navlist?.classList.toggle('open');
});

// Close menu on scroll
window.addEventListener('scroll', () => {
  menu?.classList.remove('bx-x');
  navlist?.classList.remove('open');
});

// ScrollReveal Initialization
const sr = ScrollReveal({
  origin: 'top',
  distance: '85px',
  duration: 2500,
  reset: false
});

sr.reveal('.home-text', { delay: 300 });
sr.reveal('.home-img', { delay: 400 });
sr.reveal('.container', { delay: 400 });

sr.reveal('.about-img', {});
sr.reveal('.about-text', { delay: 300 });

sr.reveal('.middle-text', {});
sr.reveal('.row-btn, .shop-content', { delay: 300 });

sr.reveal('.review, .contact', { delay: 300 });
sr.reveal('.reviews-content', { delay: 300 });
