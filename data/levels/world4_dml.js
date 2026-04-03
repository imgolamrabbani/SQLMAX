// World 4 — The Forge (DML — employees/projects/assignments)
const WORLD4_LEVELS = [
  {
    id: 'w4l1', title: 'DELETE Chamber', icon: '🗑️', xpReward: 180,
    sublevels: [
      {
        id: 'w4l1s1', title: 'DELETE FROM … WHERE', badge: '🔴',
        difficulty: 'MEDIUM', xp: 65, concept: 'DELETE',
        schema: 'dml',
        tutorial: {
          concept: 'DELETE removes rows. ALWAYS use WHERE — without it, ALL rows are deleted. SQL evaluates the full WHERE before deleting any row.',
          syntax: "-- Remove specific rows:\nDELETE FROM table\nWHERE condition;\n\n-- ⚠️ This deletes EVERYTHING:\nDELETE FROM table;\n\n-- Preview first:\nSELECT * FROM table WHERE condition;",
          example: { query: "DELETE FROM instructor\nWHERE dept_name = 'Finance';", note: 'All Finance instructors are removed.' }
        },
        narrative: 'A project was cancelled and must be scrubbed from the database.',
        task: 'Remove all projects whose status is <strong>Completed</strong> from the database. Then retrieve all remaining projects to confirm the deletion.',
        solution: "DELETE FROM projects WHERE status='Completed'; SELECT * FROM projects;",
        isDML: true,
        hints: ["Use DELETE with a WHERE clause to target only 'Completed' projects.", 'Always follow a DELETE with a SELECT to verify the result.', "DELETE FROM projects WHERE status='Completed'; SELECT * FROM projects;"]
      },
      {
        id: 'w4l1s2', title: 'DELETE with Subquery', badge: '🔴',
        difficulty: 'HARD', xp: 80, concept: 'DELETE + subquery in WHERE',
        schema: 'dml',
        tutorial: {
          concept: 'DELETE can use a subquery in WHERE. SQL evaluates the full subquery FIRST, computes the set, then deletes.',
          syntax: "DELETE FROM table\nWHERE col IN (\n  SELECT col FROM other WHERE cond\n);",
          example: { query: "DELETE FROM instructor\nWHERE dept_name IN (\n  SELECT dept_name FROM department\n  WHERE building = 'Watson'\n);", note: 'The subquery finds dept names first. Then all instructors in those depts are deleted.' }
        },
        narrative: 'The HR department has been dissolved. All assignment records linked to HR employees must be removed.',
        task: 'Delete all assignment records belonging to employees in the <strong>HR department</strong>. Then display all remaining assignments.',
        solution: "DELETE FROM assignments WHERE emp_id IN (SELECT emp_id FROM employees WHERE department='HR'); SELECT * FROM assignments;",
        isDML: true,
        hints: ['You need to identify HR employees first, then delete their assignments.', 'Use a subquery inside the DELETE condition to find those employee IDs.', "DELETE FROM assignments WHERE emp_id IN (SELECT emp_id FROM employees WHERE department='HR'); SELECT * FROM assignments;"]
      },
      {
        id: 'w4l1s3', title: 'DELETE: salary subquery', badge: '🔴',
        difficulty: 'HARD', xp: 85, concept: 'DELETE with aggregate subquery',
        schema: 'dml',
        tutorial: {
          concept: 'Delete rows where a value falls below the average. SQL computes the average BEFORE deleting — so the average is not affected mid-deletion.',
          syntax: "DELETE FROM table\nWHERE col < (\n  SELECT AVG(col) FROM table\n);\n-- AVG is computed completely first,\n-- THEN all qualifying rows are deleted at once.",
          example: { query: "DELETE FROM instructor\nWHERE salary < (\n  SELECT AVG(salary) FROM instructor\n);", note: 'The AVG is computed over the original table. Then all below-average rows are deleted simultaneously.' }
        },
        narrative: 'The company is restructuring — employees earning below the company-wide average salary will be laid off.',
        task: 'Remove all employees whose salary falls <strong>below the company average</strong>. Then show the remaining employees\' names and salaries in ascending order.',
        solution: "DELETE FROM employees WHERE salary < (SELECT AVG(salary) FROM employees); SELECT name, salary FROM employees ORDER BY salary;",
        isDML: true,
        hints: ['The average must be calculated before the deletion begins — SQL handles this automatically.', 'Use a scalar subquery to get the average salary inside the DELETE condition.', "DELETE FROM employees WHERE salary < (SELECT AVG(salary) FROM employees); SELECT name, salary FROM employees ORDER BY salary;"]
      }
    ]
  },

  {
    id: 'w4l2', title: 'INSERT Forge', icon: '⚒️', xpReward: 180,
    sublevels: [
      {
        id: 'w4l2s1', title: 'INSERT INTO … VALUES', badge: '🔵',
        difficulty: 'MEDIUM', xp: 60, concept: 'INSERT',
        schema: 'dml',
        tutorial: {
          concept: 'INSERT adds a new row. Named form (preferred): column names then values — safer because order does not matter.',
          syntax: "-- Named form (safe):\nINSERT INTO table (col1, col2, col3)\nVALUES (val1, val2, val3);\n\n-- Shorthand (all columns, in order):\nINSERT INTO table\nVALUES (val1, val2, val3);\n\n-- Insert from SELECT:\nINSERT INTO t1 SELECT ... FROM t2;",
          example: { query: "INSERT INTO course (course_id, title, dept_name, credits)\nVALUES ('CS-437', 'Database Systems', 'Comp. Sci.', 4);", note: 'Named form: works correctly regardless of column order in the table.' }
        },
        narrative: 'A new project has been approved and needs to be added to the system.',
        task: 'Add a new project with ID <strong>9</strong>, titled <strong>"Data Lake"</strong>, with a budget of <strong>400000</strong>, under the <strong>Engineering</strong> department, and status <strong>"Active"</strong>. Then retrieve the newly added project to confirm.',
        solution: "INSERT INTO projects VALUES (9, 'Data Lake', 400000, 'Engineering', 'Active'); SELECT * FROM projects WHERE project_id = 9;",
        isDML: true,
        hints: ['Use INSERT INTO with all five column values in the correct order.', 'String values need single quotes.', "INSERT INTO projects VALUES (9, 'Data Lake', 400000, 'Engineering', 'Active'); SELECT * FROM projects WHERE project_id = 9;"]
      },
      {
        id: 'w4l2s2', title: 'INSERT … SELECT', badge: '🟠',
        difficulty: 'HARD', xp: 80, concept: 'INSERT from SELECT',
        schema: 'dml',
        tutorial: {
          concept: 'INSERT … SELECT inserts all rows returned by a SELECT. The SELECT runs completely first, then all results are inserted at once.',
          syntax: "INSERT INTO target_table (col1, col2)\nSELECT col_a, col_b\nFROM source_table\nWHERE condition;",
          example: { query: "INSERT INTO instructor\n  SELECT ID, name, dept_name, 18000\n  FROM student\n  WHERE dept_name='Music'\n    AND tot_cred > 144;", note: 'Promotes eligible Music students to instructors. The SELECT runs fully before any insert.' }
        },
        narrative: 'All Engineering employees will be cross-assigned to Project 1 as contributors.',
        task: 'Insert a new assignment record for every <strong>Engineering</strong> employee — assigning each to project <strong>1</strong> with the role <strong>"Contributor"</strong> and <strong>40</strong> hours. Use <strong>90 + emp_id</strong> as the assign_id. Then show all assignments for project 1.',
        solution: "INSERT INTO assignments (assign_id, emp_id, project_id, role, hours) SELECT (90+emp_id), emp_id, 1, 'Contributor', 40 FROM employees WHERE department='Engineering'; SELECT * FROM assignments WHERE project_id=1;",
        isDML: true,
        hints: ['Use INSERT … SELECT to insert multiple rows at once.', "Filter employees by department='Engineering' in the SELECT.", "INSERT INTO assignments (assign_id, emp_id, project_id, role, hours) SELECT (90+emp_id), emp_id, 1, 'Contributor', 40 FROM employees WHERE department='Engineering'; SELECT * FROM assignments WHERE project_id=1;"]
      }
    ]
  },

  {
    id: 'w4l3', title: 'UPDATE Chambers', icon: '✏️', xpReward: 200,
    sublevels: [
      {
        id: 'w4l3s1', title: 'UPDATE … SET … WHERE', badge: '🟡',
        difficulty: 'MEDIUM', xp: 65, concept: 'UPDATE',
        schema: 'dml',
        tutorial: {
          concept: 'UPDATE changes existing column values. SET defines what changes; WHERE limits which rows change. Without WHERE, ALL rows are updated.',
          syntax: "UPDATE table\nSET col1 = new_val,\n    col2 = expression\nWHERE condition;\n\n-- No WHERE → updates every row!",
          example: { query: "UPDATE instructor\nSET salary = salary * 1.05\nWHERE salary < 70000;", note: 'Gives 5% raise only to instructors earning under 70000.' }
        },
        narrative: 'The Engineering team performed exceptionally this quarter and will receive a pay raise.',
        task: 'Give all <strong>Engineering</strong> employees a <strong>10% salary increase</strong>. Then show the name and updated salary of all Engineering employees.',
        solution: "UPDATE employees SET salary = salary * 1.10 WHERE department='Engineering'; SELECT name, salary FROM employees WHERE department='Engineering';",
        isDML: true,
        hints: ['Multiply the current salary by 1.10 to apply a 10% raise.', "Only update employees where department = 'Engineering'.", "UPDATE employees SET salary = salary * 1.10 WHERE department='Engineering'; SELECT name, salary FROM employees WHERE department='Engineering';"]
      },
      {
        id: 'w4l3s2', title: 'UPDATE with CASE', badge: '⭐',
        difficulty: 'HARD', xp: 85, concept: 'UPDATE + CASE expression',
        schema: 'dml',
        tutorial: {
          concept: 'Use CASE inside SET to apply different changes to different rows in ONE statement to avoid ordering issues.',
          syntax: "UPDATE table\nSET col = CASE\n  WHEN cond1 THEN val1\n  WHEN cond2 THEN val2\n  ELSE default_val\nEND\nWHERE optional_filter;",
          example: { query: "UPDATE instructor\nSET salary = CASE\n  WHEN salary > 100000 THEN salary * 1.03\n  ELSE salary * 1.05\nEND;", note: 'All rows updated in one shot. No row can accidentally receive both raises.' }
        },
        narrative: 'The company has a tiered raise policy — senior earners get a modest increase, others get a larger boost.',
        task: 'Apply a <strong>conditional raise</strong>: employees earning above 70,000 receive a <strong>3% increase</strong>; all others receive an <strong>8% increase</strong>. Then display all employees\' names, departments, and updated salaries, sorted highest salary first.',
        solution: 'UPDATE employees SET salary = CASE WHEN salary > 70000 THEN salary*1.03 ELSE salary*1.08 END; SELECT name, department, salary FROM employees ORDER BY salary DESC;',
        isDML: true,
        hints: ['Apply two different raise percentages based on a condition — all in a single UPDATE.', 'Use a CASE expression inside SET to handle both scenarios.', 'UPDATE employees SET salary = CASE WHEN salary > 70000 THEN salary*1.03 ELSE salary*1.08 END; SELECT name, department, salary FROM employees ORDER BY salary DESC;']
      },
      {
        id: 'w4l3s3', title: 'UPDATE with scalar subquery', badge: '🔴',
        difficulty: 'HARD', xp: 90, concept: 'UPDATE SET with scalar subquery',
        schema: 'dml',
        tutorial: {
          concept: 'SET can use a scalar subquery as the new value, letting you update a column to a computed value from another table.',
          syntax: "UPDATE table\nSET col = (\n  SELECT aggregate\n  FROM other_table\n  WHERE condition\n)\nWHERE other_condition;",
          example: { query: "UPDATE student\nSET tot_cred = (\n  SELECT SUM(credits)\n  FROM takes NATURAL JOIN course\n  WHERE takes.ID = student.ID\n    AND grade <> 'F'\n    AND grade IS NOT NULL\n);", note: "Updates each student's tot_cred to the sum of credits for passed courses." }
        },
        narrative: 'Project budgets need to be recalculated based on actual hours logged by the assigned team.',
        task: 'Update each project\'s <strong>budget</strong> to equal the <strong>total hours worked on it multiplied by 100</strong>. Then show each project\'s title and new budget, ordered from highest to lowest budget.',
        solution: "UPDATE projects SET budget = (SELECT SUM(hours)*100 FROM assignments WHERE assignments.project_id = projects.project_id); SELECT title, budget FROM projects ORDER BY budget DESC;",
        isDML: true,
        hints: ['The new budget must be calculated from a related table — use a correlated scalar subquery in SET.', "Sum the hours for each project's assignments, then multiply by 100.", "UPDATE projects SET budget = (SELECT SUM(hours)*100 FROM assignments WHERE assignments.project_id = projects.project_id); SELECT title, budget FROM projects ORDER BY budget DESC;"]
      }
    ]
  },

  {
    id: 'w4l4', title: '⚔️ Boss: DML Gauntlet', icon: '👑', isBoss: true, xpReward: 300,
    sublevels: [
      {
        id: 'w4l4s1', title: 'INSERT + UPDATE + DELETE', badge: '👑',
        difficulty: 'HARD', xp: 150, concept: 'All DML in sequence',
        schema: 'dml',
        tutorial: {
          concept: 'Real DML often chains all three operations. Remember: (1) DELETE subquery evaluates average BEFORE any deletion; (2) Use CASE in UPDATE when rows could cross a threshold between two UPDATE statements.',
          syntax: "-- Safe sequence:\nINSERT ...;\nUPDATE ... SET ... CASE ...;\nDELETE ... WHERE col IN (subquery);\nSELECT * ...; -- always verify!",
          example: { query: "INSERT INTO employees VALUES (9,'Nia','Finance',50000,'2024-01-01','Dhaka');\nUPDATE employees SET salary=salary*1.10\n  WHERE department='Finance';\nDELETE FROM projects WHERE status='Completed';\nSELECT * FROM employees WHERE department='Finance' ORDER BY salary;", note: 'Each step modifies state. The final SELECT confirms the current state.' }
        },
        narrative: '⚔️ BOSS ROUND — prove you can chain all three DML operations correctly in a single session.',
        task: 'Execute the following in order:<br><br>1. Add a new employee: ID <strong>10</strong>, name <strong>"Sam"</strong>, department <strong>"Marketing"</strong>, salary <strong>53000</strong>, hire date <strong>"2024-01-01"</strong>, city <strong>"Dhaka"</strong>.<br>2. Give a <strong>15% raise</strong> to all employees currently earning below the company average.<br>3. Delete all assignment records with fewer than <strong>70 hours</strong> logged.<br>4. Show all employees\' names, departments, and salaries — highest salary first.',
        solution: "INSERT INTO employees VALUES (10,'Sam','Marketing',53000,'2024-01-01','Dhaka'); UPDATE employees SET salary=salary*1.15 WHERE salary < (SELECT AVG(salary) FROM employees); DELETE FROM assignments WHERE hours < 70; SELECT name, department, salary FROM employees ORDER BY salary DESC;",
        isDML: true,
        hints: ['Run all four statements in order, separated by semicolons.', 'The UPDATE uses the company average — calculated before any changes are applied.', "INSERT INTO employees VALUES (10,'Sam','Marketing',53000,'2024-01-01','Dhaka'); UPDATE employees SET salary=salary*1.15 WHERE salary < (SELECT AVG(salary) FROM employees); DELETE FROM assignments WHERE hours < 70; SELECT name, department, salary FROM employees ORDER BY salary DESC;"]
      }
    ]
  }
];
