document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;
    const body = document.body;

    const rtlToggle = document.getElementById("rtlToggle");
    const darkToggle = document.getElementById("darkToggle");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mainNav = document.getElementById("mainNav");
    const darkIcon = darkToggle?.querySelector("i");
    const menuIcon = mobileMenuBtn?.querySelector("i");

    // Read saved preferences safely.
    const getSavedPreference = (key, fallback) => {
        try {
            const saved = localStorage.getItem(key);
            return saved === null ? fallback : saved;
        } catch {
            return fallback;
        }
    };

    // ---------- RTL / LTR ----------
    function applyDirection(direction) {
        const isRTL = direction === "rtl";

        html.setAttribute("dir", isRTL ? "rtl" : "ltr");
        html.setAttribute("lang", isRTL ? "ar" : "en");

        if (rtlToggle) {
            rtlToggle.textContent = isRTL ? "LTR" : "RTL";
            rtlToggle.setAttribute(
                "aria-label",
                isRTL ? "Switch to left-to-right layout" : "Switch to right-to-left layout"
            );
            rtlToggle.setAttribute("aria-pressed", String(isRTL));
        }

        try {
            localStorage.setItem("carvibe-direction", isRTL ? "rtl" : "ltr");
        } catch {
            // The toggle still works if storage is unavailable.
        }
    }

    // ---------- DARK / LIGHT MODE ----------
    function applyTheme(theme) {
        const isDark = theme === "dark";

        body.classList.toggle("dark-mode", isDark);
        html.setAttribute("data-theme", isDark ? "dark" : "light");
        html.style.colorScheme = isDark ? "dark" : "light";

        if (darkIcon) {
            darkIcon.classList.toggle("fa-moon", !isDark);
            darkIcon.classList.toggle("fa-sun", isDark);
        }

        if (darkToggle) {
            darkToggle.setAttribute(
                "aria-label",
                isDark ? "Switch to light mode" : "Switch to dark mode"
            );
            darkToggle.setAttribute("aria-pressed", String(isDark));
            darkToggle.title = isDark ? "Light Mode" : "Dark Mode";
        }

        try {
            localStorage.setItem("carvibe-theme", isDark ? "dark" : "light");
        } catch {
            // The toggle still works if storage is unavailable.
        }
    }

    // Restore saved settings when the page loads.
    applyDirection(getSavedPreference("carvibe-direction", "ltr"));
    applyTheme(getSavedPreference("carvibe-theme", "light"));

    // RTL button.
    rtlToggle?.addEventListener("click", () => {
        applyDirection(html.dir === "rtl" ? "ltr" : "rtl");
    });

    // Dark mode button.
    darkToggle?.addEventListener("click", () => {
        applyTheme(body.classList.contains("dark-mode") ? "light" : "dark");
    });

    // Mobile navigation.
    mobileMenuBtn?.addEventListener("click", () => {
        const isOpen = mainNav?.classList.toggle("active") ?? false;

        mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));

        if (menuIcon) {
            menuIcon.classList.toggle("fa-bars", !isOpen);
            menuIcon.classList.toggle("fa-xmark", isOpen);
        }
    });

    // Close the mobile menu after selecting a navigation link.
    mainNav?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("active");
            mobileMenuBtn?.setAttribute("aria-expanded", "false");

            menuIcon?.classList.add("fa-bars");
            menuIcon?.classList.remove("fa-xmark");
        });
    });

    // Header scroll effect.
    const header = document.getElementById("carvibeHeader");

    function updateHeader() {
        header?.classList.toggle("scrolled", window.scrollY > 20);
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
});





const cvContactForm = document.getElementById("cvContactForm");
const cvMessage = document.getElementById("cvMessage");
const cvCharCount = document.getElementById("cvCharCount");
const cvFormStatus = document.getElementById("cvFormStatus");

if (cvMessage && cvCharCount) {
    const updateCount = () => {
        cvCharCount.textContent = `${cvMessage.value.length} / 2000`;
    };

    cvMessage.addEventListener("input", updateCount);
    updateCount();
}

if (cvContactForm && cvFormStatus) {
    cvContactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!cvContactForm.checkValidity()) {
            cvContactForm.reportValidity();
            return;
        }

        cvFormStatus.className = "cv-form-status is-success";
        cvFormStatus.textContent =
            "Your form is valid. Connect a backend to send your enquiry to the CarVibe team.";
    });
}



document.querySelectorAll(".cv-faq-item").forEach((item) => {
    item.addEventListener("toggle", () => {
        if (!item.open) return;

        document.querySelectorAll(".cv-faq-item").forEach((otherItem) => {
            if (otherItem !== item) {
                otherItem.open = false;
            }
        });
    });
});
