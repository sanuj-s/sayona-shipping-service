function initializeNavbar() {

    window.addEventListener("scroll", function () {

        const navbar = document.querySelector(".navbar"); // Using header as navbar

        if (navbar) {
            if (window.scrollY > 50)
                navbar.classList.add("scrolled");
            else
                navbar.classList.remove("scrolled");
        }
    });

    // Keep mobile menu functionality as it's critical
    const menuBtn = document.getElementById("menuBtn");
    const navMenu = document.getElementById("navMenu");

    if (menuBtn) {
        menuBtn.onclick = function () {
            if (navMenu) {
                navMenu.classList.toggle("active");
            }
        };
    }
}
