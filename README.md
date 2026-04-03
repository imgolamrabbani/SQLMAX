# SQLMAX 🎮 — Gamified SQL Learning

> **Master every SQL query from Database Systems Chapter 3 — by actually writing code.**

**Live Demo →** [Play on GitHub Pages](https://imgolamrabbani.github.io/SQLMAX/)

---

![SQLMAX Banner](assets/images/ui/banner.png)

## What is SQLMAX?

SQLMAX is an in-browser SQL learning game built for students studying **Chapter 3 of Database System Concepts** (Silberschatz, Korth, Sudarshan). Instead of memorizing syntax, you **play through 40+ challenges** across 5 worlds — and every query you write runs against a real SQLite database, right in your browser.

```
Wrong answer?  → Screen shakes. Try again.
Right answer?  → XP gained. Next challenge unlocks.
SELECT *?      → ❌ Rejected. Select only what the task asks for.
```

---

## 🌍 The 5 Worlds

| # | World | Topics Covered |
|---|-------|---------------|
| 1 | 🏪 **The Bazaar** | SELECT, DISTINCT, WHERE, LIKE, BETWEEN, ORDER BY, AS, IS NULL, AND/OR/NOT |
| 2 | 🎓 **UniVerse I** | UNION, INTERSECT, EXCEPT, GROUP BY, HAVING, COUNT DISTINCT, NATURAL JOIN, String ops |
| 3 | 🔬 **Subquery U** | IN, NOT IN, SOME/ALL, EXISTS, NOT EXISTS, Scalar subquery, Subquery in FROM, WITH/CTE |
| 4 | 🔥 **The Forge** | DELETE, INSERT, UPDATE — all with subqueries, CASE expressions, and aggregate tricks |
| 5 | 🏗️ **DDL Workshop** | CREATE TABLE, PRIMARY KEY, FOREIGN KEY, NOT NULL, CHECK, DEFAULT, data types |

---

## ✨ Features

- **Real SQL execution** — powered by [sql.js](https://github.com/sql-js/sql.js/) (SQLite compiled to WebAssembly)
- **Learn-then-Practice** — every challenge has a tutorial card with concept, syntax, and worked example
- **Strict validator** — `SELECT *` fails if only specific columns were asked for; data values are compared, not just row counts
- **Wrong answer feedback** — screen shakes, tells you exactly what's wrong (extra columns? wrong values? wrong row count?)
- **XP & level system** — earn XP, unlock worlds, level up your player title
- **Revisit challenges** — navigate back to any completed sublevel with Prev/Next buttons
- **Fully offline-capable** — once the page loads, no internet needed for gameplay
- **Zero install** — just open `index.html` in a browser (or use GitHub Pages)

---

## 🚀 Play It

### Option A — GitHub Pages ✅ (No setup needed)
Just visit: **[https://imgolamrabbani.github.io/SQLMAX/](https://imgolamrabbani.github.io/SQLMAX/)**

---

### Option B — Run locally
```bash
# 1. Clone the repo
git clone https://github.com/imgolamrabbani/SQLMAX.git
cd SQLMAX

# 2. Start the local server (included in the repo)
python3 serve.py

# Opens automatically at http://localhost:3000/index.html
```

> ⚠️ **Why the local server?** The SQL engine uses WebAssembly (`.wasm`), which browsers block when opened as a raw `file://` URL. The included `serve.py` fixes this with one command. You don't need this on GitHub Pages — it works out of the box there.

---

## 🗂️ Project Structure

```
SQLMAX/
├── index.html              # World map (entry point)
├── game.html               # Challenge / game screen
├── serve.py                # Local dev server (Python 3)
│
├── css/
│   ├── main.css            # Shared design tokens & base styles
│   ├── map.css             # World map styles
│   └── game.css            # Game screen styles
│
├── js/
│   ├── main.js             # App entry: map screen + game screen init
│   ├── game.js             # Game engine: level loading, sublevel flow
│   ├── engine.js           # sql.js wrapper (schema loading + query execution)
│   ├── validator.js        # Strict result-set comparison (runs solution query)
│   ├── editor.js           # CodeMirror setup + real-time shake feedback
│   ├── ui.js               # Toast, tables, XP bar, animations
│   └── progress.js         # localStorage XP & completion tracking
│
├── data/
│   ├── worlds.js           # World metadata + XP unlock thresholds
│   ├── schemas/
│   │   ├── ecommerce.js    # World 1 schema (customers, products, orders)
│   │   ├── university.js   # World 2, 3, 5 schema (textbook university DB)
│   │   └── dml_world.js    # World 4 schema (employees, projects, assignments)
│   └── levels/
│       ├── world1_ecommerce.js   # 9 challenges
│       ├── world2_healthcare.js  # 9 challenges (university schema)
│       ├── world3_university.js  # 11 challenges
│       ├── world4_dml.js         # 9 challenges
│       └── world5_ddl.js         # 6 challenges
│
└── assets/
    ├── fonts/
    ├── images/
    └── sounds/
```

---

## 🔧 How Validation Works

The validator runs **both** queries — yours and the correct solution — against the same database, then compares:

1. **Column names** — exact match required. Extra columns (e.g. from `SELECT *`) fail.
2. **Row count** — must match exactly. Too many or too few rows = fail with a hint.
3. **Data values** — every cell compared, case-insensitive, floats rounded to 2dp.
4. **ORDER BY** — if the solution uses ORDER BY, row order must also match.

```
Player:   SELECT * FROM customers;
Solution: SELECT name, email FROM customers;

Result:   ❌ Too many columns: customer_id, mobile, city, joined_date
          → Select only: name, email — avoid SELECT * unless asked.
```

---

## 🛠️ Tech Stack

| | Tech |
|---|---|
| SQL Engine | [sql.js 1.10.2](https://github.com/sql-js/sql.js/) — SQLite compiled to WASM |
| Editor | [CodeMirror 5](https://codemirror.net/) with SQL syntax highlighting |
| Fonts | Google Fonts (Inter, Rajdhani, Press Start 2P) |
| Styling | Vanilla CSS — no frameworks |
| Storage | `localStorage` for progress (no backend, no account needed) |
| Hosting | GitHub Pages (static, no server required) |

---

## 📖 Content Coverage

Every topic from Chapter 3 of *Database System Concepts* (7th Ed.) is covered:

| Section | Topics |
|---------|--------|
| 3.1–3.2 | SQL overview, DDL — CREATE TABLE, data types, constraints |
| 3.3 | Basic query structure — SELECT, FROM, WHERE |
| 3.4 | Additional ops — AS rename, string ops, ORDER BY |
| 3.5 | Set operations — UNION, INTERSECT, EXCEPT |
| 3.6 | Null values — IS NULL, NULL in aggregates |
| 3.7 | Aggregates — COUNT, SUM, AVG, MAX, MIN, DISTINCT |
| 3.7 | Grouping — GROUP BY, HAVING |
| 3.8 | Nested subqueries — IN, NOT IN, SOME, ALL, EXISTS, NOT EXISTS |
| 3.8 | Subquery in FROM, scalar subquery, UNIQUE |
| 3.8 | WITH clause (CTE) |
| 3.9 | DML — DELETE, INSERT, UPDATE (all with subquery variants) |

---

## 🤝 Contributing

Pull requests welcome! To add a new challenge:

1. Open the relevant `data/levels/worldN_*.js` file
2. Add a new sublevel object following the existing format:
   ```js
   {
     id: 'w1l5s1', title: 'Your Title', badge: '🔵',
     difficulty: 'MEDIUM', xp: 60, concept: 'Topic name',
     schema: 'university',  // ecommerce | university | dml
     tutorial: { concept: '...', syntax: '...', example: { query: '...', note: '...' } },
     narrative: 'Story context...',
     task: 'Task description with <strong>emphasis</strong>.',
     solution: 'SELECT name FROM instructor WHERE dept_name = \'CS\';',
     isDML: false,
     hints: ['Hint 1', 'Hint 2', 'Full solution']
   }
   ```
3. Test it locally with `python3 serve.py`

---

## 📜 License

MIT — free to use, share, and modify.

---

<div align="center">
  Made for students, by a student. Good luck on your CT! 🎓<br>
  <sub>Based on <em>Database System Concepts</em> by Silberschatz, Korth & Sudarshan</sub>
</div>
