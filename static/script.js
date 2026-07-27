/* ===========================================================
   SpendWise - Frontend Logic
   =========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    setActiveNavLink();
    initDatePicker();
    initPurchaseForm();
    initCategoryPills();
    initFileUpload();
    initRecentTransactions();
    initMonthlyAnalytics();
    initDashboard();
    initDashboardStats();
});


/* -----------------------------------------------------------
   Helpers
   ----------------------------------------------------------- */

const formatRupees = (amount) =>
    "₹" + Number(amount).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const formatRupeesShort = (amount) => {
    const n = Number(amount);
    if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + "L";
    if (n >= 1000)   return "₹" + (n / 1000).toFixed(1) + "K";
    return "₹" + n.toFixed(0);
};

const getMonthName = (dateString) => {
    const [year, month] = dateString.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleString("default", { month: "long" });
};

const getMonthYear = (dateString) => {
    const [year] = dateString.split("-");
    return `${getMonthName(dateString)} ${year}`;
};

const getMonthShort = (dateString) => {
    const [year, month] = dateString.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleString("default", { month: "short" }) + " " + year.slice(2);
};

const CATEGORY_COLORS = {
    Restaurants:              "#EF4444",
    "Furniture/Home":         "#10B981",
    "Gas/Car":                "#3B82F6",
    Clothes:                  "#EC4899",
    "School/Office Supplies": "#F59E0B",
    Misc:                     "#06B6D4",
    Groceries:                "#8B5CF6",
};
const DEFAULT_COLOR = "#94A3B8";
const getColorFor = (category) => CATEGORY_COLORS[category] || DEFAULT_COLOR;

// Format "2026-07-24" → "24 Jul 2026"
function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

// Convert hex color to rgba with alpha
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


/* -----------------------------------------------------------
   Toast Notifications
   ----------------------------------------------------------- */

