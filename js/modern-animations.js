
// 1. Lenis Smooth Scroll (Professional Industry Standard)
// We will load Lenis via CDN in HTML, then initialize it here.
let lenis;
if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

// 2. IntersectionObserver reveal animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            // Optional: unobserve after revealing if you only want it to happen once
            // observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(el => {
    observer.observe(el);
});

// 3. Magnetic button effect
document.querySelectorAll(".magnetic").forEach(btn => {
    btn.addEventListener("mousemove", e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0,0)";
    });
});

// 4. Parallax hero (GPU optimized)
const hero = document.querySelector(".hero, .page-header");
if (hero) {
    window.addEventListener("scroll", () => {
        const offset = window.scrollY;
        // Limit parallax to when hero is in view
        if (offset < window.innerHeight) {
            hero.style.transform = `translateY(${offset * 0.4}px)`;
        }
    });
}

// 5. Advanced cursor glow effect (hidden on mobile via CSS)
const cursor = document.createElement("div");
cursor.className = "cursor-glow";
document.body.appendChild(cursor);

document.addEventListener("mousemove", e => {
    // requestAnimationFrame for smoother cursor
    requestAnimationFrame(() => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
    });
});

// 6. Smooth navbar morph animation (Enhancing existing logic)


// Ensure GSAP works if loaded
if (typeof gsap !== 'undefined') {
    // Example global GSAP
    gsap.from(".hero h1, .page-header h1", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.2
    });
    
    gsap.from(".hero p, .page-header p", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.4
    });
    
    gsap.from(".hero .btn, .page-header .btn", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.6
    });
}
