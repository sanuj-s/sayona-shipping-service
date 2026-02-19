function initializeCounter() {

    const counters = document.querySelectorAll(".counter");

    counters.forEach(counter => {

        const target = Number(counter.getAttribute("data-target"));

        let count = 0;

        const update = () => {

            const increment = target / 100;

            if (count < target) {

                count += increment;
                counter.innerText = Math.ceil(count);

                requestAnimationFrame(update);

            } else {

                counter.innerText = target + "+";

            }

        };

        update();

    });

}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCounter);
