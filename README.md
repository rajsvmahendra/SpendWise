# SpendWise 💰

**Track Smarter. Spend Better.**

SpendWise is a personal expense tracking web application built as a final year Computer Science Engineering project. It helps users record, categorize, analyze, and visualize their daily expenses through an intuitive, modern interface.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Future Scope](#future-scope)
- [Learning Outcomes](#learning-outcomes)
- [Author](#author)

---

## Overview

Managing personal finances is a challenge for most people. SpendWise solves this by providing a simple, elegant tool to:

- **Record** expenses with date, amount, category, and optional receipt photo
- **Visualize** spending trends through interactive charts
- **Analyze** category-wise and month-wise breakdowns
- **Search and filter** past transactions instantly

The project demonstrates full-stack web development using **Python Flask** for the backend, **SQLite** for data storage, and **vanilla HTML/CSS/JavaScript** for the frontend.

---

## Features

| Feature | Description |
|---|---|
| **Add Expense** | Record expenses with date, business name, amount, category, description, and receipt photo |
| **Dashboard** | View total spending, monthly spending, transaction count, and top category at a glance |
| **Monthly Bar Chart** | Visualize month-by-month spending with average line overlay and highest month highlighted |
| **Category Doughnut Chart** | See all-time spending distribution across categories |
| **Analytics Page** | Summary stats, horizontal category breakdown bars, and per-month pie charts |
| **Transactions Page** | Searchable, filterable table with category badges and formatted dates |
| **Category Pills** | Select expense categories via clickable buttons instead of dropdowns |
| **Custom Categories** | Add your own category if none of the defaults apply |
| **Receipt Upload** | Attach a photo of the receipt (stored as BLOB in SQLite) |
| **Toast Notifications** | Visual feedback on form submission (success/error) |
| **Responsive Design** | Works on desktop, tablet, and mobile screens |
| **Indian Rupee (₹)** | All amounts displayed in Indian Rupee format |

---

## Screenshots

> Add screenshots of your running application here.
>
> Recommended screenshots:
> 1. Dashboard with charts and stat cards
> 2. Add Expense form with category pills
> 3. Analytics page with category breakdown bars
> 4. Transactions page with search and filter chips

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Backend** | Python 3, Flask | Web server, routing, API endpoints |
| **Database** | SQLite | Lightweight relational database |
| **Frontend** | HTML5, CSS3, JavaScript (ES6) | User interface and interactivity |
| **Charts** | Chart.js, chartjs-plugin-annotation | Data visualization |
| **Fonts** | Google Fonts (Inter) | Modern typography |
| **Templating** | Jinja2 (built into Flask) | Dynamic HTML rendering |

### Why These Technologies?

- **Flask** — Lightweight Python web framework, easy to learn and deploy
- **SQLite** — Zero-configuration database, no separate server needed, perfect for single-user apps
- **Vanilla JS** — No framework dependency, demonstrates core JavaScript skills
- **Chart.js** — Simple yet powerful charting library with excellent documentation

---

## Project Structure

```
SpendWise/
│
├── app.py                  # Flask backend (routes + API + database)
├── budget.db               # SQLite database (auto-created on first run)
├── requirements.txt        # Python dependencies
├── README.md               # Project documentation
│
├── static/
│   ├── styles.css          # Complete CSS design system
│   ├── script.js           # Frontend logic (fetch, charts, DOM)
│   └── images/
│       ├── logo.png        # SpendWise logo
│       └── favicon.ico     # Browser tab icon
│
└── templates/
    ├── base.html           # Base template (header, nav, footer)
    ├── index.html          # Dashboard page
    ├── add.html            # Add Expense form page
    ├── monthly.html        # Analytics page
    └── recent.html         # Transactions page
```

### File Responsibilities

| File | Responsibility |
|---|---|
| `app.py` | Creates Flask app, initializes database, defines page routes and API routes |
| `styles.css` | All visual styling — layout, colors, typography, responsive design |
| `script.js` | All interactivity — form handling, API calls, chart rendering, search/filter |
| `base.html` | Shared layout inherited by all pages (header, navigation, footer, scripts) |
| `index.html` | Dashboard with stat cards and two charts |
| `add.html` | Expense entry form with category pills and file upload |
| `monthly.html` | Analytics with summary cards, category bars, and monthly pie charts |
| `recent.html` | Searchable/filterable transactions table |

---

## Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/rajsvmahendra/SpendWise.git
   cd SpendWise
   ```

2. **Install dependencies**
   ```bash
   pip install flask
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Open in your browser**
   ```
   http://localhost:5000
   ```

> **Note:** The database (`budget.db`) is created automatically on first run. No manual setup required.

---

## Usage

| Step | Action |
|---|---|
| **Add Expense** | Click **"Add Expense"** in the navigation, fill in the form, select a category, and submit |
| **View Dashboard** | Click **"Dashboard"** to see stat cards, monthly bar chart, and category doughnut chart |
| **Analyze Trends** | Click **"Analytics"** to see your highest month, top category, category bars, and per-month pie charts |
| **Browse Transactions** | Click **"Transactions"** to search, filter by category, and view all recorded expenses |

---

## 🗄 Database Schema

The application uses a single SQLite table:

```sql
CREATE TABLE IF NOT EXISTS purchases (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    date        TEXT    NOT NULL,
    business    TEXT    NOT NULL,
    amount      REAL    NOT NULL,
    category    TEXT    NOT NULL,
    description TEXT,
    photo       BLOB
);
```

| Column | Type | Description |
|---|---|---|
| `id` | INTEGER | Auto-incremented primary key |
| `date` | TEXT | Date of expense (YYYY-MM-DD format) |
| `business` | TEXT | Name of the merchant / business |
| `amount` | REAL | Expense amount in Indian Rupees |
| `category` | TEXT | Expense category (e.g., Food, Travel) |
| `description` | TEXT | Optional note or description |
| `photo` | BLOB | Optional receipt image stored as binary |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/add` | Add a new expense record |
| `GET` | `/api/purchases` | Fetch all purchases (most recent first) |
| `GET` | `/api/monthly-totals` | Get total spending grouped by month |
| `GET` | `/api/category-totals` | Get total spending grouped by category |

### Endpoint Details

#### `POST /api/add`

Accepts `multipart/form-data` with the following fields:

| Field | Type | Required |
|---|---|---|
| `date` | string | ✅ Yes |
| `business` | string | ✅ Yes |
| `amount` | number | ✅ Yes |
| `category` | string | ✅ Yes |
| `description` | string | ❌ Optional |
| `photo` | file | ❌ Optional |

**Response:**
```json
{ "success": true }
```

#### `GET /api/purchases`

Returns all purchases ordered by date descending. Photos are base64-encoded.

**Response:**
```json
[
  {
    "date": "2025-07-20",
    "business": "Zomato",
    "amount": 349.0,
    "category": "Food",
    "description": "Dinner",
    "photo": null
  }
]
```

#### `GET /api/monthly-totals?sort=ASC`

Returns total spending per month. Optional `sort` query param (`ASC` or `DESC`, default `DESC`).

**Response:**
```json
[
  { "month": "2025-07", "total": 4250.5 }
]
```

#### `GET /api/category-totals?month=2025-07`

Returns category-wise totals. Optional `month` param (format: `YYYY-MM`) to filter by a specific month.

**Response:**
```json
[
  { "category": "Food", "category_amount": 1800.0 },
  { "category": "Travel", "category_amount": 950.0 }
]
```

---

## Future Scope

- [ ] **User Authentication** — Multi-user support with login/register
- [ ] **Budget Limits** — Set monthly or category-wise spending limits with alerts
- [ ] **Export to CSV/PDF** — Download transaction history for offline use
- [ ] **Recurring Expenses** — Auto-log monthly fixed expenses (rent, subscriptions)
- [ ] **Dark Mode Toggle** — User-switchable theme preference
- [ ] **PWA Support** — Install as a Progressive Web App on mobile
- [ ] **AI Insights** — Smart suggestions based on spending patterns

---

## Learning Outcomes

This project demonstrates practical skills in:

- **Full-Stack Development** — End-to-end application from database to UI
- **RESTful API Design** — Clean separation between frontend and backend via JSON APIs
- **Database Design** — Schema design and SQL queries with SQLite
- **Data Visualization** — Interactive charts using Chart.js
- **Responsive Web Design** — Mobile-first CSS layouts
- **File Handling** — Binary (BLOB) storage and base64 encoding of images
- **Version Control** — Git workflow with GitHub

---

## Author

**Rajsv Mahendra**

- GitHub: [@rajsvmahendra](https://github.com/rajsvmahendra)
- Project Repository: [SpendWise](https://github.com/rajsvmahendra/SpendWise)

---

> *Built as a Final Year B.Tech CSE Project · SpendWise © 2026*