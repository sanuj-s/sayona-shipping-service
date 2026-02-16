import './style.css'

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(targetId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  });
});

// Mobile Menu Toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

if (mobileBtn && mobileMenu) {
  mobileBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
  });
}
