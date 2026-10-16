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



document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("cvFindCarForm");

    if (!form) return;

    const budgetSelect = document.getElementById("cv-car-budget");
    const budgetChips = form.querySelectorAll(".cv-budget-chip");
    const message = document.getElementById("cvFindMessage");

    function updateBudgetChips() {
        const selectedBudget = budgetSelect.value;

        budgetChips.forEach(function (chip) {
            const isActive = chip.dataset.budget === selectedBudget;

            chip.classList.toggle("active", isActive);
            chip.setAttribute("aria-pressed", String(isActive));
        });
    }

    budgetChips.forEach(function (chip) {
        chip.setAttribute("aria-pressed", "false");

        chip.addEventListener("click", function () {
            budgetSelect.value = chip.dataset.budget;
            updateBudgetChips();
        });
    });

    budgetSelect.addEventListener("change", updateBudgetChips);

    form.addEventListener("reset", function () {
        window.setTimeout(function () {
            updateBudgetChips();
            message.textContent = "";
            message.classList.remove("visible");
        }, 0);
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const params = new URLSearchParams();
        const formData = new FormData(form);

        formData.forEach(function (value, key) {
            if (String(value).trim() !== "") {
                params.set(key, String(value).trim());
            }
        });

        message.classList.add("visible");

        if (params.size === 0) {
            message.textContent =
                "Choose at least one filter to narrow down your search.";
            return;
        }

        /*
          Example destination:
          #all-cars?brand=Hyundai&budget=500000

          Replace this with your inventory page URL or connect
          the selected filters to your existing car listing logic.
        */
        window.location.hash = "all-cars?" + params.toString();

        message.textContent =
            "Your search criteria are ready. Connect these filters to your car inventory to show matching vehicles.";
    });

    updateBudgetChips();
});




    

document.querySelectorAll(".cv-faq").forEach(function (faqSection) {
    const items = faqSection.querySelectorAll(".cv-faq-item");

    items.forEach(function (item) {
        const button = item.querySelector(".cv-faq-question");

        button.addEventListener("click", function () {
            const wasOpen = item.classList.contains("active");

            items.forEach(function (otherItem) {
                otherItem.classList.remove("active");

                const otherButton =
                    otherItem.querySelector(".cv-faq-question");

                otherButton.setAttribute("aria-expanded", "false");
            });

            if (!wasOpen) {
                item.classList.add("active");
                button.setAttribute("aria-expanded", "true");
            }
        });
    });
});






