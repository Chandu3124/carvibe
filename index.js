
/* ==========================================
   CARVIBE — HEADER, ACTIVE LINK, RTL & THEME
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;
    const body = document.body;

    const rtlToggle = document.getElementById("rtlToggle");
    const darkToggle = document.getElementById("darkToggle");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mainNav = document.getElementById("mainNav");
    const header = document.getElementById("carvibeHeader");

    const darkIcon = darkToggle?.querySelector("i");
    const menuIcon = mobileMenuBtn?.querySelector("i");

    /* ==========================================
       SAVE & RESTORE PREFERENCES
    ========================================== */

    function getSavedPreference(key, fallback) {
        try {
            return localStorage.getItem(key) ?? fallback;
        } catch {
            return fallback;
        }
    }

    /* ==========================================
       ACTIVE HEADER NAVIGATION LINK
    ========================================== */

    function normalizePath(path) {
        try {
            path = decodeURIComponent(path);
        } catch {
            // Keep the original path if decoding fails.
        }

        // Treat /index.html and / as the same homepage.
        path = path.replace(/\/index\.html$/i, "/");

        // Remove trailing slashes except for the root path.
        if (path.length > 1) {
            path = path.replace(/\/+$/, "");
        }

        return path.toLowerCase();
    }

    function setActiveNavigationLink() {
        if (!mainNav) return;

        const currentUrl = new URL(window.location.href);
        const currentPath = normalizePath(currentUrl.pathname);
        const currentHash = currentUrl.hash;

        const navLinks = mainNav.querySelectorAll("a[href]");

        navLinks.forEach((link) => {
            const href = link.getAttribute("href");

            // Ignore empty links and JavaScript links.
            if (!href || href.trim() === "#" ||
                href.trim().toLowerCase().startsWith("javascript:")) {
                link.classList.remove("active");
                link.removeAttribute("aria-current");
                return;
            }

            let linkUrl;

            try {
                linkUrl = new URL(href, window.location.href);
            } catch {
                link.classList.remove("active");
                link.removeAttribute("aria-current");
                return;
            }

            // Do not mark external website links as active.
            if (linkUrl.origin !== currentUrl.origin) {
                link.classList.remove("active");
                link.removeAttribute("aria-current");
                return;
            }

            const linkPath = normalizePath(linkUrl.pathname);

            let isActive = linkPath === currentPath;

            // For same-page section links, match the URL hash.
            if (
                href.startsWith("#") &&
                currentHash &&
                linkUrl.hash === currentHash
            ) {
                isActive = true;
            }

            // Clear previous state and apply the current state.
            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    setActiveNavigationLink();

    /* ==========================================
       RTL / LTR TOGGLE
    ========================================== */

    function applyDirection(direction) {
        const isRTL = direction === "rtl";

        html.setAttribute("dir", isRTL ? "rtl" : "ltr");
        html.setAttribute("lang", isRTL ? "ar" : "en");

        if (rtlToggle) {
            rtlToggle.textContent = isRTL ? "LTR" : "RTL";

            rtlToggle.setAttribute(
                "aria-label",
                isRTL
                    ? "Switch to left-to-right layout"
                    : "Switch to right-to-left layout"
            );

            rtlToggle.setAttribute("aria-pressed", String(isRTL));
        }

        try {
            localStorage.setItem(
                "carvibe-direction",
                isRTL ? "rtl" : "ltr"
            );
        } catch {
            // Continue if browser storage is unavailable.
        }
    }

    /* ==========================================
       DARK / LIGHT MODE
    ========================================== */

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
            // Continue if browser storage is unavailable.
        }
    }

    applyDirection(getSavedPreference("carvibe-direction", "ltr"));
    applyTheme(getSavedPreference("carvibe-theme", "light"));

    rtlToggle?.addEventListener("click", () => {
        applyDirection(html.dir === "rtl" ? "ltr" : "rtl");
    });

    darkToggle?.addEventListener("click", () => {
        applyTheme(body.classList.contains("dark-mode") ? "light" : "dark");
    });

    /* ==========================================
       MOBILE NAVIGATION
    ========================================== */

    function closeMobileMenu() {
        mainNav?.classList.remove("active");
        mobileMenuBtn?.setAttribute("aria-expanded", "false");

        menuIcon?.classList.add("fa-bars");
        menuIcon?.classList.remove("fa-xmark");
    }

    mobileMenuBtn?.addEventListener("click", () => {
        const isOpen = mainNav?.classList.toggle("active") ?? false;

        mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));

        menuIcon?.classList.toggle("fa-bars", !isOpen);
        menuIcon?.classList.toggle("fa-xmark", isOpen);
    });

    mainNav?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });

    /* ==========================================
       HEADER SCROLL EFFECT
    ========================================== */

    function updateHeader() {
        header?.classList.toggle("scrolled", window.scrollY > 20);
    }

    updateHeader();

    window.addEventListener("scroll", updateHeader, { passive: true });
});


