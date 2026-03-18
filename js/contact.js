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

            // Contact and Quote generic fields
            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const textInput = document.getElementById("message");

            const name = nameInput?.value.trim() || '';
            const email = emailInput?.value.trim() || '';
            const text = textInput?.value.trim() || '';

            // Additional Quote-specific fields (grabbing by position since they lack IDs)
            const inputs = form.querySelectorAll('input.form-control');
            // Hacky fallback since inputs don't have IDs. 
            // Name: inputs[0], Company: inputs[1], Email: inputs[2], Phone: inputs[3], Origin: inputs[4], Dest: inputs[5]
            const company = inputs[1]?.value.trim() || '';
            const phone = inputs[3]?.value.trim() || '';
            const origin = inputs[4]?.value.trim() || '';
            const destination = inputs[5]?.value.trim() || '';
            const cargoType = industrySelect ? industrySelect.value : '';

            message.style.color = "red";

            // 4. Contact form validation UI visually
            if (name.length < 3) {
                if (nameInput) nameInput.style.border = "1px solid red";
                message.innerText = "Name must be at least 3 characters";
                return;
            } else {
                if (nameInput) nameInput.style.border = "";
            }

            if (!email.includes("@")) {
                if (emailInput) emailInput.style.border = "1px solid red";
                message.innerText = "Invalid email";
                return;
            } else {
                if (emailInput) emailInput.style.border = "";
            }

            if (text.length < 5) {
                if (textInput) textInput.style.border = "1px solid red";
                message.innerText = "Message too short";
                return;
            } else {
                if (textInput) textInput.style.border = "";
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
                cargo_type: cargoType, message: text 
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
