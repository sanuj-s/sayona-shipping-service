document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contactForm");
    const message = document.getElementById("formMessage");
    const industrySelect = document.getElementById("industrySelect");

    // Auto-select industry from URL
    const urlParams = new URLSearchParams(window.location.search);
    const industryParam = urlParams.get('industry');
    if (industryParam && industrySelect) {
        Array.from(industrySelect.options).forEach(opt => {
            if (opt.value.includes(industryParam) || opt.text.includes(industryParam)) {
                industrySelect.value = opt.value;
            }
        });
    }

    if (form) {
        form.addEventListener("submit", function (e) {

            e.preventDefault();

            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const textInput = document.getElementById("message");

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const text = textInput.value.trim();

            message.style.color = "red";

            // 4. Contact form validation UI visually
            if (name.length < 3) {
                nameInput.style.border = "1px solid red";
                message.innerText = "Name must be at least 3 characters";
                return;
            } else {
                nameInput.style.border = "";
            }

            if (!email.includes("@")) {
                emailInput.style.border = "1px solid red";
                message.innerText = "Invalid email";
                return;
            } else {
                emailInput.style.border = "";
            }

            if (text.length < 5) {
                textInput.style.border = "1px solid red";
                message.innerText = "Message too short";
                return;
            } else {
                textInput.style.border = "";
            }

            // API Logic
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            window.api.submitContact({ name, email, phone: '', subject: industrySelect ? industrySelect.value : 'General Inquiry', message: text })
                .then(() => {
                    message.style.color = "green";
                    message.innerText = "Message sent successfully! We will get back to you soon.";
                    form.reset();
                })
                .catch(err => {
                    message.style.color = "red";
                    message.innerText = err.message || "Failed to send message. Please try again.";
                })
                .finally(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });

        });
    }

});
