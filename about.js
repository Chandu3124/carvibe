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

    const slider = document.getElementById("cvTestimonialSlider");

    if (!slider) return;

    const slides = Array.from(
        slider.querySelectorAll(".cv-testimonial-slide")
    );

    const prevButton = document.getElementById("cvTestimonialPrev");
    const nextButton = document.getElementById("cvTestimonialNext");
    const currentCounter = document.getElementById("cvTestimonialCurrent");
    const totalCounter = document.getElementById("cvTestimonialTotal");

    const progressButtons = Array.from(
        document.querySelectorAll(".cv-testimonial-progress")
    );

    if (!slides.length) return;

    let currentIndex = 0;
    let autoplayTimer;
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    totalCounter.textContent = String(slides.length).padStart(2, "0");

    function showSlide(index) {
        currentIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            const active = i === currentIndex;

            slide.classList.toggle("is-active", active);
            slide.setAttribute("aria-hidden", String(!active));

            if (active) {
                slide.removeAttribute("inert");
            } else {
                slide.setAttribute("inert", "");
            }
        });

        progressButtons.forEach((button, i) => {
            const active = i === currentIndex;

            button.classList.toggle("is-active", active);
            button.setAttribute("aria-pressed", String(active));
        });

        currentCounter.textContent = String(currentIndex + 1).padStart(2, "0");
    }

    function stopAutoplay() {
        clearInterval(autoplayTimer);
    }

    function startAutoplay() {
        stopAutoplay();

        if (reducedMotion.matches || slides.length < 2) return;

        autoplayTimer = setInterval(() => {
            showSlide(currentIndex + 1);
        }, 6500);
    }

    prevButton.addEventListener("click", () => {
        showSlide(currentIndex - 1);
        startAutoplay();
    });

    nextButton.addEventListener("click", () => {
        showSlide(currentIndex + 1);
        startAutoplay();
    });

    progressButtons.forEach((button) => {
        button.addEventListener("click", () => {
            showSlide(Number(button.dataset.slide));
            startAutoplay();
        });
    });

    slider.addEventListener("mouseenter", stopAutoplay);
    slider.addEventListener("mouseleave", startAutoplay);
    slider.addEventListener("focusin", stopAutoplay);
    slider.addEventListener("focusout", (event) => {
        if (!slider.contains(event.relatedTarget)) {
            startAutoplay();
        }
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });

    reducedMotion.addEventListener?.("change", startAutoplay);

    showSlide(0);
    startAutoplay();

});







/* ==========================================
   CARVIBE - CUSTOMER SUPPORT JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const supportSection = document.querySelector("#customer-support");

    if (!supportSection) return;

    /* 1. SCROLL REVEAL ANIMATION */
    const revealElements = supportSection.querySelectorAll(
        ".cv-support-content, .cv-support-visual, .cv-support-topic"
    );

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("cv-support-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15
            }
        );

        revealElements.forEach(function (element) {
            element.classList.add("cv-support-reveal");
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(function (element) {
            element.classList.add("cv-support-visible");
        });
    }


    /* 2. STAGGERED TOPIC ANIMATIONS */
    const supportTopics = supportSection.querySelectorAll(
        ".cv-support-topic"
    );

    supportTopics.forEach(function (topic, index) {
        topic.style.transitionDelay = (index * 100) + "ms";
    });


    /* 3. SMOOTH SCROLL FOR INTERNAL LINKS */
    const supportLinks = supportSection.querySelectorAll('a[href^="#"]');

    supportLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                event.preventDefault();

                targetElement.scrollIntoView({
                    behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches ? "auto" : "smooth",
                    block: "start"
                });
            }
        });
    });


    /* 4. TOPIC HOVER / KEYBOARD INTERACTION */
    supportTopics.forEach(function (topic) {
        topic.addEventListener("mouseenter", function () {
            topic.classList.add("cv-topic-active");
        });

        topic.addEventListener("mouseleave", function () {
            topic.classList.remove("cv-topic-active");
        });

        topic.addEventListener("focusin", function () {
            topic.classList.add("cv-topic-active");
        });

        topic.addEventListener("focusout", function () {
            topic.classList.remove("cv-topic-active");
        });
    });


    /* 5. SUPPORT VISUAL HOVER EFFECT */
    const supportVisual = supportSection.querySelector(
        ".cv-support-visual"
    );

    if (supportVisual) {
        supportVisual.addEventListener("mouseenter", function () {
            supportVisual.classList.add("cv-support-visual-active");
        });

        supportVisual.addEventListener("mouseleave", function () {
            supportVisual.classList.remove("cv-support-visual-active");
        });
    }

});






