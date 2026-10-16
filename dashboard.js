
/* ========================================
   CARVIBE DASHBOARD
   dashboard.js
======================================== */

"use strict";

/* ELEMENT SELECTORS */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

/* DASHBOARD STATE */
const state = {
    role: "buyer",
    section: "overview",
    savedCount: 4,
    editingIndex: null,

    vehicles: [
        {
            name: "Hyundai Creta SX",
            year: 2022,
            price: 1280000,
            fuel: "Petrol",
            status: "Active",
            views: 245,
            inquiries: 5
        },
        {
            name: "Honda City ZX",
            year: 2023,
            price: 1145000,
            fuel: "Petrol",
            status: "Active",
            views: 182,
            inquiries: 3
        },
        {
            name: "Tata Nexon EV",
            year: 2023,
            price: 1320000,
            fuel: "Electric",
            status: "Pending",
            views: 98,
            inquiries: 2
        }
    ]
};

/* ========================================
   THEME: DARK / LIGHT MODE
======================================== */

const themeToggle = $("#themeToggle");

function applyTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);

    themeToggle.innerHTML = isDark
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';

    themeToggle.title = isDark ? "Light mode" : "Dark mode";
    themeToggle.setAttribute("aria-label", themeToggle.title);
}

themeToggle.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark-mode");

    applyTheme(isDark);

    try {
        localStorage.setItem("carvibe-theme", isDark ? "dark" : "light");
    } catch (error) {
        // Theme still works when storage is unavailable.
    }
});

try {
    applyTheme(localStorage.getItem("carvibe-theme") === "dark");
} catch (error) {
    applyTheme(false);
}

/* ========================================
   RTL / LTR TOGGLE
======================================== */

$("#rtlToggle").addEventListener("click", () => {
    const html = document.documentElement;
    const isRTL = html.getAttribute("dir") !== "rtl";

    html.setAttribute("dir", isRTL ? "rtl" : "ltr");

    // Direction and language are independent.
    // Use a different language attribute if appropriate.
    $("#rtlToggle").classList.toggle("is-active", isRTL);

    $("#rtlToggle").title = isRTL
        ? "Switch to left-to-right"
        : "Switch to right-to-left";

    closeSidebar();

    try {
        localStorage.setItem("carvibe-direction", isRTL ? "rtl" : "ltr");
    } catch (error) {
        // Direction still works without storage.
    }
});

try {
    const savedDirection = localStorage.getItem("carvibe-direction");

    if (savedDirection === "rtl" || savedDirection === "ltr") {
        document.documentElement.setAttribute("dir", savedDirection);
        $("#rtlToggle").classList.toggle("is-active", savedDirection === "rtl");
    }
} catch (error) {
    // Default direction remains LTR.
}

/* ========================================
   MOBILE SIDEBAR
======================================== */

const sidebar = $("#sidebar");
const menuToggle = $("#menuToggle");

function closeSidebar() {
    sidebar.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
}

menuToggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeSidebar();
        closeVehicleModal();
    }
});

/* ========================================
   UTILITY FUNCTIONS
======================================== */