/* ==========================================
   CARVIBE — BRAND EXPLORER
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const cvBrandOptions = document.querySelectorAll(".cv-brand-option");
    const cvBrandNumber = document.getElementById("cvBrandNumber");
    const cvBrandSelected = document.getElementById("cvBrandSelected");
    const cvBrandDescription = document.getElementById("cvBrandDescription");
    const cvBrandReset = document.getElementById("cvBrandReset");

    const cvBrandDescriptions = {
        "Maruti Suzuki": "Explore practical, efficient cars for everyday journeys.",
        "Hyundai": "Discover modern styling, comfort, and everyday versatility.",
        "Tata Motors": "Explore distinctive designs and a wide range of vehicle options.",
        "Mahindra": "Discover rugged SUVs and vehicles built for adventurous journeys.",
        "Toyota": "Explore versatile vehicles for daily driving and longer trips.",
        "Honda": "Discover refined styling and practical everyday performance.",
        "Kia": "Explore contemporary designs with comfort-focused features.",
        "Volkswagen": "Discover European-inspired styling and driving experiences."
    };

    function selectCvBrand(option) {
        if (!option) return;

        cvBrandOptions.forEach((item) => {
            const selected = item === option;

            item.classList.toggle("active", selected);
            item.setAttribute("aria-pressed", String(selected));
        });

        if (cvBrandNumber) {
            cvBrandNumber.textContent = option.dataset.index || "--";
        }

        if (cvBrandSelected) {
            cvBrandSelected.textContent =
                option.dataset.brand || "Explore All Brands";
        }

        if (cvBrandDescription) {
            cvBrandDescription.textContent =
                cvBrandDescriptions[option.dataset.brand] ||
                "Explore available vehicles from this brand.";
        }

        document.dispatchEvent(new CustomEvent("brandSelected", {
            detail: {
                brand: option.dataset.brand,
                index: option.dataset.index
            }
        }));
    }

    cvBrandOptions.forEach((option) => {
        option.addEventListener("click", () => selectCvBrand(option));
    });

    cvBrandReset?.addEventListener("click", () => {
        cvBrandOptions.forEach((option) => {
            option.classList.remove("active");
            option.setAttribute("aria-pressed", "false");
        });

        if (cvBrandNumber) cvBrandNumber.textContent = "--";

        if (cvBrandSelected) {
            cvBrandSelected.textContent = "Explore All Brands";
        }

        if (cvBrandDescription) {
            cvBrandDescription.textContent =
                "Choose a brand above to discover vehicles that match your needs.";
        }

        document.dispatchEvent(new CustomEvent("brandSelectionCleared"));
    });
});


/* ==========================================
   CARVIBE — DARK MODE SECTION SYNCHRONIZATION
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;
    const body = document.body;

    const sections = [
        document.querySelector(".certified-cars-section"),
        document.querySelector(".cars-budget-section")
    ].filter(Boolean);

    function syncSectionThemes() {
        const isDark =
            body.classList.contains("dark-mode") ||
            html.getAttribute("data-theme") === "dark";

        sections.forEach((section) => {
            section.classList.toggle("dark-mode", isDark);
        });
    }

    syncSectionThemes();

    const observer = new MutationObserver(syncSectionThemes);

    observer.observe(body, {
        attributes: true,
        attributeFilter: ["class"]
    });

    observer.observe(html, {
        attributes: true,
        attributeFilter: ["data-theme"]
    });
});


/* ==========================================
   GOOGLE & APPLE AUTHENTICATION HOOKS
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const googleLoginBtn = document.getElementById("cv-google-login");
    const appleLoginBtn = document.getElementById("cv-apple-login");

    googleLoginBtn?.addEventListener("click", () => {
        // Connect your Google OAuth sign-in flow here.
        console.info("Google sign-in clicked.");
    });

    appleLoginBtn?.addEventListener("click", () => {
        // Connect your Apple Sign In authentication flow here.
        console.info("Apple sign-in clicked.");
    });
});
