
/* ==========================================
   CARVIBE — ACTIVE HEADER PAGE UNDERLINE
========================================== */

document.addEventListener("DOMContentLoaded", function () {
    const mainNav = document.getElementById("mainNav");

    if (!mainNav) return;

    const navLinks = mainNav.querySelectorAll("a[href]");

    function normalizePath(path) {
        try {
            path = decodeURIComponent(path);
        } catch (error) {
            // Keep original path if decoding fails.
        }

        path = path.replace(/\/index\.html$/i, "/");

        if (path.length > 1) {
            path = path.replace(/\/+$/, "");
        }

        return path.toLowerCase();
    }

    function setActiveLink() {
        const currentURL = new URL(window.location.href);
        const currentPath = normalizePath(currentURL.pathname);

        let activeLink = null;

        navLinks.forEach(function (link) {
            link.classList.remove("active");
            link.removeAttribute("aria-current");

            const href = link.getAttribute("href");

            if (!href || href.trim() === "#") return;

            let linkURL;

            try {
                linkURL = new URL(href, window.location.href);
            } catch (error) {
                return;
            }

            if (linkURL.origin !== currentURL.origin) return;

            const linkPath = normalizePath(linkURL.pathname);

            if (linkPath === currentPath) {
                activeLink = link;
            }
        });

        if (!activeLink) return;

        // Highlight the exact link for the current page.
        activeLink.classList.add("active");
        activeLink.setAttribute("aria-current", "page");

        // If a Home dropdown page is active, highlight its parent too.
        const dropdown = activeLink.closest(".dropdown");

        if (dropdown) {
            const parentLink = dropdown.querySelector(".dropdown-toggle");

            if (parentLink && parentLink !== activeLink) {
                parentLink.classList.add("active");
            }
        }
    }

    setActiveLink();

    window.addEventListener("pageshow", setActiveLink);
    window.addEventListener("popstate", setActiveLink);
});
