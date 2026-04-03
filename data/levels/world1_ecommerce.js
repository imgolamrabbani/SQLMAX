// World 1 — The Bazaar (E-Commerce) → SELECT, WHERE, LIKE, BETWEEN, ORDER BY, Joins, AS, NULL
// Uses SCHEMA_ECOMMERCE. All solution queries run against that schema.
const WORLD1_LEVELS = [
  // ── LEVEL 1: Basic SELECT ────────────────────────────────────────────
  {
    id: 'w1l1', title: 'The Basics', icon: '🏙️', xpReward: 120,
    sublevels: [
      {
        id: 'w1l1s1', title: 'SELECT & FROM', badge: '🟢',
        difficulty: 'EASY', xp: 30, concept: 'SELECT … FROM',
        schema: 'ecommerce',
        tutorial: {
          concept: 'SELECT picks which columns to show. FROM says which table. Use * to get all columns. SQL is case-insensitive — SELECT and select are the same.',
          syntax: 'SELECT column1, column2\nFROM table_name;\n\n-- All columns:\nSELECT *\nFROM table_name;',
          example: { query: "SELECT name, city\nFROM customers;", note: 'Returns just name and city — not mobile or customer_id.' }
        },
        narrative: 'Welcome to The Bazaar! Pull a customer list for the manager.',
        task: 'Show the <strong>name</strong> and <strong>email</strong> of all customers.',
        solution: 'SELECT name, email FROM customers;',
        isDML: false,
        hints: ['Use SELECT to pick columns, FROM to say which table.', 'The table is called customers.', 'SELECT name, email FROM customers;']
      },
      {
        id: 'w1l1s2', title: 'SELECT DISTINCT', badge: '🔵',
        difficulty: 'EASY', xp: 35, concept: 'SELECT DISTINCT',
        schema: 'ecommerce',
        tutorial: {
          concept: 'DISTINCT removes duplicate rows from results. Without it, if 50 customers are from "Dhaka", you see "Dhaka" 50 times. With DISTINCT, just once.',
          syntax: 'SELECT DISTINCT column\nFROM table_name;',
          example: { query: "SELECT DISTINCT city\nFROM customers;", note: 'Each city appears only once, no matter how many customers are there.' }
        },
        narrative: 'Get a unique list of product categories — no repeats!',
        task: 'Show the unique <strong>category</strong> values from products.',
        solution: 'SELECT DISTINCT category FROM products;',
        isDML: false,
        hints: ['Add DISTINCT after SELECT.', 'Table is products, column is category.', 'SELECT DISTINCT category FROM products;']
      },
      {
        id: 'w1l1s3', title: 'WHERE Clause', badge: '🟡',
        difficulty: 'EASY', xp: 40, concept: 'WHERE',
        schema: 'ecommerce',
        tutorial: {
          concept: 'WHERE filters rows. Only rows where the condition is TRUE are returned. Use single quotes for text values. Operators: =, >, <, >=, <=, <> (not equal).',
          syntax: "SELECT col1, col2\nFROM table\nWHERE condition;\n\n-- Examples:\nWHERE city = 'Dhaka'\nWHERE price > 500\nWHERE price <> 0",
          example: { query: "SELECT name, city\nFROM customers\nWHERE city = 'Dhaka';", note: "String values need single quotes. The = operator is for equality." }
        },
        narrative: 'Find customers from "Dhaka".',
        task: "Show <strong>name</strong> and <strong>city</strong> of customers where city = <strong>'Dhaka'</strong>.",
        solution: "SELECT name, city FROM customers WHERE city = 'Dhaka';",
        isDML: false,
        hints: ["Strings need single quotes: city = 'Dhaka'", 'Use WHERE after FROM.', "SELECT name, city FROM customers WHERE city = 'Dhaka';"]
      }
    ]
  },

  // ── LEVEL 2: LIKE, BETWEEN, ORDER BY ─────────────────────────────────
  {
    id: 'w1l2', title: 'Pattern & Sort', icon: '🔍', xpReward: 150,
    sublevels: [
      {
        id: 'w1l2s1', title: 'LIKE', badge: '🟠',
        difficulty: 'MEDIUM', xp: 50, concept: 'LIKE pattern matching',
        schema: 'ecommerce',
        tutorial: {
          concept: 'LIKE matches text patterns. % = any number of characters. _ = exactly one character. Case-insensitive in most databases.',
          syntax: "WHERE name LIKE 'A%'     -- starts with A\nWHERE name LIKE '%son'   -- ends with son\nWHERE name LIKE '%dar%'  -- contains dar\nWHERE name LIKE '_a%'    -- 2nd char is a",
          example: { query: "SELECT name FROM customers\nWHERE name LIKE 'Ra%';", note: "Finds all customers with name starting with 'Ra'." }
        },
        narrative: 'Find products whose name starts with "Phone".',
        task: "Show <strong>name</strong> and <strong>price</strong> of products where name LIKE <strong>'Phone%'</strong>.",
        solution: "SELECT name, price FROM products WHERE name LIKE 'Phone%';",
        isDML: false,
        hints: ["% matches any characters after 'Phone'.", "Use LIKE 'Phone%'", "SELECT name, price FROM products WHERE name LIKE 'Phone%';"]
      },
      {
        id: 'w1l2s2', title: 'BETWEEN', badge: '🔵',
        difficulty: 'EASY', xp: 45, concept: 'BETWEEN … AND',
        schema: 'ecommerce',
        tutorial: {
          concept: 'BETWEEN is shorthand for >= AND <=. Both boundaries are INCLUDED.',
          syntax: 'WHERE col BETWEEN low AND high\n\n-- Same as:\nWHERE col >= low AND col <= high',
          example: { query: 'SELECT name, price FROM products\nWHERE price BETWEEN 500 AND 2000;', note: 'Products priced at exactly 500 or 2000 ARE included.' }
        },
        narrative: 'Show mid-range products priced between 500 and 2000.',
        task: 'Show <strong>name</strong> and <strong>price</strong> of products priced between <strong>500</strong> and <strong>2000</strong>.',
        solution: 'SELECT name, price FROM products WHERE price BETWEEN 500 AND 2000;',
        isDML: false,
        hints: ['BETWEEN is inclusive.', 'Products table, columns name and price.', 'SELECT name, price FROM products WHERE price BETWEEN 500 AND 2000;']
      },
      {
        id: 'w1l2s3', title: 'ORDER BY', badge: '🟣',
        difficulty: 'EASY', xp: 40, concept: 'ORDER BY ASC / DESC',
        schema: 'ecommerce',
        tutorial: {
          concept: 'ORDER BY sorts results. Default is ASC (A→Z, 0→9). DESC reverses it. Multiple columns: first sort wins, second breaks ties.',
          syntax: 'SELECT col1, col2\nFROM table\nORDER BY col1 ASC;    -- or DESC\n\n-- Multi-column sort:\nORDER BY col1 DESC, col2 ASC;',
          example: { query: 'SELECT name, price FROM products\nORDER BY price DESC;', note: 'Most expensive first.' }
        },
        narrative: 'Print a price list — cheapest first.',
        task: 'Show <strong>name</strong> and <strong>price</strong> sorted by price <strong>ASC</strong>.',
        solution: 'SELECT name, price FROM products ORDER BY price ASC;',
        isDML: false,
        hints: ['ORDER BY goes after FROM (and after WHERE if there is one).', 'ASC = ascending = lowest first.', 'SELECT name, price FROM products ORDER BY price ASC;']
      }
    ]
  },

  // ── LEVEL 3: Joins & AS ───────────────────────────────────────────────
  {
    id: 'w1l3', title: 'The Join Dojo', icon: '🔗', xpReward: 180,
    sublevels: [
      {
        id: 'w1l3s1', title: 'Joining Two Tables', badge: '🔴',
        difficulty: 'MEDIUM', xp: 60, concept: 'JOIN (comma + WHERE)',
        schema: 'ecommerce',
        tutorial: {
          concept: 'Join combines rows from two tables by matching a common column. List both tables in FROM separated by comma, then match them in WHERE. Without the match condition you get a cartesian product (every row × every row).',
          syntax: "SELECT t1.col, t2.col\nFROM table1 t1, table2 t2\nWHERE t1.common_id = t2.common_id;",
          example: { query: "SELECT customers.name, orders.order_id\nFROM customers, orders\nWHERE customers.customer_id = orders.customer_id;", note: 'Each order is paired with the customer who placed it.' }
        },
        narrative: 'Which customer placed which order?',
        task: 'Show customer <strong>name</strong> and <strong>order_id</strong> by joining customers and orders on customer_id.',
        solution: 'SELECT customers.name, orders.order_id FROM customers, orders WHERE customers.customer_id = orders.customer_id;',
        isDML: false,
        hints: ['List both tables in FROM with a comma.', 'Match on customer_id in WHERE.', 'SELECT customers.name, orders.order_id FROM customers, orders WHERE customers.customer_id = orders.customer_id;']
      },
      {
        id: 'w1l3s2', title: 'AS — Column Rename', badge: '🟡',
        difficulty: 'MEDIUM', xp: 55, concept: 'AS rename operator',
        schema: 'ecommerce',
        tutorial: {
          concept: 'AS renames a column in the output. It is purely cosmetic — the table itself is unchanged. Useful for labelling calculated expressions.',
          syntax: "SELECT salary/12 AS monthly_salary\nFROM instructor;\n\n-- Table alias (shorthand):\nFROM instructor AS T",
          example: { query: "SELECT name, price/12 AS monthly_price\nFROM products;", note: 'The output column header becomes monthly_price instead of price/12.' }
        },
        narrative: 'Show monthly pricing for all products.',
        task: 'Show product <strong>name</strong> and <strong>price/12</strong> renamed as <strong>monthly_price</strong>.',
        solution: 'SELECT name, price/12 AS monthly_price FROM products;',
        isDML: false,
        hints: ['Use price/12 AS monthly_price in SELECT.', 'No WHERE needed.', 'SELECT name, price/12 AS monthly_price FROM products;']
      },
      {
        id: 'w1l3s3', title: 'NULL Values', badge: '⚫',
        difficulty: 'MEDIUM', xp: 55, concept: 'IS NULL / IS NOT NULL',
        schema: 'ecommerce',
        tutorial: {
          concept: 'NULL means "unknown" or "missing". Never use = NULL — it always returns nothing. Use IS NULL or IS NOT NULL. Any arithmetic with NULL gives NULL.',
          syntax: 'WHERE col IS NULL\nWHERE col IS NOT NULL\n\n-- WRONG (never!):\nWHERE col = NULL  ❌',
          example: { query: 'SELECT name FROM products\nWHERE stock IS NULL;', note: '"WHERE stock = NULL" always returns 0 rows — a classic SQL bug.' }
        },
        narrative: 'Find products with no stock recorded.',
        task: 'Show <strong>name</strong> of products where <strong>stock IS NULL</strong>.',
        solution: 'SELECT name FROM products WHERE stock IS NULL;',
        isDML: false,
        hints: ['Never use = NULL. Always IS NULL.', 'Table is products.', 'SELECT name FROM products WHERE stock IS NULL;']
      }
    ]
  },

  // ── LEVEL 4: AND / OR / NOT (lecture page on boolean WHERE) ──────────
  {
    id: 'w1l4', title: 'Boolean Logic', icon: '⚡', xpReward: 160,
    sublevels: [
      {
        id: 'w1l4s1', title: 'AND / OR / NOT', badge: '🟠',
        difficulty: 'MEDIUM', xp: 55, concept: 'AND, OR, NOT in WHERE',
        schema: 'ecommerce',
        tutorial: {
          concept: 'AND requires both conditions to be true. OR requires at least one. NOT inverts a condition. Precedence: NOT > AND > OR. Use parentheses when mixing OR and AND.',
          syntax: "WHERE cond1 AND cond2\nWHERE cond1 OR cond2\nWHERE NOT cond1\n\n-- Parentheses beat precedence:\nWHERE (cond1 OR cond2) AND cond3",
          example: { query: "SELECT name FROM customers\nWHERE city = 'Dhaka' AND name LIKE 'M%';", note: 'Both conditions must be true — city is Dhaka AND name begins with M.' }
        },
        narrative: 'Find expensive Electronics or Clothing products.',
        task: 'Show <strong>name</strong>, <strong>price</strong>, <strong>category</strong> of products where <strong>(category = \'Electronics\' OR category = \'Clothing\')</strong> AND price > <strong>1000</strong>.',
        solution: "SELECT name, price, category FROM products WHERE (category = 'Electronics' OR category = 'Clothing') AND price > 1000;",
        isDML: false,
        hints: ['Use parentheses around the OR conditions.', 'AND binds tighter than OR by default.', "SELECT name, price, category FROM products WHERE (category = 'Electronics' OR category = 'Clothing') AND price > 1000;"]
      },
      {
        id: 'w1l4s2', title: 'multi-column ORDER BY', badge: '🟣',
        difficulty: 'MEDIUM', xp: 50, concept: 'ORDER BY with multiple columns',
        schema: 'ecommerce',
        tutorial: {
          concept: 'Multiple ORDER BY columns: first column sorts first, second column breaks ties in the first. Each can be ASC or DESC independently.',
          syntax: "SELECT col1, col2, col3\nFROM table\nORDER BY col1 ASC, col2 DESC;",
          example: { query: "SELECT name, dept_name, salary\nFROM instructor\nORDER BY dept_name ASC, salary DESC;", note: 'Within each department (ASC), instructors are sorted highest salary first (DESC).' }
        },
        narrative: "Sort products by category (A→Z), then by price (highest first) within each category.",
        task: 'Show <strong>name</strong>, <strong>category</strong>, <strong>price</strong> from products, ORDER BY category ASC, price DESC.',
        solution: 'SELECT name, category, price FROM products ORDER BY category ASC, price DESC;',
        isDML: false,
        hints: ['Two ORDER BY columns separated by comma.', 'category ASC first, then price DESC.', 'SELECT name, category, price FROM products ORDER BY category ASC, price DESC;']
      }
    ]
  }
];
