function initializeScrollReveal() {

    if (typeof ScrollReveal !== 'undefined') {
        ScrollReveal().reveal(".card", {
            distance: "60px",
            duration: 1000,
            origin: "bottom",
            interval: 200
        });

        // Keep other essential reveals
        ScrollReveal().reveal('.section-title', { origin: 'top', distance: '20px', duration: 600 });
        ScrollReveal().reveal('.service-row > div:first-child', { origin: 'left' });
        ScrollReveal().reveal('.service-row > div:last-child', { origin: 'right' });
        ScrollReveal().reveal('.hero-content', { origin: 'bottom', distance: '30px' });
        ScrollReveal().reveal('.stat-item', { origin: 'bottom', interval: 150 });
    }

}
