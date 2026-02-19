document.addEventListener("DOMContentLoaded", function () {

    // 3. Mobile navigation menu
    const menuBtn = document.getElementById("menuBtn");
    const navMenu = document.getElementById("navMenu");

    if (menuBtn) {
        menuBtn.onclick = function () {
            if (navMenu) {
                navMenu.classList.toggle("show");
            } else {
                // Fallback for pages that might still use the old nav structure
                const fallbackNav = document.getElementById("nav");
                if (fallbackNav) fallbackNav.classList.toggle("active");
            }
        };
    }

    // Dynamic Year Footer Update
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 7. Dynamic statistics counter
    const counterEl = document.getElementById("counter");
    if (counterEl) {
        let count = 0;
        let target = parseInt(counterEl.getAttribute("data-target") || 10000);
        let step = Math.ceil(target / 100);

        let interval = setInterval(() => {
            count += step;
            if (count >= target) {
                count = target;
                clearInterval(interval);
            }
            counterEl.innerText = count + "+";
        }, 30);
    }

    // 9. Page scroll animations
    window.addEventListener("scroll", () => {
        document.querySelectorAll(".animate").forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add("visible");
            }
        });
    });

    // Trigger initial scroll animations on load
    window.dispatchEvent(new Event("scroll"));

});