function formatPrice(price) {
    return "₹" + Number(price).toLocaleString("en-IN");
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function setText(selector, value) {
    const element = $(selector);

    if (element) {
        element.textContent = value;
    }
}

/* ========================================
   BUYER / SELLER MODE
======================================== */

function setRole(role) {
    state.role = role;
    state.section = "overview";

    $$(".role-btn").forEach((button) => {
        button.classList.toggle("active", button.dataset.role === role);
    });

    const isSeller = role === "seller";

    $("#buyerStats").classList.toggle("hidden", isSeller);
    $("#sellerStats").classList.toggle("hidden", !isSeller);

    $("#analyticsNav").classList.toggle("hidden", !isSeller);

    setText(
        "#profileRole",
        isSeller ? "Seller Account" : "Buyer Account"
    );

    setText(
        "#welcomeDescription",
        isSeller
            ? "Manage your listings, respond to buyers and track your sales."
            : "Manage your saved cars, track inquiries and discover your next ride."
    );

    setText(
        "#mainActionText",
        isSeller ? "Add Vehicle" : "Explore Cars"
    );

    setText(
        "#vehicleNavLabel",
        isSeller ? "My Listings" : "Saved Vehicles"
    );

    setText(
        "#vehiclePanelTitle",
        isSeller ? "Your Listings" : "Saved Vehicles"
    );

    setText(
        "#vehiclePanelDescription",
        isSeller
            ? "Manage your active vehicle listings"
            : "Your shortlisted cars"
    );

    setText(
        "#inquiryPanelDescription",
        isSeller
            ? "Potential buyers interested in your vehicles"
            : "Your latest conversations"
    );

    setText(
        "#noticeTitle",
        isSeller
            ? "Keep your listings up to date!"
            : "Your next car is closer than you think!"
    );

    setText(
        "#noticeDescription",
        isSeller
            ? "Respond to buyer questions quickly and upload inspection reports to build trust."
            : "Compare inspection reports and follow up with sellers to make a confident purchase."
    );

    updateStatistics();
    renderVehicles();
    renderSection("overview");
}

$$(".role-btn").forEach((button) => {
    button.addEventListener("click", () => {
        setRole(button.dataset.role);
        closeSidebar();
    });
});

/* ========================================
   STATISTICS
======================================== */

function updateStatistics() {
    const activeListings = state.vehicles.filter(
        (vehicle) => vehicle.status === "Active"
    ).length;

    setText(
        "#activeListingStat",
        String(activeListings).padStart(2, "0")
    );

    setText(
        "#vehicleNavCount",
        state.role === "seller"
            ? String(state.vehicles.length).padStart(2, "0")
            : String(state.savedCount).padStart(2, "0")
    );

    setText(
        "#savedStat",
        String(state.savedCount).padStart(2, "0")
    );
}

/* ========================================
   VEHICLE LIST RENDERING
======================================== */

function renderVehicles() {
    const vehicleList = $("#vehicleList");

    if (state.role === "buyer") {
        // Keep the sample buyer shortlist in the HTML.
        return;
    }

    if (state.vehicles.length === 0) {
        vehicleList.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-car"></i>
                No vehicle listings yet.
                Click Add Vehicle to create your first listing.
            </div>
        `;
        return;
    }

    vehicleList.innerHTML = state.vehicles.slice(0, 4).map(
        (vehicle, index) => `
        <article class="vehicle-item"
                 data-search="${escapeHTML(
                     `${vehicle.name} ${vehicle.year} ${vehicle.fuel}`
                 ).toLowerCase()}">

            <img class="vehicle-image"
                 src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80"
                 alt="${escapeHTML(vehicle.name)}">

            <div class="vehicle-info">
                <h4>${escapeHTML(vehicle.name)}</h4>

                <p>${vehicle.year} · ${escapeHTML(vehicle.fuel)}</p>

                <div class="vehicle-price">
                    ${formatPrice(vehicle.price)}
                </div>

                <div class="vehicle-bottom">
                    <span class="status ${
                        vehicle.status === "Active" ? "active" : "pending"
                    }">${escapeHTML(vehicle.status)}</span>

                    <div class="mini-actions">
                        <button class="mini-btn"
                                data-action="edit"
                                data-index="${index}"
                                aria-label="Edit vehicle">
                            <i class="fa-solid fa-pen"></i>
                        </button>

                        <button class="mini-btn"
                                data-action="delete"
                                data-index="${index}"
                                aria-label="Delete vehicle">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    `
    ).join("");

    updateStatistics();
}

/* ========================================
   DASHBOARD NAVIGATION
======================================== */

const sectionContent = {
    vehicles: {
        buyerTitle: "Saved Vehicles",
        sellerTitle: "My Vehicle Listings",
        buyerDescription: "Review your shortlist and compare your favourite cars.",
        sellerDescription: "Manage pricing, listing status and vehicle details.",
        panelTitle: "Vehicle Management",
        actionBuyer: "Explore Cars",
        actionSeller: "Add Vehicle"
    },

    inquiries: {
        buyerTitle: "Buyer Inquiries",
        sellerTitle: "Buyer Inquiries",
        buyerDescription: "Keep track of conversations with vehicle sellers.",
        sellerDescription: "Respond to potential buyers and manage leads.",
        panelTitle: "Inquiry Management",
        actionBuyer: "Find Cars",
        actionSeller: "View Inquiries"
    },

    inspections: {
        buyerTitle: "Inspection Reports",
        sellerTitle: "Inspection Reports",
        buyerDescription: "Review vehicle condition and verification status.",
        sellerDescription: "Manage vehicle inspections and build buyer confidence.",
        panelTitle: "Vehicle Inspection Documents",
        actionBuyer: "Explore Cars",
        actionSeller: "Add Vehicle"
    },

    appointments: {
        buyerTitle: "Test Drives",
        sellerTitle: "Test Drive Requests",
        buyerDescription: "Review your upcoming test drives and appointments.",
        sellerDescription: "Manage test-drive requests from interested buyers.",
        panelTitle: "Appointment Schedule",
        actionBuyer: "Find Cars",
        actionSeller: "View Inquiries"
    },

    analytics: {
        buyerTitle: "Performance",
        sellerTitle: "Listing Performance",
        buyerDescription: "Review your account activity and purchase progress.",
        sellerDescription: "Track vehicle views, inquiries and sales performance.",
        panelTitle: "Performance Overview",
        actionBuyer: "Explore Cars",
        actionSeller: "Add Vehicle"
    },

    settings: {
        buyerTitle: "Account Settings",
        sellerTitle: "Account Settings",
        buyerDescription: "Manage your profile and account preferences.",
        sellerDescription: "Update your seller profile and preferences.",
        panelTitle: "Profile & Preferences",
        actionBuyer: "Save Settings",
        actionSeller: "Save Settings"
    }
};

function renderSection(section) {
    state.section = section;

    $$(".nav-link").forEach((link) => {
        link.classList.toggle(
            "active",
            link.dataset.section === section
        );
    });

    $("#overviewSection").classList.toggle(
        "hidden",
        section !== "overview"
    );

    $("#detailSection").classList.toggle(
        "hidden",
        section === "overview"
    );

    if (section === "overview") {
        closeSidebar();
        return;
    }

    const config = sectionContent[section];

    if (!config) {
        renderSection("overview");
        return;
    }

    const isSeller = state.role === "seller";

    setText(
        "#detailTitle",
        isSeller ? config.sellerTitle : config.buyerTitle
    );

    setText(
        "#detailDescription",
        isSeller ? config.sellerDescription : config.buyerDescription
    );

    setText("#detailPanelTitle", config.panelTitle);

    setText(
        "#detailActionText",
        isSeller ? config.actionSeller : config.actionBuyer
    );

    const hideAction = [
        "inquiries",
        "inspections",
        "analytics",
        "appointments"
    ].includes(section);

    $("#detailAction").classList.toggle("hidden", hideAction);

    renderDetailBody(section);
    closeSidebar();
}

/* SIDEBAR LINKS */
$$(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
        renderSection(link.dataset.section);
    });
});

/* VIEW ALL LINKS */
$$("[data-open-section]").forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        renderSection(button.dataset.openSection);
    });
});

$("#backToOverview").addEventListener("click", () => {
    renderSection("overview");
});

/* PRIMARY ACTIONS */
$("#mainAction").addEventListener("click", () => {
    if (state.role === "seller") {
        openVehicleModal();
    } else {
        renderSection("vehicles");
    }
});

$("#detailAction").addEventListener("click", () => {
    if (state.role === "seller") {
        openVehicleModal();
    } else if (state.section === "settings") {
        $("#settingsForm")?.requestSubmit();
    } else {
        renderSection("vehicles");
    }
});

/* ========================================
   DETAIL PAGE CONTENT
======================================== */

function renderDetailBody(section) {
    const body = $("#detailBody");
    const isSeller = state.role === "seller";

    if (section === "vehicles") {
        if (isSeller) {
            body.innerHTML = renderVehicleTable();
        } else {
            const cards = $$("#vehicleList .vehicle-item")
                .filter((item) => !item.classList.contains("hidden"));

            body.innerHTML = cards.length
                ? `<div class="vehicle-list">${cards.map(
                    (item) => item.outerHTML
                  ).join("")}</div>`
                : `<div class="empty-state">
                    <i class="fa-regular fa-heart"></i>
                    No saved vehicles found.
                   </div>`;
        }
    }

    if (section === "inquiries") {
        body.innerHTML = `
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Contact</th>
                            <th>Vehicle</th>
                            <th>Message</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Michael King</td>
                            <td>Hyundai Creta SX</td>
                            <td>Availability and pricing</td>
                            <td><span class="status new">New</span></td>
                            <td>
                                <button class="secondary-btn"
                                        data-action="reply"
                                        data-name="Michael King">Reply</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Sarah Parker</td>
                            <td>Honda City ZX</td>
                            <td>Request for a test drive</td>
                            <td><span class="status pending">Pending</span></td>
                            <td>
                                <button class="secondary-btn"
                                        data-action="reply"
                                        data-name="Sarah Parker">Reply</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Robert James</td>
                            <td>Tata Nexon EV</td>
                            <td>Inspection report details</td>
                            <td><span class="status active">Responded</span></td>
                            <td>
                                <button class="secondary-btn"
                                        data-action="reply"
                                        data-name="Robert James">Reply</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    if (section === "inspections") {
        body.innerHTML = `
            <div class="report-list">
                ${[
                    ["Hyundai Creta SX", "Engine, brakes and body verified", "Ready"],
                    ["Honda City ZX", "Full inspection completed", "Ready"],
                    ["Tata Nexon EV", "Battery and electrical inspection", "Pending"]
                ].map(([name, description, status]) => `
                    <div class="report-item">
                        <div class="report-icon">
                            <i class="fa-solid fa-file-circle-check"></i>
                        </div>

                        <div class="report-info">
                            <h4>${name}</h4>
                            <p>${description}</p>
                        </div>

                        <span class="status ${
                            status === "Ready" ? "active" : "pending"
                        }">${status}</span>

                        <button class="mini-btn"
                                data-action="report"
                                data-name="${name}"
                                aria-label="Open inspection report">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </button>
                    </div>
                `).join("")}
            </div>

            <p style="color:var(--text-light);font-size:11px;margin-top:18px">
                Sample report records. Connect your inspection service or
                document storage to access actual reports.
            </p>
        `;
    }

    if (section === "appointments") {
        body.innerHTML = `
            <div class="report-list">
                <div class="report-item">
                    <div class="report-icon">
                        <i class="fa-solid fa-calendar-check"></i>
                    </div>
                    <div class="report-info">
                        <h4>Hyundai Creta SX</h4>
                        <p>Saturday · 10:30 AM · Hyderabad</p>
                    </div>
                    <span class="status active">Confirmed</span>
                </div>

                <div class="report-item">
                    <div class="report-icon">
                        <i class="fa-solid fa-calendar"></i>
                    </div>
                    <div class="report-info">
                        <h4>Honda City ZX</h4>
                        <p>Sunday · 3:00 PM · Hyderabad</p>
                    </div>
                    <span class="status pending">Awaiting</span>
                </div>
            </div>
        `;
    }

    if (section === "analytics") {
        body.innerHTML = `
            <div class="progress-row">
                <div class="progress-label">
                    <span>Listing views</span><strong>1,240</strong>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="--progress:82%"></div>
                </div>
            </div>

            <div class="progress-row">
                <div class="progress-label">
                    <span>Buyer inquiries</span><strong>12</strong>
                </div>
                <div class="progress-track">
                    <div class="progress-fill blue" style="--progress:60%"></div>
                </div>
            </div>

            <div class="progress-row">
                <div class="progress-label">
                    <span>Inspection completion</span><strong>85%</strong>
                </div>
                <div class="progress-track">
                    <div class="progress-fill green" style="--progress:85%"></div>
                </div>
            </div>

            <div class="progress-row">
                <div class="progress-label">
                    <span>Listing conversion</span><strong>24%</strong>
                </div>
                <div class="progress-track">
                    <div class="progress-fill orange" style="--progress:24%"></div>
                </div>
            </div>

            <p style="color:var(--text-light);font-size:11px;margin-top:20px">
                Illustrative metrics. Connect your marketplace analytics
                API to display real performance data.
            </p>
        `;
    }

    if (section === "settings") {
        body.innerHTML = `
            <form id="settingsForm">
                <div class="form-group">
                    <label for="settingsName">Full Name</label>
                    <input id="settingsName" value="${escapeHTML(
                        $("#profileName").textContent
                    )}" required>
                </div>

                <div class="form-group">
                    <label for="settingsEmail">Email Address</label>
                    <input id="settingsEmail" type="email"
                           value="john@example.com" required>
                </div>

                <div class="form-group">
                    <label for="settingsPhone">Phone Number</label>
                    <input id="settingsPhone" type="tel"
                           placeholder="+91 98765 43210">
                </div>

                <button class="primary-btn" type="submit">
                    <i class="fa-solid fa-check"></i> Save Profile
                </button>
            </form>
        `;
    }
}

