// World 1 — E-Commerce Schema (The Bazaar)
const SCHEMA_ECOMMERCE = `
CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  mobile TEXT,
  city TEXT,
  join_date TEXT
);

CREATE TABLE products (
  product_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  price REAL NOT NULL,
  stock INTEGER
);

CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  order_date TEXT,
  status TEXT,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE order_items (
  item_id INTEGER PRIMARY KEY,
  order_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,
  unit_price REAL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE payment_methods (
  payment_id INTEGER PRIMARY KEY,
  order_id INTEGER,
  method TEXT,
  card_type TEXT,
  paid_amount REAL,
  paid_date TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- Customers
INSERT INTO customers VALUES (1, 'Ahmed Ali',    'ahmed@mail.com',   '01711-001001', 'Rajshahi', '2022-01-10');
INSERT INTO customers VALUES (2, 'Fatema Begum', 'fatema@mail.com',  '01812-002002', 'Dhaka',    '2021-06-15');
INSERT INTO customers VALUES (3, 'Rahim Uddin',  'rahim@mail.com',   '01911-003003', 'Rajshahi', '2023-03-22');
INSERT INTO customers VALUES (4, 'Nusrat Jahan', 'nusrat@mail.com',  '01611-004004', 'Chittagong','2020-11-01');
INSERT INTO customers VALUES (5, 'Kamal Hossain','kamal@mail.com',   '01511-005005', 'Rajshahi', '2022-08-14');
INSERT INTO customers VALUES (6, 'Salma Khan',   'salma@mail.com',   '01711-006006', 'Sylhet',   '2023-01-05');
INSERT INTO customers VALUES (7, 'Towhid Islam', 'towhid@mail.com',  NULL,           'Rajshahi', '2021-09-30');
INSERT INTO customers VALUES (8, 'Mitu Akter',   'mitu@mail.com',    '01811-008008', 'Khulna',   '2024-02-20');
INSERT INTO customers VALUES (9, 'Zafar Iqbal',  NULL,               '01711-009009', 'Rajshahi', '2022-12-07');
INSERT INTO customers VALUES (10,'Rima Sultana',  'rima@mail.com',   '01611-010010', 'Dhaka',    '2023-07-18');

-- Products
INSERT INTO products VALUES (1,  'Samsung Galaxy A54',    'Electronics', 32000, 50);
INSERT INTO products VALUES (2,  'HP Laptop 15',          'Electronics', 65000, 20);
INSERT INTO products VALUES (3,  'Running Shoes Nike',    'Footwear',    4500,  200);
INSERT INTO products VALUES (4,  'Formal Shirt XL',       'Clothing',    1200,  500);
INSERT INTO products VALUES (5,  'Python Textbook',       'Books',       850,   100);
INSERT INTO products VALUES (6,  'Wireless Headphones',   'Electronics', 3200,  75);
INSERT INTO products VALUES (7,  'Coffee Maker Deluxe',   'Kitchen',     8900,  30);
INSERT INTO products VALUES (8,  'Gaming Mouse RGB',      'Electronics', 2200,  120);
INSERT INTO products VALUES (9,  'Leather Backpack',      'Bags',        3800,  60);
INSERT INTO products VALUES (10, 'Smart Watch Pro',       'Electronics', 15000, 40);
INSERT INTO products VALUES (11, 'USB-C Hub 7-in-1',      'Electronics', 2800,  90);
INSERT INTO products VALUES (12, 'Desk Lamp LED',         'Home',        1500,  150);

-- Orders
INSERT INTO orders VALUES (101, 1, '2025-01-15', 'Delivered');
INSERT INTO orders VALUES (102, 2, '2025-01-20', 'Delivered');
INSERT INTO orders VALUES (103, 3, '2024-10-05', 'Delivered');
INSERT INTO orders VALUES (104, 4, '2025-02-10', 'Processing');
INSERT INTO orders VALUES (105, 5, '2024-09-25', 'Delivered');
INSERT INTO orders VALUES (106, 1, '2025-03-01', 'Delivered');
INSERT INTO orders VALUES (107, 6, '2025-03-15', 'Shipped');
INSERT INTO orders VALUES (108, 7, '2024-11-11', 'Delivered');
INSERT INTO orders VALUES (109, 2, '2023-12-20', 'Delivered');
INSERT INTO orders VALUES (110, 3, '2025-01-05', 'Cancelled');
INSERT INTO orders VALUES (111, 8, '2025-03-20', 'Delivered');
INSERT INTO orders VALUES (112, 9, '2024-08-30', 'Delivered');

-- Order Items (order 108 gets 25 distinct items to test > 20)
INSERT INTO order_items VALUES (1, 101, 1,  2, 32000);
INSERT INTO order_items VALUES (2, 101, 6,  1, 3200);
INSERT INTO order_items VALUES (3, 102, 2,  1, 65000);
INSERT INTO order_items VALUES (4, 103, 3,  3, 4500);
INSERT INTO order_items VALUES (5, 103, 4,  5, 1200);
INSERT INTO order_items VALUES (6, 104, 10, 1, 15000);
INSERT INTO order_items VALUES (7, 105, 5,  2, 850);
INSERT INTO order_items VALUES (8, 106, 8,  1, 2200);
INSERT INTO order_items VALUES (9, 106, 11, 2, 2800);
INSERT INTO order_items VALUES (10,107, 9,  1, 3800);
INSERT INTO order_items VALUES (11,108, 1,  1, 32000);
INSERT INTO order_items VALUES (12,108, 2,  1, 65000);
INSERT INTO order_items VALUES (13,108, 3,  1, 4500);
INSERT INTO order_items VALUES (14,108, 4,  1, 1200);
INSERT INTO order_items VALUES (15,108, 5,  1, 850);
INSERT INTO order_items VALUES (16,108, 6,  1, 3200);
INSERT INTO order_items VALUES (17,108, 7,  1, 8900);
INSERT INTO order_items VALUES (18,108, 8,  1, 2200);
INSERT INTO order_items VALUES (19,108, 9,  1, 3800);
INSERT INTO order_items VALUES (20,108, 10, 1, 15000);
INSERT INTO order_items VALUES (21,108, 11, 1, 2800);
INSERT INTO order_items VALUES (22,108, 12, 1, 1500);
INSERT INTO order_items VALUES (23,109, 3,  2, 4500);
INSERT INTO order_items VALUES (24,110, 7,  1, 8900);
INSERT INTO order_items VALUES (25,111, 12, 3, 1500);
INSERT INTO order_items VALUES (26,112, 6,  2, 3200);

-- Payment Methods
INSERT INTO payment_methods VALUES (1,  101, 'Card', 'Visa',       67200, '2025-01-15');
INSERT INTO payment_methods VALUES (2,  102, 'Card', 'Mastercard', 65000, '2025-01-20');
INSERT INTO payment_methods VALUES (3,  103, 'Cash', NULL,         19500, '2024-10-05');
INSERT INTO payment_methods VALUES (4,  104, 'Card', 'Visa',       15000, '2025-02-10');
INSERT INTO payment_methods VALUES (5,  105, 'bKash',NULL,         1700,  '2024-09-25');
INSERT INTO payment_methods VALUES (6,  106, 'Card', 'Visa',        7000, '2025-03-01');
INSERT INTO payment_methods VALUES (7,  107, 'Card', 'Amex',        3800, '2025-03-15');
INSERT INTO payment_methods VALUES (8,  108, 'Card', 'Visa',      144150, '2024-11-11');
INSERT INTO payment_methods VALUES (9,  109, 'Card', 'Mastercard',  9000, '2023-12-20');
INSERT INTO payment_methods VALUES (10, 111, 'Cash', NULL,          4500, '2025-03-20');
INSERT INTO payment_methods VALUES (11, 112, 'Card', 'Visa',        6400, '2024-08-30');
`;
