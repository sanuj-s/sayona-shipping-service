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

            // All fields grabbed by ID (reliable)
            const name = (document.getElementById("name")?.value || '').trim();
            const email = (document.getElementById("email")?.value || '').trim();
            const phone = (document.getElementById("phone")?.value || '').trim();
            const company = (document.getElementById("company")?.value || '').trim();
            const origin = (document.getElementById("origin")?.value || '').trim();
            const destination = (document.getElementById("destination")?.value || '').trim();
            const text = (document.getElementById("message")?.value || '').trim();
            const cargoType = industrySelect ? industrySelect.value : '';

            message.style.color = "red";

            // Validation
            if (name.length < 3) {
                document.getElementById("name").style.border = "1px solid red";
                message.innerText = "Name must be at least 3 characters";
                return;
            } else {
                document.getElementById("name").style.border = "";
            }

            if (!email.includes("@")) {
                document.getElementById("email").style.border = "1px solid red";
                message.innerText = "Invalid email";
                return;
            } else {
                document.getElementById("email").style.border = "";
            }

            if (text.length < 5) {
                document.getElementById("message").style.border = "1px solid red";
                message.innerText = "Message too short";
                return;
            } else {
                document.getElementById("message").style.border = "";
            }

            // API Logic
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // We assume backend has a submitQuote route available in window.api
            const apiMethod = window.api.submitQuote || window.api.submitContact;
            const payload = { 
                name, email, phone, company, origin, destination, 
                cargoType, message: text 
            };

            apiMethod(payload)
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
