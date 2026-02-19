document.addEventListener("DOMContentLoaded", function () {

    const menuBtn = document.getElementById("menuBtn");
    const nav = document.getElementById("nav");

    if (menuBtn) {
        menuBtn.addEventListener("click", function () {
            nav.classList.toggle("active");
        });
    }

    // Dynamic Year (Keeping this small convenience update from previous main.js as it's not conflicting and very useful)
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

});
