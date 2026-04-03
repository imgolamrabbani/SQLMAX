// World 4 — The Forge (DML schema — employees/projects/assignments)
// Topics: INSERT, DELETE, UPDATE, UPDATE+CASE, UPDATE+scalar subquery
// isDML:true → validator checks that the final SELECT returns rows (DML modified state)
const WORLD4_LEVELS = [
  // ── LEVEL 1: DELETE ──────────────────────────────────────────────────
  {
    id: 'w4l1', title: 'DELETE Chamber', icon: '🗑️', xpReward: 180,
    sublevels: [
      {
        id: 'w4l1s1', title: 'DELETE FROM … WHERE', badge: '🔴',
        difficulty: 'MEDIUM', xp: 65, concept: 'DELETE',
        schema: 'dml',
        tutorial: {
          concept: 'DELETE removes rows. ALWAYS use WHERE — without it, ALL rows are deleted. SQL evaluates the full WHERE before deleting any row. You cannot undo a DELETE without a transaction.',
          syntax: "-- Remove specific rows:\nDELETE FROM table\nWHERE condition;\n\n-- ⚠️ This deletes EVERYTHING:\nDELETE FROM table;\n\n-- Preview first:\nSELECT * FROM table WHERE condition;",
          example: { query: "DELETE FROM instructor\nWHERE dept_name = 'Finance';", note: 'All Finance instructors are removed. Run a SELECT with the same WHERE first to preview what will be deleted.' }
        },
        narrative: 'A project was cancelled — remove it from the system.',
        task: "DELETE from projects where <strong>status = 'Completed'</strong>. Then run <strong>SELECT * FROM projects</strong> to confirm.",
        solution: "DELETE FROM projects WHERE status='Completed'; SELECT * FROM projects;",
        isDML: true,
        hints: ["DELETE FROM projects WHERE status = 'Completed';", 'Follow with SELECT * FROM projects;', "DELETE FROM projects WHERE status='Completed'; SELECT * FROM projects;"]
      },
      {
        id: 'w4l1s2', title: 'DELETE with Subquery', badge: '🔴',
        difficulty: 'HARD', xp: 80, concept: 'DELETE + subquery in WHERE',
        schema: 'dml',
        tutorial: {
          concept: 'DELETE can use a subquery in WHERE. SQL evaluates the full subquery FIRST, computes the set, then deletes. This prevents problems when the subquery references the same table (e.g., deleting below-average rows).',
          syntax: "DELETE FROM table\nWHERE col IN (\n  SELECT col FROM other WHERE cond\n);\n\n-- Safe even when referencing same table:\nDELETE FROM instructor\nWHERE salary < (\n  SELECT AVG(salary) FROM instructor\n  -- AVG computed first, THEN delete\n);",
          example: { query: "DELETE FROM instructor\nWHERE dept_name IN (\n  SELECT dept_name FROM department\n  WHERE building = 'Watson'\n);", note: 'The subquery finds dept names in Watson. Then all instructors in those depts are deleted.' }
        },
        narrative: 'Remove all assignments for employees from the HR department.',
        task: "DELETE from <strong>assignments</strong> where emp_id IN (SELECT emp_id FROM employees WHERE department = 'HR'). Then SELECT * FROM assignments.",
        solution: "DELETE FROM assignments WHERE emp_id IN (SELECT emp_id FROM employees WHERE department='HR'); SELECT * FROM assignments;",
        isDML: true,
        hints: ["DELETE FROM assignments WHERE emp_id IN (subquery)", "Subquery: SELECT emp_id FROM employees WHERE department='HR'", "DELETE FROM assignments WHERE emp_id IN (SELECT emp_id FROM employees WHERE department='HR'); SELECT * FROM assignments;"]
      },
      {
        id: 'w4l1s3', title: 'DELETE: salary subquery', badge: '🔴',
        difficulty: 'HARD', xp: 85, concept: 'DELETE with aggregate subquery',
        schema: 'dml',
        tutorial: {
          concept: 'A classic exam question: delete rows where a value falls below the average. Because SQL evaluates the AVG subquery BEFORE any deletion, the average is not affected by the deletions mid-way.',
          syntax: "DELETE FROM table\nWHERE col < (\n  SELECT AVG(col) FROM table\n);\n-- AVG is computed completely first,\n-- THEN all qualifying rows are deleted at once.",
          example: { query: "DELETE FROM instructor\nWHERE salary < (\n  SELECT AVG(salary) FROM instructor\n);", note: 'In the textbook example, the AVG is computed over the original table. Then all below-average rows are deleted simultaneously.' }
        },
        narrative: 'Layoffs: remove employees earning below the company average salary.',
        task: "DELETE from employees where salary < (SELECT AVG(salary) FROM employees). Then SELECT name, salary FROM employees ORDER BY salary.",
        solution: "DELETE FROM employees WHERE salary < (SELECT AVG(salary) FROM employees); SELECT name, salary FROM employees ORDER BY salary;",
        isDML: true,
        hints: ['Use a scalar subquery: salary < (SELECT AVG(salary) FROM employees)', 'The AVG is computed BEFORE the delete.', "DELETE FROM employees WHERE salary < (SELECT AVG(salary) FROM employees); SELECT name, salary FROM employees ORDER BY salary;"]
      }
    ]
  },

  // ── LEVEL 2: INSERT ───────────────────────────────────────────────────
  {
    id: 'w4l2', title: 'INSERT Forge', icon: '⚒️', xpReward: 180,
    sublevels: [
      {
        id: 'w4l2s1', title: 'INSERT INTO … VALUES', badge: '🔵',
        difficulty: 'MEDIUM', xp: 60, concept: 'INSERT',
        schema: 'dml',
        tutorial: {
          concept: 'INSERT adds a new row. Named form (preferred): column names then values — safer because order does not matter. Shorthand form must match ALL columns in definition order.',
          syntax: "-- Named form (safe):\nINSERT INTO table (col1, col2, col3)\nVALUES (val1, val2, val3);\n\n-- Shorthand (all columns, in order):\nINSERT INTO table\nVALUES (val1, val2, val3);\n\n-- Insert from SELECT:\nINSERT INTO t1 SELECT ... FROM t2;",
          example: { query: "INSERT INTO course (course_id, title, dept_name, credits)\nVALUES ('CS-437', 'Database Systems', 'Comp. Sci.', 4);", note: 'Named form: even if columns are reordered later, this INSERT still works correctly.' }
        },
        narrative: 'A new project is starting — add it to the database.',
        task: "INSERT into projects: (9, 'Data Lake', 400000, 'Engineering', 'Active'). Then SELECT * FROM projects WHERE project_id = 9.",
        solution: "INSERT INTO projects VALUES (9, 'Data Lake', 400000, 'Engineering', 'Active'); SELECT * FROM projects WHERE project_id = 9;",
        isDML: true,
        hints: ['Use INSERT INTO projects VALUES (...)', 'All 5 columns: id, title, budget, dept, status.', "INSERT INTO projects VALUES (9, 'Data Lake', 400000, 'Engineering', 'Active'); SELECT * FROM projects WHERE project_id = 9;"]
      },
      {
        id: 'w4l2s2', title: 'INSERT … SELECT', badge: '🟠',
        difficulty: 'HARD', xp: 80, concept: 'INSERT from SELECT',
        schema: 'dml',
        tutorial: {
          concept: 'INSERT … SELECT inserts all rows returned by a SELECT. The SELECT runs completely first, then all results are inserted at once. Useful to copy or migrate rows.',
          syntax: "INSERT INTO target_table (col1, col2)\nSELECT col_a, col_b\nFROM source_table\nWHERE condition;\n\n-- Safe even when source = target:",
          example: { query: "INSERT INTO instructor\n  SELECT ID, name, dept_name, 18000\n  FROM student\n  WHERE dept_name='Music'\n    AND tot_cred > 144;", note: 'Promotes eligible Music students to instructors. The SELECT runs fully before any insert.' }
        },
        narrative: 'Add a new assignment for every Engineering employee on project 1.',
        task: "Run: SELECT emp_id FROM employees WHERE department='Engineering' — first check. Then INSERT INTO assignments SELECT (90+emp_id), emp_id, 1, 'Contributor', 40 FROM employees WHERE department='Engineering'. Then SELECT * FROM assignments WHERE project_id=1.",
        solution: "INSERT INTO assignments (assign_id, emp_id, project_id, role, hours) SELECT (90+emp_id), emp_id, 1, 'Contributor', 40 FROM employees WHERE department='Engineering'; SELECT * FROM assignments WHERE project_id=1;",
        isDML: true,
        hints: ["INSERT INTO assignments (...) SELECT ... FROM employees WHERE department='Engineering'", 'Use 90+emp_id to create unique assign_ids.', "INSERT INTO assignments (assign_id, emp_id, project_id, role, hours) SELECT (90+emp_id), emp_id, 1, 'Contributor', 40 FROM employees WHERE department='Engineering'; SELECT * FROM assignments WHERE project_id=1;"]
      }
    ]
  },

  // ── LEVEL 3: UPDATE ───────────────────────────────────────────────────
  {
    id: 'w4l3', title: 'UPDATE Chambers', icon: '✏️', xpReward: 200,
    sublevels: [
      {
        id: 'w4l3s1', title: 'UPDATE … SET … WHERE', badge: '🟡',
        difficulty: 'MEDIUM', xp: 65, concept: 'UPDATE',
        schema: 'dml',
        tutorial: {
          concept: 'UPDATE changes existing column values. SET defines what changes; WHERE limits which rows change. Without WHERE, ALL rows are updated. You can reference the current value in SET (e.g., salary * 1.05).',
          syntax: "UPDATE table\nSET col1 = new_val,\n    col2 = expression\nWHERE condition;\n\n-- No WHERE → updates every row!",
          example: { query: "UPDATE instructor\nSET salary = salary * 1.05\nWHERE salary < 70000;", note: 'Gives 5% raise only to instructors earning under 70000. salary on the right is the OLD value.' }
        },
        narrative: 'Give Engineering employees a 10% raise.',
        task: "UPDATE employees SET salary = salary * 1.10 WHERE department = 'Engineering'. Then SELECT name, salary FROM employees WHERE department='Engineering'.",
        solution: "UPDATE employees SET salary = salary * 1.10 WHERE department='Engineering'; SELECT name, salary FROM employees WHERE department='Engineering';",
        isDML: true,
        hints: ["SET salary = salary * 1.10", "WHERE department = 'Engineering'", "UPDATE employees SET salary = salary * 1.10 WHERE department='Engineering'; SELECT name, salary FROM employees WHERE department='Engineering';"]
      },
      {
        id: 'w4l3s2', title: 'UPDATE with CASE', badge: '⭐',
        difficulty: 'HARD', xp: 85, concept: 'UPDATE + CASE expression',
        schema: 'dml',
        tutorial: {
          concept: 'Use CASE inside SET to apply different changes to different rows in ONE statement. Without CASE you would need two UPDATE statements, and ordering issues could cause wrong results (a row gets both updates).',
          syntax: "UPDATE table\nSET col = CASE\n  WHEN cond1 THEN val1\n  WHEN cond2 THEN val2\n  ELSE default_val\nEND\nWHERE optional_filter;",
          example: { query: "UPDATE instructor\nSET salary = CASE\n  WHEN salary > 100000 THEN salary * 1.03\n  ELSE salary * 1.05\nEND;", note: 'All rows updated in one shot. No row can accidentally receive both raises.' }
        },
        narrative: 'Conditional raise: high earners (>70000) get 3%, others get 8%.',
        task: 'UPDATE employees SET salary = CASE WHEN salary > 70000 THEN salary*1.03 ELSE salary*1.08 END. Then SELECT name, department, salary FROM employees ORDER BY salary DESC.',
        solution: 'UPDATE employees SET salary = CASE WHEN salary > 70000 THEN salary*1.03 ELSE salary*1.08 END; SELECT name, department, salary FROM employees ORDER BY salary DESC;',
        isDML: true,
        hints: ['CASE goes after the = in SET.', 'WHEN salary > 70000 THEN ... ELSE ... END', 'UPDATE employees SET salary = CASE WHEN salary > 70000 THEN salary*1.03 ELSE salary*1.08 END; SELECT name, department, salary FROM employees ORDER BY salary DESC;']
      },
      {
        id: 'w4l3s3', title: 'UPDATE with scalar subquery', badge: '🔴',
        difficulty: 'HARD', xp: 90, concept: 'UPDATE SET with scalar subquery',
        schema: 'dml',
        tutorial: {
          concept: 'SET can use a scalar subquery as the new value. This lets you update a column to a computed value from another table. Like DELETE, the subquery is evaluated first.',
          syntax: "UPDATE table\nSET col = (\n  SELECT aggregate\n  FROM other_table\n  WHERE condition\n)\nWHERE other_condition;",
          example: { query: "UPDATE student\nSET tot_cred = (\n  SELECT SUM(credits)\n  FROM takes NATURAL JOIN course\n  WHERE takes.ID = student.ID\n    AND grade <> 'F'\n    AND grade IS NOT NULL\n);", note: 'Updates each student\'s tot_cred to the sum of credits for courses they passed.' }
        },
        narrative: 'Set each project\'s budget to the total hours worked on it × 100.',
        task: "UPDATE projects SET budget = (SELECT SUM(hours) * 100 FROM assignments WHERE assignments.project_id = projects.project_id). Then SELECT title, budget FROM projects ORDER BY budget DESC.",
        solution: "UPDATE projects SET budget = (SELECT SUM(hours)*100 FROM assignments WHERE assignments.project_id = projects.project_id); SELECT title, budget FROM projects ORDER BY budget DESC;",
        isDML: true,
        hints: ['The scalar subquery in SET references projects.project_id — correlated!', 'SUM(hours)*100 gives the new budget.', "UPDATE projects SET budget = (SELECT SUM(hours)*100 FROM assignments WHERE assignments.project_id = projects.project_id); SELECT title, budget FROM projects ORDER BY budget DESC;"]
      }
    ]
  },

  // ── BOSS: Full DML sequence ───────────────────────────────────────────
  {
    id: 'w4l4', title: '⚔️ Boss: DML Gauntlet', icon: '👑', isBoss: true, xpReward: 300,
    sublevels: [
      {
        id: 'w4l4s1', title: 'INSERT + UPDATE + DELETE', badge: '👑',
        difficulty: 'HARD', xp: 150, concept: 'All DML in sequence',
        schema: 'dml',
        tutorial: {
          concept: 'Real DML often chains all three operations. Remember: (1) DELETE subquery evaluates average BEFORE any deletion; (2) ORDER of two UPDATE statements matters if rows could cross the threshold — use CASE to be safe.',
          syntax: "-- Safe sequence:\nINSERT ...;\nUPDATE ... SET ... CASE ...;\nDELETE ... WHERE col IN (subquery);\nSELECT * ...; -- always verify!",
          example: { query: "-- 1. Add new row\nINSERT INTO employees VALUES (9,'Nia','Finance',50000,'2024-01-01','Dhaka');\n-- 2. Raise everyone in Finance\nUPDATE employees SET salary=salary*1.10\n  WHERE department='Finance';\n-- 3. Remove inactive project\nDELETE FROM projects WHERE status='Completed';\n-- 4. Verify\nSELECT * FROM employees WHERE department='Finance' ORDER BY salary;", note: 'Each step modifies state. The final SELECT confirms the current state.' }
        },
        narrative: '⚔️ BOSS ROUND — three DML steps in sequence. Show you can chain it all.',
        task: "Step 1: INSERT into employees: (10,'Sam','Marketing',53000,'2024-01-01','Dhaka'). Step 2: UPDATE employees SET salary=salary*1.15 WHERE salary < (SELECT AVG(salary) FROM employees). Step 3: DELETE FROM assignments WHERE hours < 70. Step 4: SELECT name, department, salary FROM employees ORDER BY salary DESC.",
        solution: "INSERT INTO employees VALUES (10,'Sam','Marketing',53000,'2024-01-01','Dhaka'); UPDATE employees SET salary=salary*1.15 WHERE salary < (SELECT AVG(salary) FROM employees); DELETE FROM assignments WHERE hours < 70; SELECT name, department, salary FROM employees ORDER BY salary DESC;",
        isDML: true,
        hints: ['Run all four statements in order.', 'The UPDATE uses salary < (SELECT AVG from employees) — AVG computed first.', "INSERT INTO employees VALUES (10,'Sam','Marketing',53000,'2024-01-01','Dhaka'); UPDATE employees SET salary=salary*1.15 WHERE salary < (SELECT AVG(salary) FROM employees); DELETE FROM assignments WHERE hours < 70; SELECT name, department, salary FROM employees ORDER BY salary DESC;"]
      }
    ]
  }
];
