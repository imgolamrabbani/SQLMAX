// World 4 — The Forge (DML Practice)
const SCHEMA_DML = `
CREATE TABLE employees (
  emp_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT,
  salary REAL,
  hire_date TEXT,
  city TEXT
);

CREATE TABLE projects (
  project_id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  budget REAL,
  dept TEXT,
  status TEXT
);

CREATE TABLE assignments (
  assign_id INTEGER PRIMARY KEY,
  emp_id INTEGER,
  project_id INTEGER,
  role TEXT,
  hours INTEGER,
  FOREIGN KEY (emp_id) REFERENCES employees(emp_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id)
);

-- Seed data
INSERT INTO employees VALUES (1,  'Alice Johnson', 'Engineering', 75000, '2020-03-15', 'Dhaka');
INSERT INTO employees VALUES (2,  'Bob Smith',     'Marketing',   55000, '2019-07-20', 'Rajshahi');
INSERT INTO employees VALUES (3,  'Carol White',   'Engineering', 82000, '2021-01-10', 'Dhaka');
INSERT INTO employees VALUES (4,  'David Brown',   'HR',          48000, '2018-11-05', 'Chittagong');
INSERT INTO employees VALUES (5,  'Eva Martinez',  'Engineering', 90000, '2022-06-30', 'Dhaka');
INSERT INTO employees VALUES (6,  'Frank Lee',     'Finance',     67000, '2020-09-12', 'Rajshahi');
INSERT INTO employees VALUES (7,  'Grace Kim',     'Marketing',   52000, '2023-02-28', 'Sylhet');
INSERT INTO employees VALUES (8,  'Henry Davis',   'Engineering', 88000, '2017-04-17', 'Dhaka');

INSERT INTO projects VALUES (1, 'AI Platform',     500000, 'Engineering', 'Active');
INSERT INTO projects VALUES (2, 'Market Expansion',200000, 'Marketing',   'Active');
INSERT INTO projects VALUES (3, 'ERP System',      350000, 'Engineering', 'Completed');
INSERT INTO projects VALUES (4, 'HR Portal',       100000, 'HR',          'Active');
INSERT INTO projects VALUES (5, 'Finance Dashboard',150000,'Finance',     'Active');

INSERT INTO assignments VALUES (1, 1, 1, 'Lead Developer', 120);
INSERT INTO assignments VALUES (2, 3, 1, 'Developer',       90);
INSERT INTO assignments VALUES (3, 5, 1, 'Architect',       60);
INSERT INTO assignments VALUES (4, 2, 2, 'Campaign Lead',   80);
INSERT INTO assignments VALUES (5, 7, 2, 'Designer',        50);
INSERT INTO assignments VALUES (6, 8, 3, 'Tech Lead',      200);
INSERT INTO assignments VALUES (7, 4, 4, 'HR Analyst',      70);
INSERT INTO assignments VALUES (8, 6, 5, 'Finance Analyst', 90);
`;
