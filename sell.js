
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
    const form = document.getElementById("valuationForm");
    const yearSelect = document.getElementById("year");
    const result = document.getElementById("valuationResult");
    const estimatedValue = document.getElementById("estimatedValue");
    const summary = document.getElementById("estimateSummary");
    const resetButton = document.getElementById("resetValuation");

    if (!form || !yearSelect || !result) return;

    // Populate manufacturing years.
    const currentYear = new Date().getFullYear();

    for (let year = currentYear; year >= 1995; year--) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    // Illustrative starting values, in INR.
    // These are placeholders, not current market prices.
    const demoBasePrices = {
        "Maruti Suzuki": 700000,
        "Hyundai": 850000,
        "Tata": 800000,
        "Mahindra": 1100000,
        "Honda": 800000,
        "Toyota": 1100000,
        "Kia": 1000000,
        "Volkswagen": 900000,
        "Skoda": 950000,
        "BMW": 3500000,
        "Mercedes-Benz": 4000000,
        "Other": 600000
    };

    const money = amount =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(amount);

    form.addEventListener("submit", event => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const data = new FormData(form);

        const brand = data.get("brand");
        const model = String(data.get("model") || "").trim();
        const year = Number(data.get("year"));
        const kilometers = Number(data.get("kilometers"));
        const fuel = data.get("fuel");
        const transmission = data.get("transmission");
        const owners = Number(data.get("owners"));
        const condition = data.get("condition");
        const serviceHistory = data.get("serviceHistory");

        if (
            !model ||
            !Number.isFinite(year) ||
            !Number.isFinite(kilometers) ||
            kilometers < 0 ||
            year < 1995 ||
            year > currentYear
        ) {
            alert("Please enter valid vehicle details.");
            return;
        }

        // DEMO ONLY: simplified depreciation estimate.
        const age = Math.max(0, currentYear - year);
        let value = demoBasePrices[brand] || 600000;

        value *= Math.pow(0.88, age);
        value *= Math.max(0.48, 1 - kilometers / 250000);

        const fuelFactors = {
            petrol: 1,
            diesel: 1.04,
            cng: 0.96,
            electric: 1.02,
            hybrid: 1.06,
            lpg: 0.92
        };

        value *= fuelFactors[fuel] || 1;
        value *= transmission === "automatic" ? 1.04 : 1;

        const ownershipFactors = {
            1: 1,
            2: 0.94,
            3: 0.88,
            4: 0.82
        };

        value *= ownershipFactors[owners] || 1;

        const conditionFactors = {
            excellent: 1.08,
            good: 1,
            fair: 0.85
        };

        value *= conditionFactors[condition] || 1;

        const serviceFactors = {
            full: 1.04,
            partial: 1,
            none: 0.94,
            unknown: 1
        };

        value *= serviceFactors[serviceHistory] || 1;

        // Show a broad indicative range rather than a false-precision quote.
        const lower = Math.max(0, value * 0.85);
        const upper = value * 1.15;

        estimatedValue.textContent =
            `${money(lower)} – ${money(upper)}`;

        summary.textContent =
            `${year} ${brand} ${model}. This is an illustrative estimate ` +
            `based on simplified assumptions. Local demand, variant, ` +
            `accident history, service records and inspection can change ` +
            `the actual selling price substantially.`;

        result.hidden = false;
        result.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    });

    resetButton.addEventListener("click", () => {
        result.hidden = true;
        form.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });
});







document.addEventListener("DOMContentLoaded", function () {
  const faqSections = document.querySelectorAll(".cv-faq-section");

  faqSections.forEach(function (section) {
    const faqItems = section.querySelectorAll(".cv-faq-item");

    faqItems.forEach(function (item) {
      const question = item.querySelector(".cv-faq-question");
      const answer = item.querySelector(".cv-faq-answer");

      if (!question || !answer) return;

      // Set initial state
      const initiallyOpen = item.classList.contains("active");

      question.setAttribute(
        "aria-expanded",
        initiallyOpen ? "true" : "false"
      );

      answer.setAttribute("aria-hidden", initiallyOpen ? "false" : "true");
      answer.inert = !initiallyOpen;

      question.addEventListener("click", function () {
        const shouldOpen = !item.classList.contains("active");

        // Close all other FAQ items
        faqItems.forEach(function (otherItem) {
          const otherQuestion = otherItem.querySelector(".cv-faq-question");
          const otherAnswer = otherItem.querySelector(".cv-faq-answer");

          otherItem.classList.remove("active");

          if (otherQuestion) {
            otherQuestion.setAttribute("aria-expanded", "false");
          }

          if (otherAnswer) {
            otherAnswer.setAttribute("aria-hidden", "true");
            otherAnswer.inert = true;
          }
        });

        // Open the selected item if it was closed
        if (shouldOpen) {
          item.classList.add("active");
          question.setAttribute("aria-expanded", "true");
          answer.setAttribute("aria-hidden", "false");
          answer.inert = false;
        }
      });
    });
  });
});
