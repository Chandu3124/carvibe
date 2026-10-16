
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const html = document.documentElement;

    const rtlToggle = document.getElementById("cv-rtl-toggle");
    const themeToggle = document.getElementById("cv-theme-toggle");
    const themeIcon = document.getElementById("cv-theme-icon");

    const passwordInput = document.getElementById("cv-password");
    const passwordToggle = document.getElementById("cv-password-toggle");

    const loginForm = document.getElementById("cv-login-form");
    const formMessage = document.getElementById("cv-form-message");
    const emailInput = document.getElementById("cv-email");

    const emailError = document.getElementById("cv-email-error");
    const passwordError = document.getElementById("cv-password-error");

    const rememberCheckbox = document.getElementById("cv-remember");
    const currentYear = document.getElementById("cv-current-year");

    /* =========================================
       CURRENT YEAR
    ========================================= */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /* =========================================
       DARK MODE
    ========================================= */

    function getPreference(key, fallback) {
        try {
            return localStorage.getItem(key) || fallback;
        } catch (error) {
            return fallback;
        }
    }

    function savePreference(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            // The page still works if storage is unavailable.
        }
    }

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
    }

    applyTheme(getPreference("carvibe-theme", "light"));

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            const nextTheme =
                html.getAttribute("data-theme") === "dark"
                    ? "light"
                    : "dark";

            applyTheme(nextTheme);
            savePreference("carvibe-theme", nextTheme);
        });
    }

    /* =========================================
       RTL / LTR TOGGLE
    ========================================= */

    function applyDirection(direction) {
        const selectedDirection = direction === "rtl" ? "rtl" : "ltr";
        const isRTL = selectedDirection === "rtl";

        html.setAttribute("dir", selectedDirection);

        /*
         * Keep the document language English.
         * RTL changes the layout direction, not the language.
         */
        html.setAttribute("lang", "en");

        if (rtlToggle) {
            rtlToggle.innerHTML = isRTL
                ? '<i class="fa-solid fa-arrow-right"></i><span>LTR</span>'
                : '<i class="fa-solid fa-arrow-left"></i><span>RTL</span>';

            const label = isRTL
                ? "Switch to left-to-right layout"
                : "Switch to right-to-left layout";

            rtlToggle.setAttribute("aria-label", label);
            rtlToggle.setAttribute("title", label);
        }
    }

    applyDirection(getPreference("carvibe-direction", "ltr"));

    if (rtlToggle) {
        rtlToggle.addEventListener("click", function () {
            const nextDirection =
                html.getAttribute("dir") === "rtl" ? "ltr" : "rtl";

            applyDirection(nextDirection);
            savePreference("carvibe-direction", nextDirection);
        });
    }

    /* =========================================
       PASSWORD SHOW / HIDE
       SINGLE ICON - NO DUPLICATES
    ========================================= */

    if (passwordInput && passwordToggle) {
        /*
         * Find the existing icon inside the one button.
         * Do not create another button or icon element.
         */
        const passwordEye = passwordToggle.querySelector("i");

        if (passwordEye) {
            passwordInput.type = "password";
            passwordEye.className = "fa-regular fa-eye";

            passwordToggle.setAttribute("aria-label", "Show password");
            passwordToggle.setAttribute("title", "Show password");
            passwordToggle.setAttribute("aria-pressed", "false");

            passwordToggle.addEventListener("click", function () {
                const isHidden = passwordInput.type === "password";

                // Change the input visibility.
                passwordInput.type = isHidden ? "text" : "password";

                // Update the SAME icon element.
                passwordEye.classList.toggle("fa-eye", !isHidden);
                passwordEye.classList.toggle("fa-eye-slash", isHidden);

                // Update accessibility information.
                const label = isHidden
                    ? "Hide password"
                    : "Show password";

                passwordToggle.setAttribute("aria-label", label);
                passwordToggle.setAttribute("title", label);
                passwordToggle.setAttribute(
                    "aria-pressed",
                    String(isHidden)
                );
            });
        }
    }

    /* =========================================
       FORM MESSAGE HELPERS
    ========================================= */

    function clearFormMessage() {
        if (formMessage) {
            formMessage.textContent = "";
            formMessage.className = "cv-form-message";
        }
    }

    function showFormMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = "cv-form-message " + type;
        }
    }

    function setFieldError(input, errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
        }

        if (input) {
            input.setAttribute(
                "aria-invalid",
                String(Boolean(message))
            );
        }
    }

    function clearFieldError(input, errorElement) {
        setFieldError(input, errorElement, "");
    }

    /* =========================================
       LIVE VALIDATION
    ========================================= */

    if (emailInput) {
        emailInput.addEventListener("input", function () {
            clearFieldError(emailInput, emailError);
            clearFormMessage();
        });

        emailInput.addEventListener("blur", function () {
            const email = emailInput.value.trim();

            if (email && !emailInput.checkValidity()) {
                setFieldError(
                    emailInput,
                    emailError,
                    "Please enter a valid email address."
                );
            }
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener("input", function () {
            clearFieldError(passwordInput, passwordError);
            clearFormMessage();
        });
    }

    /* =========================================
       LOGIN FORM VALIDATION
    ========================================= */

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            clearFormMessage();
            clearFieldError(emailInput, emailError);
            clearFieldError(passwordInput, passwordError);

            const email = emailInput
                ? emailInput.value.trim()
                : "";

            const password = passwordInput
                ? passwordInput.value
                : "";

            let valid = true;

            if (!email) {
                setFieldError(
                    emailInput,
                    emailError,
                    "Please enter your email address."
                );

                valid = false;
            } else if (!emailInput.checkValidity()) {
                setFieldError(
                    emailInput,
                    emailError,
                    "Please enter a valid email address."
                );

                valid = false;
            }

            if (!password.trim()) {
                setFieldError(
                    passwordInput,
                    passwordError,
                    "Please enter your password."
                );

                valid = false;
            }

            if (!valid) {
                showFormMessage(
                    "Please correct the highlighted fields.",
                    "is-error"
                );

                const firstInvalid = loginForm.querySelector(
                    '[aria-invalid="true"]'
                );

                if (firstInvalid) {
                    firstInvalid.focus();
                }

                return;
            }

            /*
             * Front-end demo only.
             * No credentials are authenticated here.
             * Connect a secure backend or authentication provider
             * before using this form for real sign-in.
             */

            showFormMessage(
                "Form validated. Connect your authentication service to sign in.",
                "is-success"
            );

            // The Remember me checkbox is available for your
            // backend integration; this demo does not store passwords.
            if (rememberCheckbox) {
                console.log(
                    "Remember me selected:",
                    rememberCheckbox.checked
                );
            }
        });
    }

    /* =========================================
       GOOGLE SIGN-IN PLACEHOLDER
    ========================================= */

    const googleButton = document.getElementById("cv-google-login");

    if (googleButton) {
        googleButton.addEventListener("click", function () {
            showFormMessage(
                "Google sign-in requires Google OAuth configuration.",
                "is-error"
            );
        });
    }

    /* =========================================
       APPLE SIGN-IN PLACEHOLDER
    ========================================= */

    const appleButton = document.getElementById("cv-apple-login");

    if (appleButton) {
        appleButton.addEventListener("click", function () {
            showFormMessage(
                "Apple sign-in requires Apple authentication configuration.",
                "is-error"
            );
        });
    }
});