/* SELLER VEHICLE TABLE */
function renderVehicleTable() {
    if (state.vehicles.length === 0) {
        return `
            <div class="empty-state">
                <i class="fa-solid fa-car"></i>
                You have no listings yet. Select Add Vehicle to begin.
            </div>
        `;
    }

    return `
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Vehicle</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Views</th>
                        <th>Inquiries</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    ${state.vehicles.map((vehicle, index) => `
                        <tr>
                            <td>
                                <div class="table-vehicle">
                                    <img
                                        src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=150&q=75"
                                        alt="${escapeHTML(vehicle.name)}">

                                    <div>
                                        <strong>${escapeHTML(vehicle.name)}</strong>
                                        <small>${vehicle.year} · ${escapeHTML(vehicle.fuel)}</small>
                                    </div>
                                </div>
                            </td>

                            <td>${formatPrice(vehicle.price)}</td>

                            <td>
                                <span class="status ${
                                    vehicle.status === "Active" ? "active" : "pending"
                                }">${escapeHTML(vehicle.status)}</span>
                            </td>

                            <td>${vehicle.views}</td>
                            <td>${vehicle.inquiries}</td>

                            <td>
                                <button class="mini-btn"
                                        data-action="edit"
                                        data-index="${index}"
                                        aria-label="Edit listing">
                                    <i class="fa-solid fa-pen"></i>
                                </button>

                                <button class="mini-btn"
                                        data-action="delete"
                                        data-index="${index}"
                                        aria-label="Delete listing">
                                    <i class="fa-regular fa-trash-can"></i>
                                </button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