function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast toast-${type} show`;

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


/* -----------------------------------------------------------
   Navigation
   ----------------------------------------------------------- */

function setActiveNavLink() {
    const currentPath = window.location.pathname;
    document.querySelectorAll("nav a").forEach((link) => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });
}


/* -----------------------------------------------------------
   Date Picker Default (Add Expense)
   ----------------------------------------------------------- */

function initDatePicker() {
    const dateInput = document.getElementById("date");
    if (!dateInput) return;

    const today = new Date();
    const localDate =
        today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0") + "-" +
        String(today.getDate()).padStart(2, "0");

    dateInput.value = localDate;
}


/* -----------------------------------------------------------
   Category Pills (Add Expense)
   ----------------------------------------------------------- */

function initCategoryPills() {
    const grid = document.getElementById("categoryGrid");
    if (!grid) return;

    const hiddenInput = document.getElementById("category");
    const customInput = document.getElementById("customCategory");
    const pills = grid.querySelectorAll(".category-pill");

    pills.forEach((pill) => {
        pill.addEventListener("click", () => {
            pills.forEach((p) => p.classList.remove("selected"));
            pill.classList.add("selected");

            const value = pill.dataset.category;

            if (value === "__other__") {
                customInput.style.display = "block";
                customInput.required = true;
                customInput.focus();
                hiddenInput.value = "";
            } else {
                customInput.style.display = "none";
                customInput.required = false;
                customInput.value = "";
                hiddenInput.value = value;
            }
        });
    });
}


/* -----------------------------------------------------------
   File Upload (Add Expense)
   ----------------------------------------------------------- */

function initFileUpload() {
    const fileInput = document.getElementById("photo");
    const fileDropText = document.getElementById("fileDropText");
    if (!fileInput || !fileDropText) return;

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        fileDropText.textContent = file
            ? file.name
            : "Click to upload a receipt photo";
    });
}


/* -----------------------------------------------------------
   Add Expense Form
   ----------------------------------------------------------- */

function initPurchaseForm() {
    const form = document.getElementById("purchaseForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const hiddenCategory = form.category.value;
        const customCategory = form.customCategory.value.trim();

        let finalCategory = hiddenCategory;
        if (!hiddenCategory && customCategory) {
            finalCategory = customCategory;
        } else if (!hiddenCategory && !customCategory) {
            showToast("Please select a category", "error");
            return;
        }

        const savedDate = form.date.value;

        const formData = new FormData();
        formData.append("date", form.date.value);
        formData.append("business", form.business.value);
        formData.append("amount", parseFloat(form.amount.value));
        formData.append("category", finalCategory);
        formData.append("description", form.description.value);

        const photoFile = form.photo.files[0];
        if (photoFile) formData.append("photo", photoFile);

        try {
            const response = await fetch("/api/add", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();

            if (result.success) {
                showToast("Expense added successfully", "success");

                form.reset();
                document.getElementById("date").value = savedDate;
                document.getElementById("category").value = "";

                document.querySelectorAll(".category-pill").forEach((p) =>
                    p.classList.remove("selected")
                );

                const customInput = document.getElementById("customCategory");
                customInput.style.display = "none";
                customInput.required = false;

                document.getElementById("fileDropText").textContent =
                    "Click to upload a receipt photo";
            } else {
                showToast("Error adding expense", "error");
            }
        } catch (error) {
            console.error("Error:", error);
            showToast("Something went wrong. Try again.", "error");
        }
    });
}


/* -----------------------------------------------------------
   Recent Transactions Page
   ----------------------------------------------------------- */

let allPurchases = [];
let activeCategory = "all";
let searchQuery = "";

function initRecentTransactions() {
    const table = document.getElementById("purchasesTable");
    if (!table) return;

    fetch("/api/purchases")
        .then((r) => r.json())
        .then((purchases) => {
            allPurchases = purchases || [];
            buildFilterChips();
            setupSearch();
            renderPurchases();
        })
        .catch((err) => console.error("Error fetching purchases:", err));
}

// Build category filter chips from the data
function buildFilterChips() {
    const container = document.getElementById("filterChips");
    if (!container) return;

    const categories = [...new Set(allPurchases.map((p) => p.category))];

    categories.forEach((cat) => {
        const chip = document.createElement("button");
        chip.className = "filter-chip";
        chip.dataset.category = cat;
        chip.innerHTML = `
            <span class="chip-dot" style="background:${getColorFor(cat)}"></span>
            ${cat}`;
        container.appendChild(chip);
    });

    // Hook up click handlers on ALL chips (including "All")
    container.querySelectorAll(".filter-chip").forEach((chip) => {
        chip.addEventListener("click", () => {
            container.querySelectorAll(".filter-chip").forEach((c) =>
                c.classList.remove("active")
            );
            chip.classList.add("active");
            activeCategory = chip.dataset.category;
            renderPurchases();
        });
    });
}

// Search input handler
function setupSearch() {
    const input = document.getElementById("searchInput");
    if (!input) return;

    input.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        renderPurchases();
    });
}

// Filter + render the table
function renderPurchases() {
    const tbody = document.querySelector("#purchasesTable tbody");
    const countEl = document.getElementById("resultsCount");

    let filtered = allPurchases;

    if (activeCategory !== "all") {
        filtered = filtered.filter((p) => p.category === activeCategory);
    }

    if (searchQuery) {
        filtered = filtered.filter((p) =>
            (p.business || "").toLowerCase().includes(searchQuery) ||
            (p.category || "").toLowerCase().includes(searchQuery) ||
            (p.description || "").toLowerCase().includes(searchQuery)
        );
    }

    countEl.textContent = filtered.length
        ? `${filtered.length} transaction${filtered.length === 1 ? "" : "s"}`
        : "";

    tbody.innerHTML = "";

    if (!filtered.length) {
        tbody.innerHTML = `
            <tr><td colspan="6" class="empty-state">
                No matching transactions.
            </td></tr>`;
        return;
    }

    filtered.forEach((p) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="td-date">${formatDate(p.date)}</td>
            <td class="td-business">${p.business}</td>
            <td>
                <span class="category-badge" style="
                    background:${hexToRgba(getColorFor(p.category), 0.12)};
                    color:${getColorFor(p.category)};">
                    ${p.category}
                </span>
            </td>
            <td class="td-notes">${p.description || "—"}</td>
            <td class="td-amount">${formatRupees(p.amount)}</td>
            <td>${p.photo
                ? `<img src="data:image/jpeg;base64,${p.photo}" alt="Receipt">`
                : "—"}</td>`;
        tbody.appendChild(row);
    });
}


/* -----------------------------------------------------------
   Analytics Page
   ----------------------------------------------------------- */

function initMonthlyAnalytics() {
    const overview = document.getElementById("monthlyOverview");
    if (!overview) return;

    Promise.all([
        fetch("/api/monthly-totals").then((r) => r.json()),
        fetch("/api/category-totals").then((r) => r.json()),
    ])
        .then(([months, categories]) => {
            if (!months.length) {
                overview.innerHTML = `
                    <p class="empty-state">
                        No expenses recorded yet. Add one to see analytics.
                    </p>`;
                document.getElementById("analyticsSummary").style.display = "none";
                document.querySelector(".analytics-card").style.display = "none";
                document.querySelector(".section-title").style.display = "none";
                return;
            }

            renderAnalyticsSummary(months, categories);
            renderCategoryBreakdown(categories);
            renderMonthlyCards(months, overview);
        })
        .catch((err) => console.error("Error loading analytics:", err));
}

