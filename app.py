from flask import Flask, request, jsonify, render_template
import sqlite3
import base64

# ---------------------------------------------------------
# SpendWise - Personal Expense Tracker
# Backend: Flask + SQLite
# ---------------------------------------------------------

app = Flask(__name__, template_folder='templates', static_folder='static')
DATABASE = 'budget.db'


# ---------------------------------------------------------
# Database Setup
# ---------------------------------------------------------

def init_db():
    """Create the purchases table if it does not already exist."""
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS purchases (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                business TEXT NOT NULL,
                amount REAL NOT NULL,
                category TEXT NOT NULL,
                description TEXT,
                photo BLOB
            )
        ''')
        conn.commit()


# Initialize the database as soon as the app starts.
init_db()


# ---------------------------------------------------------
# Page Routes (render HTML templates)
# ---------------------------------------------------------

@app.route('/')
def home():
    """Render the dashboard (home) page."""
    return render_template('index.html')


@app.route('/add')
def add_page():
    """Render the Add Expense form page."""
    return render_template('add.html')


@app.route('/recent')
def recent_page():
    """Render the Recent Transactions page."""
    return render_template('recent.html')


@app.route('/monthly')
def monthly_page():
    """Render the Monthly Analytics page."""
    return render_template('monthly.html')


# ---------------------------------------------------------
# API Routes (return JSON)
# ---------------------------------------------------------

@app.route('/api/add', methods=['POST'])
def add_purchase():
    """Save a new purchase to the database."""
    date = request.form.get('date')
    business = request.form.get('business')
    amount = request.form.get('amount')
    category = request.form.get('category')
    description = request.form.get('description')
    photo_file = request.files.get('photo')

    # Convert the uploaded image to binary, if provided.
    photo_blob = photo_file.read() if photo_file else None

    try:
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO purchases
                    (date, business, amount, category, description, photo)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (date, business, amount, category, description, photo_blob))
            conn.commit()
        return jsonify({'success': True})
    except Exception as e:
        print(f"Error adding purchase: {e}")
        return jsonify({'success': False, 'error': str(e)})


@app.route('/api/purchases', methods=['GET'])
def get_purchases():
    """Return all purchases, most recent first."""
    try:
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT date, business, amount, category, description, photo
                FROM purchases
                ORDER BY date DESC
            ''')

            purchases = []
            for row in cursor.fetchall():
                # Convert the photo BLOB to base64 so JS can display it.
                photo_b64 = base64.b64encode(row[5]).decode('utf-8') if row[5] else None
                purchases.append({
                    'date': row[0],
                    'business': row[1],
                    'amount': row[2],
                    'category': row[3],
                    'description': row[4],
                    'photo': photo_b64
                })
        return jsonify(purchases)
    except Exception as e:
        print(f"Error fetching purchases: {e}")
        return jsonify({'error': str(e)})


@app.route('/api/monthly-totals', methods=['GET'])
def get_monthly_totals():
    """
    Return total spending per month.
    Accepts ?sort=ASC or ?sort=DESC (default: DESC).
    """
    # Whitelist sort order to prevent SQL injection.
    sort_by = 'ASC' if request.args.get('sort') == 'ASC' else 'DESC'

    try:
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute(f'''
                SELECT strftime('%Y-%m', date) AS month,
                       SUM(amount) AS total_amount
                FROM purchases
                GROUP BY month
                ORDER BY month {sort_by}
            ''')

            monthly_totals = [
                {'month': row[0], 'total': row[1]}
                for row in cursor.fetchall()
            ]
        return jsonify(monthly_totals)
    except Exception as e:
        print(f"Error fetching monthly totals: {e}")
        return jsonify({'error': str(e)})


@app.route('/api/category-totals', methods=['GET'])
def get_category_totals():
    """
    Return total spending grouped by category.
    If ?month=YYYY-MM is provided, filter to that month only.
    Otherwise, return all-time totals.
    """
    month = request.args.get('month')

    try:
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()

            if month:
                cursor.execute('''
                    SELECT category, SUM(amount) AS category_amount
                    FROM purchases
                    WHERE strftime('%Y-%m', date) = ?
                    GROUP BY category
                    ORDER BY category_amount DESC
                ''', (month,))
            else:
                cursor.execute('''
                    SELECT category, SUM(amount) AS category_amount
                    FROM purchases
                    GROUP BY category
                    ORDER BY category_amount DESC
                ''')

            category_totals = [
                {'category': row[0], 'category_amount': row[1]}
                for row in cursor.fetchall()
            ]
        return jsonify(category_totals)
    except Exception as e:
        print(f"Error fetching category totals: {e}")
        return jsonify({'error': str(e)})


# ---------------------------------------------------------
# Run the App
# ---------------------------------------------------------

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)