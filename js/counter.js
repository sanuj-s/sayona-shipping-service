function initializeCounter() {

    const counters = document.querySelectorAll(".counter");

    counters.forEach(counter => {

        let count = 0;
        const target = +counter.innerText;

        function update() {

            count += target / 100;

            if (count < target) {

                counter.innerText = Math.floor(count);
                requestAnimationFrame(update);

            }
            else
                counter.innerText = target;

        }

        update();

    });

}
