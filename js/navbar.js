window.addEventListener("scroll", function () {
    const topBar = document.querySelector(".top-bar");
    const navbar = document.querySelector(".corporate-nav");
    const navMenu = document.getElementById("navMenu");

    // When scrolling past 40px (the height of the top bar)
    if (window.scrollY > 40) {
        if (topBar) topBar.classList.add("hidden");
        if (navbar) navbar.classList.add("docked");
    } else {
        if (topBar) topBar.classList.remove("hidden");
        if (navbar) navbar.classList.remove("docked");
    }

    // Close mobile menu on scroll
    if (navMenu && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
    }
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const navMenu = document.getElementById('navMenu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Toggle icon between hamburger and close
            menuBtn.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
        });
    }
});