/* ========================================
   ADD / EDIT VEHICLE MODAL
======================================== */

const modal = $("#vehicleModal");
const vehicleForm = $("#vehicleForm");

function openVehicleModal(index = null) {
    state.editingIndex = index;
    vehicleForm.reset();

    if (index !== null && state.vehicles[index]) {
        const vehicle = state.vehicles[index];

        setText("#modalTitle", "Edit Vehicle");
        $("#carName").value = vehicle.name;
        $("#carYear").value = vehicle.year;
        $("#carPrice").value = vehicle.price;
        $("#carFuel").value = vehicle.fuel;
    } else {
        setText("#modalTitle", "Add Vehicle");
    }

    modal.classList.add("show");
    $("#carName").focus();
}

function closeVehicleModal() {
    modal.classList.remove("show");
    state.editingIndex = null;
}

$("#closeModal").addEventListener("click", closeVehicleModal);
$("#cancelModal").addEventListener("click", closeVehicleModal);

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeVehicleModal();
    }
});

/* SAVE VEHICLE */
vehicleForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const vehicle = {
        name: $("#carName").value.trim(),
        year: Number($("#carYear").value),
        price: Number($("#carPrice").value),
        fuel: $("#carFuel").value,
        status: "Active",
        views: 0,
        inquiries: 0
    };

    if (!vehicle.name || vehicle.price <= 0) {
        return;
    }

    if (state.editingIndex !== null) {
        const existing = state.vehicles[state.editingIndex];

        if (!existing) return;

        state.vehicles[state.editingIndex] = {
            ...existing,
            ...vehicle
        };
    } else {
        state.vehicles.unshift(vehicle);
    }

    closeVehicleModal();
    setRole(state.role);
    renderSection("vehicles");
});

