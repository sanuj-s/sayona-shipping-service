/* Navbar scroll behavior — used by all pages */
window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".corporate-nav");

    if (window.scrollY > 60) {
        if (navbar) navbar.classList.add("docked");
    } else {
        if (navbar) navbar.classList.remove("docked");
    }
}, { passive: true });

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const navMenu = document.getElementById('navMenu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuBtn.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });

        // Close on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuBtn.textContent = '☰';
            });
        });
    }
});
