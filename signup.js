
/* =========================================
   CARVIBE SIGNUP PAGE JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const html = document.documentElement;

    const themeToggle = document.getElementById("cv-signup-theme");
    const themeIcon = document.getElementById("cv-signup-theme-icon");
    const rtlToggle = document.getElementById("cv-signup-rtl");

    const signupForm = document.getElementById("cv-signup-form");
    const nameInput = document.getElementById("cv-signup-name");
    const emailInput = document.getElementById("cv-signup-email");
    const passwordInput = document.getElementById("cv-signup-password");
    const confirmPasswordInput = document.getElementById(
        "cv-signup-confirm-password"
    );
    const termsInput = document.getElementById("cv-signup-terms");
    const message = document.getElementById("cv-signup-message");

    /* =====================================
       1. DARK MODE
    ===================================== */

    function applyTheme(theme) {
        const selectedTheme = theme === "dark" ? "dark" : "light";

        html.setAttribute("data-theme", selectedTheme);

        if (themeIcon) {
            themeIcon.className = selectedTheme === "dark"
                ? "fa-solid fa-sun"
                : "fa-solid fa-moon";
        }

        if (themeToggle) {
            const label = selectedTheme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode";

            themeToggle.setAttribute("aria-label", label);
            themeToggle.setAttribute("title", label);
        }

        try {
            localStorage.setItem("carvibe-theme", selectedTheme);
        } catch (error) {
            // Page continues to work if storage is unavailable.
        }
    }

    let savedTheme = "light";

    try {
        savedTheme = localStorage.getItem("carvibe-theme") || "light";
    } catch (error) {
        savedTheme = "light";
    }

    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            const nextTheme =
                html.getAttribute("data-theme") === "dark"
                    ? "light"
                    : "dark";

            applyTheme(nextTheme);
        });
    }

    /* =====================================
       2. RTL / LTR
    ===================================== */

    function applyDirection(direction) {
        const selectedDirection = direction === "rtl" ? "rtl" : "ltr";
        const isRTL = selectedDirection === "rtl";

        html.setAttribute("dir", selectedDirection);
        html.setAttribute("lang", isRTL ? "ar" : "en");

        if (rtlToggle) {
            rtlToggle.innerHTML = isRTL
                ? '<i class="fa-solid fa-arrow-right" aria-hidden="true"></i><span>LTR</span>'
                : '<i class="fa-solid fa-align-right" aria-hidden="true"></i><span>RTL</span>';

            rtlToggle.setAttribute(
                "aria-label",
                isRTL ? "Switch to left-to-right layout" : "Switch to right-to-left layout"
            );

            rtlToggle.setAttribute(
                "title",
                isRTL ? "Switch to LTR" : "Switch to RTL"
            );
        }

        try {
            localStorage.setItem("carvibe-direction", selectedDirection);
        } catch (error) {
            // Page continues to work if storage is unavailable.
        }
    }

    let savedDirection = "ltr";

    try {
        savedDirection = localStorage.getItem("carvibe-direction") || "ltr";
    } catch (error) {
        savedDirection = "ltr";
    }

    applyDirection(savedDirection);

    if (rtlToggle) {
        rtlToggle.addEventListener("click", function () {
            const nextDirection =
                html.getAttribute("dir") === "rtl" ? "ltr" : "rtl";

            applyDirection(nextDirection);
        });
    }

    /* =====================================
       3. PASSWORD VISIBILITY
       ONE BUTTON PER INPUT
    ===================================== */

    const passwordToggles = document.querySelectorAll(
        ".cv-signup-password-toggle"
    );

    passwordToggles.forEach(function (toggle) {
        // Avoid adding the same listener more than once.
        if (toggle.dataset.initialized === "true") {
            return;
        }

        toggle.dataset.initialized = "true";

        toggle.addEventListener("click", function () {
            const targetId = toggle.getAttribute("data-target");
            const input = document.getElementById(targetId);
            const icon = toggle.querySelector("i");

            if (!input || !icon) {
                return;
            }

            const shouldShow = input.type === "password";

            input.type = shouldShow ? "text" : "password";

            // Change the existing icon; do not create another icon.
            icon.classList.toggle("fa-eye", !shouldShow);
            icon.classList.toggle("fa-eye-slash", shouldShow);

            const label = shouldShow
                ? "Hide password"
                : "Show password";

            toggle.setAttribute("aria-label", label);
            toggle.setAttribute("title", label);
            toggle.setAttribute("aria-pressed", String(shouldShow));
        });
    });

    /* =====================================
       4. FORM MESSAGE HELPERS
    ===================================== */

    function showMessage(text, type) {
        if (!message) {
            return;
        }

        message.textContent = text;
        message.className = "cv-signup-message " +
            (type === "success" ? "is-success" : "is-error");
    }

    function clearMessage() {
        if (!message) {
            return;
        }

        message.textContent = "";
        message.className = "cv-signup-message";
    }

    /* =====================================
       5. SIGNUP FORM VALIDATION
    ===================================== */

    if (signupForm) {
        signupForm.addEventListener("submit", function (event) {
            event.preventDefault();
            clearMessage();

            const fullName = nameInput ? nameInput.value.trim() : "";
            const email = emailInput ? emailInput.value.trim() : "";
            const password = passwordInput ? passwordInput.value : "";
            const confirmPassword = confirmPasswordInput
                ? confirmPasswordInput.value
                : "";

            if (!fullName) {
                showMessage("Please enter your full name.");
                if (nameInput) nameInput.focus();
                return;
            }

            if (!email || !emailInput.checkValidity()) {
                showMessage("Please enter a valid email address.");
                if (emailInput) emailInput.focus();
                return;
            }

            if (password.length < 8) {
                showMessage("Your password must contain at least 8 characters.");
                if (passwordInput) passwordInput.focus();
                return;
            }

            if (password !== confirmPassword) {
                showMessage("Your passwords do not match.");
                if (confirmPasswordInput) confirmPasswordInput.focus();
                return;
            }

            if (!termsInput || !termsInput.checked) {
                showMessage("Please agree to the Terms of Service and Privacy Policy.");
                if (termsInput) termsInput.focus();
                return;
            }

            /*
             * Front-end demonstration only.
             * Connect this form to your backend/API to create real accounts.
             */
            showMessage(
                "Your details are valid. Connect your signup API to create your account.",
                "success"
            );
        });
    }

    /* =====================================
       6. CLEAR ERRORS WHILE TYPING
    ===================================== */

    document.querySelectorAll(
        ".cv-signup-input-wrap input, #cv-signup-terms"
    ).forEach(function (element) {
        element.addEventListener("input", clearMessage);
        element.addEventListener("change", clearMessage);
    });

    /* =====================================
       7. GOOGLE / APPLE BUTTONS
    ===================================== */

    const googleButton = document.getElementById("cv-google-login");
    const appleButton = document.getElementById("cv-apple-login");

    if (googleButton) {
        googleButton.addEventListener("click", function () {
            showMessage(
                "Connect Google authentication to enable Google sign-in."
            );
        });
    }

    if (appleButton) {
        appleButton.addEventListener("click", function () {
            showMessage(
                "Connect Apple authentication to enable Apple sign-in."
            );
        });
    }
});