/* ========================================
   VEHICLE ACTIONS
======================================== */

document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");

    if (!button) return;

    const action = button.dataset.action;
    const index = Number(button.dataset.index);
    const name = button.dataset.name || "";

    if (action === "edit") {
        if (state.role === "seller" && state.vehicles[index]) {
            openVehicleModal(index);
        }
    }

    if (action === "delete") {
        if (!state.vehicles[index]) return;

        const confirmed = confirm("Delete this vehicle listing?");

        if (!confirmed) return;

        state.vehicles.splice(index, 1);

        renderVehicles();
        renderSection(state.section);
    }

    if (action === "remove") {
        if (state.role !== "buyer") return;

        const item = button.closest(".vehicle-item");

        if (!item) return;

        if (!confirm("Remove this vehicle from your saved list?")) {
            return;
        }

        item.remove();

        state.savedCount = Math.max(0, state.savedCount - 1);

        updateStatistics();
    }

    if (action === "details") {
        alert(
            "Vehicle details for " + name +
            ". Connect this action to your vehicle details page."
        );
    }

    if (action === "report") {
        alert(
            "Inspection report for " + name +
            ". Connect the actual report URL or document API to open it."
        );
    }

    if (action === "reply") {
        const reply = prompt("Write a reply to " + name + ":");

        if (reply && reply.trim()) {
            alert(
                "Demo reply prepared. Connect your messaging API " +
                "to send and store this message."
            );
        }
    }
});

