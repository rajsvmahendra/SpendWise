# SpendWise 💰

**Track Smarter. Spend Better.**

SpendWise is a personal expense tracking web application built as a final year Computer Science Engineering project. It helps users record, categorize, analyze, and visualize their daily expenses through an intuitive, modern interface.

---

## 📋 Table of Contents

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

The project demonstrates full-stack web development using Python Flask for the backend, SQLite for data storage, and vanilla HTML/CSS/JavaScript for the frontend.

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

- **Flask** — Lightweight Python web framework, easy to learn and explain
- **SQLite** — Zero-configuration database, no separate server needed, perfect for single-user apps
- **Vanilla JS** — No framework dependency, demonstrates core JavaScript skills
- **Chart.js** — Simple yet powerful charting library with excellent documentation

---

## Project Structure
SpendWise/
│
├── app.py # Flask backend (routes + API + database)
├── budget.db # SQLite database (auto-created on first run)
├── requirements.txt # Python dependencies
├── README.md # Project documentation
│
├── static/
│ ├── styles.css # Complete CSS design system
│ ├── script.js # Frontend logic (fetch, charts, DOM)
│ └── images/
│ ├── logo.png # SpendWise logo
│ └── favicon.ico # Browser tab icon
│
└── templates/
├── base.html # Base template (header, nav, footer)
├── index.html # Dashboard page
├── add.html # Add Expense form page
├── monthly.html # Analytics page
└── recent.html # Transactions page

text


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
   git clone https://github.com/yourusername/SpendWise.git
   cd SpendWise
Install dependencies

Bash

pip install flask
Run the application

Bash

python app.py
Open in browser

text

http://localhost:5000
The database (budget.db) is created automatically on first run.

Usage
Add Expense — Click "Add Expense" in the navigation, fill in the form, select a category, and submit
View Dashboard — Click "Dashboard" to see stat cards, monthly spending bar chart, and category doughnut chart
Analyze Trends — Click "Analytics" to see your highest month, top category, category breakdown bars, and per-month pie charts
Browse Transactions — Click "Transactions" to search, filter by category, and view all recorded expenses
