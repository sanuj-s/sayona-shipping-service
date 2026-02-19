document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contactForm");
    const message = document.getElementById("formMessage");

    if (form) {
        form.addEventListener("submit", function (e) {

            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const text = document.getElementById("message").value.trim();

            if (name.length < 3) {
                message.innerText = "Name must be at least 3 characters";
                return;
            }

            if (!email.includes("@")) {
                message.innerText = "Invalid email";
                return;
            }

            if (text.length < 5) {
                message.innerText = "Message too short";
                return;
            }

            message.innerText = "Message sent successfully";

            form.reset();

        });
    }

});
