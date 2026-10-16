
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







document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;

    // =====================================
    // DARK MODE
    // =====================================

    const themeToggle = document.getElementById("heroThemeToggle");
    const themeIcon = themeToggle?.querySelector(".auto-hero__theme-icon");
    const themeLabel = themeToggle?.querySelector(".auto-hero__theme-label");

    function applyTheme(theme) {
        const isDark = theme === "dark";

        root.setAttribute("data-theme", isDark ? "dark" : "light");
        root.style.colorScheme = isDark ? "dark" : "light";

        if (themeIcon) {
            themeIcon.textContent = isDark ? "☀" : "☾";
        }

        if (themeLabel) {
            themeLabel.textContent = isDark ? "Light Mode" : "Dark Mode";
        }

        if (themeToggle) {
            themeToggle.setAttribute(
                "aria-label",
                isDark ? "Switch to light mode" : "Switch to dark mode"
            );

            themeToggle.setAttribute("aria-pressed", String(isDark));
        }

        try {
            localStorage.setItem("autovelle-theme", theme);
        } catch (error) {
            // Theme switching still works without localStorage.
        }
    }

    let initialTheme = root.getAttribute("data-theme") || "light";

    try {
        initialTheme = localStorage.getItem("autovelle-theme") || initialTheme;
    } catch (error) {
        // Keep the current HTML theme.
    }

    applyTheme(initialTheme);

    themeToggle?.addEventListener("click", () => {
        const currentTheme = root.getAttribute("data-theme") || "light";

        applyTheme(currentTheme === "dark" ? "light" : "dark");
    });

    // =====================================
    // QUICK SEARCH SUGGESTIONS
    // =====================================

    const searchInput = document.getElementById("heroSearchInput");
    const quickLinks = document.querySelectorAll(".auto-hero__quick-link");

    quickLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (!searchInput) return;

            searchInput.value = link.dataset.search || "";
            searchInput.focus();
        });
    });

    // =====================================
    // SEARCH VALIDATION
    // The form submits to buy-cars.html?q=...
    // =====================================

    const searchForm = document.getElementById("heroCarSearch");

    searchForm?.addEventListener("submit", event => {
        const query = searchInput?.value.trim() || "";

        if (!query) {
            event.preventDefault();
            searchInput?.focus();

            if (searchInput) {
                searchInput.setCustomValidity(
                    "Please enter a make, model, or keyword."
                );
                searchInput.reportValidity();
            }

            return;
        }

        searchInput?.setCustomValidity("");
        // Allow normal form submission to buy-cars.html.
    });

    searchInput?.addEventListener("input", () => {
        searchInput.setCustomValidity("");
    });
});



/* ==========================================
   DARK MODE TOGGLE
========================================== */

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
    const themeIcon = themeToggle.querySelector(".theme-icon");
    const themeLabel = themeToggle.querySelector(".theme-label");

    // Restore saved theme or use dark mode by default
    let savedTheme = "dark";

    try {
        savedTheme = localStorage.getItem("autovelle-theme") || "dark";
    } catch (error) {
        // Continue without saved preferences if storage is unavailable.
    }

    function applyTheme(theme) {
        const isDark = theme === "dark";

        document.documentElement.setAttribute(
            "data-theme",
            theme
        );

        themeIcon.textContent = isDark ? "☀" : "☾";
        themeLabel.textContent = isDark ? "Light Mode" : "Dark Mode";

        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );

        themeToggle.setAttribute(
            "aria-pressed",
            String(isDark)
        );
    }

    applyTheme(savedTheme);

    themeToggle.addEventListener("click", function () {
        const currentTheme =
            document.documentElement.getAttribute("data-theme");

        const nextTheme =
            currentTheme === "dark" ? "light" : "dark";

        applyTheme(nextTheme);

        try {
            localStorage.setItem("autovelle-theme", nextTheme);
        } catch (error) {
            // Theme still works for the current page session.
        }
    });
}