// Top summary strip
function renderAnalyticsSummary(months, categories) {
    const highest = months.reduce((a, b) => (a.total > b.total ? a : b));
    document.getElementById("statHighestMonth").textContent = getMonthYear(highest.month);
    document.getElementById("statHighestMonthAmount").textContent = formatRupees(highest.total);

    if (categories.length) {
        document.getElementById("statTopCategory").textContent = categories[0].category;
        document.getElementById("statTopCategoryAmount").textContent =
            formatRupees(categories[0].category_amount);
    }

    const total = months.reduce((sum, m) => sum + m.total, 0);
    const avg = total / months.length;
    document.getElementById("statAverage").textContent = formatRupees(avg);
}

// Horizontal bars for category breakdown
function renderCategoryBreakdown(categories) {
    const container = document.getElementById("categoryBreakdown");
    if (!container || !categories.length) return;

    const total = categories.reduce((sum, c) => sum + c.category_amount, 0);
    const maxAmount = Math.max(...categories.map((c) => c.category_amount));

    container.innerHTML = "";

    categories.forEach((cat) => {
        const percent = ((cat.category_amount / total) * 100).toFixed(1);
        const barWidth = (cat.category_amount / maxAmount) * 100;
        const color = getColorFor(cat.category);

        const row = document.createElement("div");
        row.className = "breakdown-row";
        row.innerHTML = `
            <div class="breakdown-label">
                <span class="breakdown-dot" style="background:${color}"></span>
                <span class="breakdown-name">${cat.category}</span>
            </div>
            <div class="breakdown-bar-wrapper">
                <div class="breakdown-bar" style="width:${barWidth}%; background:${color}"></div>
            </div>
            <div class="breakdown-values">
                <span class="breakdown-amount">${formatRupees(cat.category_amount)}</span>
                <span class="breakdown-percent">${percent}%</span>
            </div>
        `;
        container.appendChild(row);
    });
}

// Grid of monthly summary cards
function renderMonthlyCards(months, container) {
    months.forEach((item) => {
        const card = createMonthCard(item);
        container.appendChild(card);
        loadMonthPieChart(item.month, card);
    });
}

function createMonthCard(item) {
    const card = document.createElement("div");
    card.className = "overview-item";
    card.innerHTML = `
        <div class="overview-header">
            <span class="month-name">${getMonthYear(item.month)}</span>
            <span class="total-amount">${formatRupees(item.total)}</span>
        </div>
        <div class="pie-chart-container"><canvas></canvas></div>
        <div class="overview-top-category" data-month="${item.month}"></div>`;
    return card;
}

function loadMonthPieChart(month, card) {
    const canvas = card.querySelector("canvas");
    const topCatEl = card.querySelector(".overview-top-category");

    fetch(`/api/category-totals?month=${month}`)
        .then((r) => r.json())
        .then((data) => {
            if (!Array.isArray(data) || !data.length) return;
            renderPieChart(canvas, data);

            const top = data[0];
            topCatEl.innerHTML = `
                <span class="top-cat-label">Top:</span>
                <span class="top-cat-dot" style="background:${getColorFor(top.category)}"></span>
                <span class="top-cat-name">${top.category}</span>`;
        })
        .catch((err) => console.error("Error fetching category data:", err));
}


/* -----------------------------------------------------------
   Dashboard Charts
   ----------------------------------------------------------- */

function initDashboard() {
    const lineChartCanvas = document.getElementById("monthlySpendingChart");
    const pieChartCanvas = document.getElementById("allTimeCategoriesChart");
    if (!lineChartCanvas || !pieChartCanvas) return;

    fetch("/api/monthly-totals?sort=ASC")
        .then((r) => r.json())
        .then((data) => {
            if (Array.isArray(data) && data.length) {
                renderLineChart(lineChartCanvas, data);
            }
        });

    fetch("/api/category-totals")
        .then((r) => r.json())
        .then((data) => {
            if (Array.isArray(data) && data.length) {
                renderPieChart(pieChartCanvas, data);
            }
        });
}


/* -----------------------------------------------------------
   Dashboard Stats (top cards)
   ----------------------------------------------------------- */