/* ========================================
   SEARCH
======================================== */

$("#globalSearch").addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase().trim();

    const searchableItems = [
        ...$$(".vehicle-item"),
        ...$$(".inquiry-item")
    ];

    searchableItems.forEach((item) => {
        const content = (
            (item.dataset.search || "") + " " + item.textContent
        ).toLowerCase();

        item.classList.toggle(
            "hidden",
            query !== "" && !content.includes(query)
        );
    });
});

/* ========================================
   PROFILE AND SETTINGS
======================================== */

$("#profileBtn").addEventListener("click", () => {
    renderSection("settings");
});

document.addEventListener("submit", (event) => {
    if (event.target.id !== "settingsForm") return;

    event.preventDefault();

    const name = $("#settingsName").value.trim();

    if (!name) return;

    setText("#profileName", name);
    setText("#welcomeTitle", "Welcome back, " + name.split(/\s+/)[0] + "!");

    alert(
        "Profile updated in this demo. Connect a backend to save " +
        "profile changes permanently."
    );
});

/* ========================================
   NOTIFICATIONS AND SUPPORT
======================================== */

$("#notificationBtn").addEventListener("click", () => {
    alert(
        "You have 3 demo notifications. Connect a notifications " +
        "service to receive live updates."
    );
});

$("#supportBtn").addEventListener("click", () => {
    alert(
        "Contact CARVIBE Support. Connect your support email, " +
        "chat service or help desk."
    );
});

/* ========================================
   INITIALIZE DASHBOARD
======================================== */

setRole("buyer");







/* ==========================================
   GREETING + PROFILE DROPDOWN
========================================== */

const profileMenu = document.querySelector("#profileMenu");
const profileBtn = document.querySelector("#profileBtn");
const profileDropdown = document.querySelector("#profileDropdown");

function updateGreeting() {
    const hour = new Date().getHours();

    let greeting = "Good evening";

    if (hour < 12) {
        greeting = "Good morning";
    } else if (hour < 17) {
        greeting = "Good afternoon";
    }

    const name = document.querySelector("#profileName")?.textContent.trim()
        || "Driver";

    const firstName = name.split(/\s+/)[0];

    document.querySelector("#greetingMessage").textContent =
        greeting + ",";

    document.querySelector("#greetingName").textContent =
        firstName + "!";

    const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part.charAt(0).toUpperCase())
        .join("");

    document.querySelector("#profileAvatar").textContent = initials || "D";
    document.querySelector("#dropdownAvatar").textContent = initials || "D";
    document.querySelector("#dropdownName").textContent = name;

    document.querySelector("#dropdownRole").textContent =
        document.querySelector("#profileRole")?.textContent || "Account";
}

function closeProfileDropdown() {
    profileDropdown.hidden = true;
    profileBtn.setAttribute("aria-expanded", "false");
}

profileBtn.addEventListener("click", (event) => {
    event.stopPropagation();

    const isOpening = profileDropdown.hidden;

    profileDropdown.hidden = !isOpening;
    profileBtn.setAttribute("aria-expanded", String(isOpening));
});

document.addEventListener("click", (event) => {
    if (profileMenu && !profileMenu.contains(event.target)) {
        closeProfileDropdown();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeProfileDropdown();
    }
});

document.querySelectorAll("[data-profile-action]").forEach((button) => {
    button.addEventListener("click", () => {
        const action = button.dataset.profileAction;

        closeProfileDropdown();

        if (action === "settings") {
            renderSection("settings");
        } else if (action === "help") {
            document.querySelector("#supportBtn")?.click();
        } else if (action === "logout") {
            alert("Connect your sign-out action to your authentication system.");
        }
    });
});

/* Keep greeting and initials in sync after a profile update */
const profileNameElement = document.querySelector("#profileName");

if (profileNameElement) {
    new MutationObserver(updateGreeting).observe(profileNameElement, {
        childList: true,
        characterData: true,
        subtree: true
    });
}

updateGreeting();