/* =========================================
   AUTOVELLE — RELIABLE DARK MODE
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");

    if (!themeToggle) return;

    const themeIcon = themeToggle.querySelector(".theme-icon");
    const themeLabel = themeToggle.querySelector(".theme-label");

    function getSavedTheme() {
        try {
            const savedTheme = localStorage.getItem("autovelle-theme");

            if (savedTheme === "light" || savedTheme === "dark") {
                return savedTheme;
            }
        } catch (error) {
            // Continue without saved preferences.
        }

        return document.documentElement.getAttribute("data-theme") || "dark";
    }

    function applyTheme(theme) {
        const isDark = theme === "dark";

        document.documentElement.setAttribute(
            "data-theme",
            isDark ? "dark" : "light"
        );

        document.documentElement.style.colorScheme =
            isDark ? "dark" : "light";

        if (themeIcon) {
            themeIcon.textContent = isDark ? "☀" : "☾";
        }

        if (themeLabel) {
            themeLabel.textContent = isDark ? "Light Mode" : "Dark Mode";
        }

        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );

        themeToggle.setAttribute("aria-pressed", String(isDark));

        try {
            localStorage.setItem("autovelle-theme", theme);
        } catch (error) {
            // Theme still works when localStorage is unavailable.
        }
    }

    // Restore the user's saved theme.
    applyTheme(getSavedTheme());

    themeToggle.addEventListener("click", function () {
        const currentTheme =
            document.documentElement.getAttribute("data-theme") || "dark";

        applyTheme(currentTheme === "dark" ? "light" : "dark");
    });
});





document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;

    // DARK MODE
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = themeToggle?.querySelector(".theme-icon");
    const themeLabel = themeToggle?.querySelector(".theme-label");

    function applyTheme(theme) {
        const dark = theme === "dark";

        root.setAttribute("data-theme", dark ? "dark" : "light");
        root.style.colorScheme = dark ? "dark" : "light";

        if (themeIcon) themeIcon.textContent = dark ? "☀" : "☾";
        if (themeLabel) themeLabel.textContent = dark ? "Light Mode" : "Dark Mode";

        if (themeToggle) {
            themeToggle.setAttribute(
                "aria-label",
                dark ? "Switch to light mode" : "Switch to dark mode"
            );
            themeToggle.setAttribute("aria-pressed", String(dark));
        }

        try {
            localStorage.setItem("autovelle-theme", theme);
        } catch (error) {
            // Theme still works if browser storage is unavailable.
        }
    }

    let savedTheme = "light";

    try {
        savedTheme = localStorage.getItem("autovelle-theme") || "light";
    } catch (error) {
        // Use the default theme.
    }

    applyTheme(savedTheme);

    themeToggle?.addEventListener("click", () => {
        const current = root.getAttribute("data-theme") || "light";
        applyTheme(current === "dark" ? "light" : "dark");
    });

    // CAR LISTINGS
    const grid = document.getElementById("carsGrid");
    const sortSelect = document.getElementById("sortCars");
    const visibleCount = document.getElementById("visibleCount");
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const loadMoreInfo = document.getElementById("loadMoreInfo");
    const emptyState = document.getElementById("emptyState");

    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll(".car-card"));
    const pageSize = 3;
    let visibleLimit = pageSize;

    function sortCards() {
        const sortBy = sortSelect?.value || "relevance";

        const sorted = [...cards].sort((a, b) => {
            const priceA = Number(a.dataset.price) || 0;
            const priceB = Number(b.dataset.price) || 0;
            const yearA = Number(a.dataset.year) || 0;
            const yearB = Number(b.dataset.year) || 0;
            const kmA = Number(a.dataset.km) || 0;
            const kmB = Number(b.dataset.km) || 0;
            const relevanceA = Number(a.dataset.relevance) || 0;
            const relevanceB = Number(b.dataset.relevance) || 0;
            const listedA = Number(a.dataset.listed) || 0;
            const listedB = Number(b.dataset.listed) || 0;

            switch (sortBy) {
                case "price-low":
                    return priceA - priceB;
                case "price-high":
                    return priceB - priceA;
                case "newest":
                    return yearB - yearA || listedB - listedA;
                case "mileage":
                    return kmA - kmB;
                default:
                    return relevanceB - relevanceA;
            }
        });

        sorted.forEach(card => grid.appendChild(card));
    }

    function renderCards() {
        const currentCards = Array.from(grid.querySelectorAll(".car-card"));
        const total = currentCards.length;
        const shown = Math.min(visibleLimit, total);

        currentCards.forEach((card, index) => {
            card.hidden = index >= shown;
        });

        if (visibleCount) {
            visibleCount.textContent = total;
        }

        if (loadMoreInfo) {
            loadMoreInfo.textContent = `Showing ${shown} of ${total} cars`;
        }

        if (loadMoreBtn) {
            loadMoreBtn.hidden = shown >= total;
            loadMoreBtn.disabled = shown >= total;
        }

        if (emptyState) {
            emptyState.hidden = total !== 0;
        }
    }

    sortSelect?.addEventListener("change", () => {
        visibleLimit = pageSize;
        sortCards();
        renderCards();
    });

    loadMoreBtn?.addEventListener("click", () => {
        visibleLimit += pageSize;
        renderCards();
    });

    // WISHLIST
    grid.addEventListener("click", event => {
        const button = event.target.closest(".wishlist-btn");
        if (!button) return;

        const active = button.classList.toggle("is-active");

        button.textContent = active ? "♥" : "♡";
        button.setAttribute("aria-pressed", String(active));

        const card = button.closest(".car-card");
        const title = card?.querySelector("h2")?.textContent || "car";

        button.setAttribute(
            "aria-label",
            `${active ? "Remove" : "Add"} ${title} ${active ? "from" : "to"} wishlist`
        );
    });

    sortCards();
    renderCards();
});





document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;

    // =====================================
    // DARK MODE
    // Shares the "autovelle-theme" setting
    // with your other AutoVelle pages.
    // =====================================

    const themeToggle = document.getElementById("featuredThemeToggle");
    const themeIcon = themeToggle?.querySelector(".featured-theme-icon");
    const themeLabel = themeToggle?.querySelector(".featured-theme-label");

    function applyTheme(theme) {
        const isDark = theme === "dark";

        root.setAttribute("data-theme", isDark ? "dark" : "light");
        root.style.colorScheme = isDark ? "dark" : "light";

        if (themeIcon) themeIcon.textContent = isDark ? "☀" : "☾";
        if (themeLabel) {
            themeLabel.textContent = isDark ? "Light Mode" : "Dark Mode";
        }

        if (themeToggle) {
            themeToggle.setAttribute(
                "aria-label",
                isDark ? "Switch to light mode" : "Switch to dark mode"
            );
            themeToggle.setAttribute("aria-pressed", String(isDark));
        }

        try {
            localStorage.setItem("autovelle-theme", theme);
        } catch (error) {
            // Theme works even if browser storage is unavailable.
        }
    }

    let savedTheme = root.getAttribute("data-theme") || "light";

    try {
        savedTheme = localStorage.getItem("autovelle-theme") || savedTheme;
    } catch (error) {
        // Use the current HTML theme.
    }

    applyTheme(savedTheme);

    themeToggle?.addEventListener("click", () => {
        const current = root.getAttribute("data-theme") || "light";
        applyTheme(current === "dark" ? "light" : "dark");
    });

    // =====================================
    // HORIZONTAL SLIDER
    // =====================================

    const slider = document.getElementById("featuredSlider");
    const prevButton = document.getElementById("featuredPrev");
    const nextButton = document.getElementById("featuredNext");
    const progress = document.getElementById("featuredProgress");

    if (!slider) return;

    const getVisibleCards = () =>
        Array.from(slider.querySelectorAll(".featured-car-card"))
            .filter(card => !card.hidden);

    function updateSliderControls() {
        const maxScroll = slider.scrollWidth - slider.clientWidth;
        const currentScroll = slider.scrollLeft;

        if (prevButton) {
            prevButton.disabled = currentScroll <= 2;
        }

        if (nextButton) {
            nextButton.disabled = currentScroll >= maxScroll - 2;
        }

        if (progress) {
            const percent = maxScroll > 0
                ? (currentScroll / maxScroll) * 100
                : 100;

            progress.style.width = `${Math.min(100, Math.max(0, percent))}%`;
        }
    }

    function scrollSlider(direction) {
        const card = getVisibleCards()[0];
        if (!card) return;

        const cardStyle = getComputedStyle(slider);
        const gap = parseFloat(cardStyle.columnGap) || 0;
        const distance = card.getBoundingClientRect().width + gap;

        slider.scrollBy({
            left: direction * distance,
            behavior: "smooth"
        });
    }

    prevButton?.addEventListener("click", () => scrollSlider(-1));
    nextButton?.addEventListener("click", () => scrollSlider(1));

    slider.addEventListener("scroll", updateSliderControls, {
        passive: true
    });

    window.addEventListener("resize", updateSliderControls);

    // =====================================
    // CATEGORY FILTERS
    // =====================================

    const tabs = document.querySelectorAll(".featured-tab");
    const cards = slider.querySelectorAll(".featured-car-card");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const category = tab.dataset.category;

            tabs.forEach(item => {
                const active = item === tab;
                item.classList.toggle("is-active", active);
                item.setAttribute("aria-pressed", String(active));
            });

            cards.forEach(card => {
                const categories = (card.dataset.category || "").split(/\s+/);

                card.hidden = category !== "all" &&
                    !categories.includes(category);
            });

            slider.scrollTo({ left: 0, behavior: "smooth" });

            requestAnimationFrame(updateSliderControls);
        });
    });

    // =====================================
    // WISHLIST HEARTS
    // =====================================

    slider.addEventListener("click", event => {
        const button = event.target.closest(".featured-wishlist");
        if (!button) return;

        const active = button.classList.toggle("is-active");
        button.textContent = active ? "♥" : "♡";
        button.setAttribute("aria-pressed", String(active));

        const carName = button.closest(".featured-car-card")
            ?.querySelector("h3")?.textContent || "car";

        button.setAttribute(
            "aria-label",
            `${active ? "Remove" : "Add"} ${carName} ${
                active ? "from" : "to"
            } wishlist`
        );
    });

    updateSliderControls();
});




/* =========================================
   AUTOVELLE - EMI CALCULATOR
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const carPrice = document.getElementById("carPrice");
    const carPriceNumber = document.getElementById("carPriceNumber");
    const downPayment = document.getElementById("downPayment");
    const interestRate = document.getElementById("interestRate");
    const loanTenure = document.getElementById("loanTenure");

    const carPriceValue = document.getElementById("carPriceValue");
    const downPaymentValue = document.getElementById("downPaymentValue");
    const interestRateValue = document.getElementById("interestRateValue");
    const loanTenureValue = document.getElementById("loanTenureValue");

    const downPaymentMaxLabel = document.getElementById("downPaymentMaxLabel");
    const downPaymentPercent = document.getElementById("downPaymentPercent");

    const loanAmountElement = document.getElementById("loanAmount");
    const loanToValue = document.getElementById("loanToValue");

    const monthlyEMI = document.getElementById("monthlyEMI");
    const resultLoanAmount = document.getElementById("resultLoanAmount");
    const totalInterest = document.getElementById("totalInterest");
    const totalRepayment = document.getElementById("totalRepayment");
    const resultDownPayment = document.getElementById("resultDownPayment");

    const principalBar = document.getElementById("principalBar");
    const interestBar = document.getElementById("interestBar");

    const themeToggle = document.getElementById("emiThemeToggle");

    const money = value =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(Math.round(value));

    const formatPercent = value => `${value.toFixed(1)}%`;

    /* =========================================
       SLIDER BACKGROUND
    ========================================= */

    function updateSlider(slider) {
        const min = Number(slider.min);
        const max = Number(slider.max);
        const value = Number(slider.value);

        const percentage = max === min
            ? 0
            : ((value - min) / (max - min)) * 100;

        slider.style.background = `
            linear-gradient(
                to right,
                #E31E24 0%,
                #E31E24 ${percentage}%,
                var(--emi-line) ${percentage}%,
                var(--emi-line) 100%
            )
        `;
    }

    /* =========================================
       CALCULATE EMI
    ========================================= */

    function calculateEMI() {
        const price = Number(carPrice.value);
        const down = Number(downPayment.value);
        const annualRate = Number(interestRate.value);
        const years = Number(loanTenure.value);

        const principal = Math.max(0, price - down);
        const months = years * 12;
        const monthlyRate = annualRate / 1200;

        let emi = 0;

        if (principal > 0) {
            if (monthlyRate === 0) {
                emi = principal / months;
            } else {
                const factor = Math.pow(1 + monthlyRate, months);

                emi = principal *
                    monthlyRate *
                    factor /
                    (factor - 1);
            }
        }

        const repayment = emi * months;
        const interest = repayment - principal;

        carPriceValue.textContent = money(price);
        downPaymentValue.textContent = money(down);
        interestRateValue.textContent = formatPercent(annualRate);
        loanTenureValue.textContent =
            `${years} ${years === 1 ? "Year" : "Years"}`;

        downPaymentMaxLabel.textContent = `Up to ${money(price)}`;

        const downPercent = price > 0 ? (down / price) * 100 : 0;
        const loanPercent = price > 0 ? (principal / price) * 100 : 0;

        downPaymentPercent.textContent = formatPercent(downPercent);

        loanAmountElement.textContent = money(principal);
        loanToValue.textContent = formatPercent(loanPercent);

        monthlyEMI.textContent = money(emi);
        resultLoanAmount.textContent = money(principal);
        totalInterest.textContent = money(interest);
        totalRepayment.textContent = money(repayment);
        resultDownPayment.textContent = money(down);

        // Display principal versus interest proportions.
        const totalComponents = principal + interest;

        const principalPercentage = totalComponents > 0
            ? (principal / totalComponents) * 100
            : 100;

        principalBar.style.width = `${principalPercentage}%`;
        interestBar.style.width = `${100 - principalPercentage}%`;

        [
            carPrice,
            downPayment,
            interestRate,
            loanTenure
        ].forEach(updateSlider);

        // Animate the EMI amount when inputs change.
        monthlyEMI.classList.remove("emi-updated");

        // Restart the CSS animation without a timer.
        void monthlyEMI.offsetWidth;
        monthlyEMI.classList.add("emi-updated");
    }

    /* =========================================
       KEEP PRICE AND DOWN PAYMENT IN SYNC
    ========================================= */

    function syncCarPrice(value) {
        const price = Math.min(
            Number(carPrice.max),
            Math.max(Number(carPrice.min), Number(value) || Number(carPrice.min))
        );

        carPrice.value = price;
        carPriceNumber.value = price;

        // Down payment cannot exceed the car price.
        downPayment.max = price;

        if (Number(downPayment.value) > price) {
            downPayment.value = price;
        }

        calculateEMI();
    }

    carPrice.addEventListener("input", () => {
        syncCarPrice(carPrice.value);
    });

    carPriceNumber.addEventListener("input", () => {
        const typedValue = Number(carPriceNumber.value);

        if (
            carPriceNumber.value !== "" &&
            Number.isFinite(typedValue) &&
            typedValue >= Number(carPrice.min) &&
            typedValue <= Number(carPrice.max)
        ) {
            syncCarPrice(typedValue);
        }
    });

    carPriceNumber.addEventListener("change", () => {
        syncCarPrice(carPriceNumber.value);
    });

    /* =========================================
       DOWN PAYMENT
    ========================================= */

    downPayment.addEventListener("input", calculateEMI);

    /* =========================================
       INTEREST RATE AND TENURE
    ========================================= */

    interestRate.addEventListener("input", calculateEMI);
    loanTenure.addEventListener("input", calculateEMI);

    /* =========================================
       LIGHT / DARK MODE
    ========================================= */

    function applyTheme(isDark) {
        document.documentElement.dataset.theme =
            isDark ? "dark" : "light";

        const icon = themeToggle.querySelector(".emi-theme-icon");
        const label = themeToggle.querySelector(".emi-theme-label");

        icon.textContent = isDark ? "☀" : "☾";
        label.textContent = isDark ? "Light Mode" : "Dark Mode";

        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );

        // Refresh slider tracks for the active theme.
        [
            carPrice,
            downPayment,
            interestRate,
            loanTenure
        ].forEach(updateSlider);
    }

    let savedTheme = "light";

    try {
        savedTheme = localStorage.getItem("autovelle-theme") || "light";
    } catch (error) {
        // Continue without persistent storage if unavailable.
    }

    applyTheme(savedTheme === "dark");

    themeToggle.addEventListener("click", () => {
        const isDark =
            document.documentElement.dataset.theme !== "dark";

        applyTheme(isDark);

        try {
            localStorage.setItem(
                "autovelle-theme",
                isDark ? "dark" : "light"
            );
        } catch (error) {
            // The theme still changes for the current session.
        }
    });

    /* =========================================
       FINANCING CTA
    ========================================= */

    const financingCTA = document.querySelector(".emi-cta");

    financingCTA.addEventListener("click", event => {
        // Preserve normal navigation if the destination exists.
        // Carry the current estimate as URL parameters.
        const principal = Math.max(
            0,
            Number(carPrice.value) - Number(downPayment.value)
        );

        const params = new URLSearchParams({
            carPrice: carPrice.value,
            downPayment: downPayment.value,
            interestRate: interestRate.value,
            tenureYears: loanTenure.value,
            loanAmount: principal
        });

        const destination = financingCTA.getAttribute("href");

        if (destination && destination !== "#") {
            event.preventDefault();

            const separator = destination.includes("?") ? "&" : "?";
            window.location.href =
                destination + separator + params.toString();
        }
    });

    /* Initial calculation */
    calculateEMI();
});



