function initDashboardStats() {
    const grid = document.getElementById("statsGrid");
    if (!grid) return;

    fetch("/api/purchases")
        .then((r) => r.json())
        .then((purchases) => {
            if (!Array.isArray(purchases) || !purchases.length) return;

            const total = purchases.reduce((sum, p) => sum + p.amount, 0);
            const count = purchases.length;

            const now = new Date();
            const currentMonth =
                now.getFullYear() + "-" +
                String(now.getMonth() + 1).padStart(2, "0");

            const thisMonthTotal = purchases
                .filter((p) => p.date.startsWith(currentMonth))
                .reduce((sum, p) => sum + p.amount, 0);

            document.getElementById("statTotal").textContent = formatRupees(total);
            document.getElementById("statMonth").textContent = formatRupees(thisMonthTotal);
            document.getElementById("statCount").textContent = count;
        });

    fetch("/api/category-totals")
        .then((r) => r.json())
        .then((data) => {
            if (Array.isArray(data) && data.length) {
                document.getElementById("statTop").textContent = data[0].category;
            }
        });
}


/* -----------------------------------------------------------
   Chart Renderers
   ----------------------------------------------------------- */

function renderPieChart(canvas, data) {
    const categories = data.map((d) => d.category);
    const totals = data.map((d) => d.category_amount);
    const colors = categories.map(getColorFor);

    new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: categories,
            datasets: [{
                data: totals,
                backgroundColor: colors,
                borderWidth: 3,
                borderColor: "#FFFFFF",
                hoverOffset: 8,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "62%",
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        boxWidth: 10,
                        boxHeight: 10,
                        padding: 14,
                        font: { size: 12, family: "Inter" },
                        color: "#475569",
                        usePointStyle: true,
                        pointStyle: "circle",
                    },
                },
                tooltip: {
                    backgroundColor: "#0F172A",
                    padding: 12,
                    titleFont: { size: 13, family: "Inter", weight: "600" },
                    bodyFont: { size: 12, family: "Inter" },
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) => ` ${formatRupees(ctx.parsed)}`,
                    },
                },
            },
        },
    });
}

function renderLineChart(canvas, data) {
    const totals = data.map((d) => d.total);
    const average = totals.reduce((a, b) => a + b, 0) / totals.length;
    const maxValue = Math.max(...totals);

    const subtitle = document.getElementById("chartSubtitle");
    if (subtitle) {
        subtitle.textContent = `Avg ${formatRupees(average)} / month`;
    }

    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "#4F46E5");
    gradient.addColorStop(1, "#818CF8");

    const highlightGradient = ctx.createLinearGradient(0, 0, 0, 300);
    highlightGradient.addColorStop(0, "#10B981");
    highlightGradient.addColorStop(1, "#34D399");

    const backgroundColors = totals.map((val) =>
        val === maxValue ? highlightGradient : gradient
    );

    new Chart(canvas, {
        type: "bar",
        data: {
            labels: data.map((item) => getMonthShort(item.month)),
            datasets: [
                {
                    label: "Spent",
                    data: totals,
                    backgroundColor: backgroundColors,
                    borderRadius: 8,
                    borderSkipped: false,
                    barThickness: 28,
                    maxBarThickness: 40,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: "index" },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "#0F172A",
                    padding: 12,
                    titleFont: { size: 13, family: "Inter", weight: "600" },
                    bodyFont: { size: 12, family: "Inter" },
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: (ctx) => "Spent: " + formatRupees(ctx.parsed.y),
                    },
                },
                annotation: {
                    annotations: {
                        avgLine: {
                            type: "line",
                            yMin: average,
                            yMax: average,
                            borderColor: "#94A3B8",
                            borderWidth: 1.5,
                            borderDash: [6, 6],
                            label: {
                                display: true,
                                content: "Avg " + formatRupeesShort(average),
                                position: "end",
                                backgroundColor: "rgba(15, 23, 42, 0.85)",
                                color: "white",
                                font: { size: 10, family: "Inter", weight: "600" },
                                padding: { top: 4, bottom: 4, left: 8, right: 8 },
                                borderRadius: 6,
                            },
                        },
                    },
                },
            },
            scales: {
                x: {
                    grid: { display: false },
                    border: { display: false },
                    ticks: {
                        color: "#94A3B8",
                        font: { size: 11, family: "Inter" },
                    },
                },
                y: {
                    beginAtZero: true,
                    grid: { color: "#F1F5F9", drawTicks: false },
                    border: { display: false },
                    ticks: {
                        color: "#94A3B8",
                        font: { size: 11, family: "Inter" },
                        padding: 8,
                        callback: (value) => formatRupeesShort(value),
                    },
                },
            },
        },
    });
}