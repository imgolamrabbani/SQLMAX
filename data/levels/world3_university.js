// World 3 — Subquery Universe (University schema)
const WORLD3_LEVELS = [
  {
    id: 'w3l1', title: 'Set Membership', icon: '🎯', xpReward: 200,
    sublevels: [
      {
        id: 'w3l1s1', title: 'IN — Set Membership', badge: '🔵',
        difficulty: 'MEDIUM', xp: 60, concept: 'WHERE col IN (subquery)',
        schema: 'university',
        tutorial: {
          concept: 'IN checks if a value belongs to a set. The set can be a hardcoded list OR the result of a subquery. The subquery runs first, then IN checks membership.',
          syntax: "-- Hardcoded list:\nWHERE col IN ('A', 'B', 'C')\n\n-- Subquery:\nWHERE col IN (SELECT col\n              FROM other_table\n              WHERE condition);",
          example: { query: "SELECT DISTINCT course_id\nFROM section\nWHERE semester='Fall' AND year=2019\n  AND course_id IN (\n    SELECT course_id FROM section\n    WHERE semester='Spring' AND year=2020\n  );", note: 'Courses in Fall 2019 that also appear in the Spring 2020 list.' }
        },
        narrative: 'The registrar wants to know which Fall 2019 courses were popular enough to also run in Spring 2020.',
        task: 'Find all courses offered in Fall 2019 that were <strong>also offered</strong> in Spring 2020. Return distinct course IDs.',
        solution: "SELECT DISTINCT course_id FROM section WHERE semester='Fall' AND year=2019 AND course_id IN (SELECT course_id FROM section WHERE semester='Spring' AND year=2020);",
        isDML: false,
        hints: ['Filter Fall 2019 courses — but only keep those whose ID also appears in another result set.', 'The inner query finds Spring 2020 course IDs.', "SELECT DISTINCT course_id FROM section WHERE semester='Fall' AND year=2019 AND course_id IN (SELECT course_id FROM section WHERE semester='Spring' AND year=2020);"]
      },
      {
        id: 'w3l1s2', title: 'NOT IN', badge: '🟠',
        difficulty: 'MEDIUM', xp: 65, concept: 'WHERE col NOT IN (subquery)',
        schema: 'university',
        tutorial: {
          concept: 'NOT IN returns rows where the value is NOT in the subquery result. Warning: if the subquery contains any NULL, NOT IN returns nothing!',
          syntax: "WHERE col NOT IN (\n  SELECT col FROM table WHERE cond\n);\n\n-- ⚠️ If subquery can return NULL:\n-- Use NOT EXISTS instead (safer)",
          example: { query: "SELECT DISTINCT course_id\nFROM section\nWHERE semester='Fall' AND year=2019\n  AND course_id NOT IN (\n    SELECT course_id FROM section\n    WHERE semester='Spring' AND year=2020\n  );", note: 'Fall 2019 courses that were NOT offered again in Spring 2020.' }
        },
        narrative: 'Some Fall 2019 courses were discontinued the following semester. Identify them.',
        task: 'Find courses offered in Fall 2019 that were <strong>not</strong> offered in Spring 2020. Return distinct course IDs.',
        solution: "SELECT DISTINCT course_id FROM section WHERE semester='Fall' AND year=2019 AND course_id NOT IN (SELECT course_id FROM section WHERE semester='Spring' AND year=2020);",
        isDML: false,
        hints: ['You want Fall 2019 courses that are absent from the Spring 2020 list.', 'The inner query finds Spring 2020 course IDs.', "SELECT DISTINCT course_id FROM section WHERE semester='Fall' AND year=2019 AND course_id NOT IN (SELECT course_id FROM section WHERE semester='Spring' AND year=2020);"]
      },
      {
        id: 'w3l1s3', title: 'IN with tuple', badge: '🟣',
        difficulty: 'HARD', xp: 70, concept: 'IN with multi-column tuple',
        schema: 'university',
        tutorial: {
          concept: 'You can use IN with a tuple (multiple columns) to match composite keys. The inner query must return the same number of columns.',
          syntax: "WHERE (col1, col2) IN (\n  SELECT col1, col2\n  FROM table\n  WHERE condition\n);",
          example: { query: "SELECT COUNT(DISTINCT ID) AS num_students\nFROM takes\nWHERE (course_id, sec_id, semester, year) IN (\n  SELECT course_id, sec_id, semester, year\n  FROM teaches\n  WHERE ID = '10101'\n);", note: "Finds students who took any section taught by instructor 10101." }
        },
        narrative: 'The academic integrity office needs to audit students taught by a specific instructor.',
        task: 'How many distinct students have enrolled in a section taught by instructor <strong>10101</strong>? Label the result <strong>num_students</strong>.',
        solution: "SELECT COUNT(DISTINCT ID) AS num_students FROM takes WHERE (course_id, sec_id, semester, year) IN (SELECT course_id, sec_id, semester, year FROM teaches WHERE ID='10101');",
        isDML: false,
        hints: ['A student enrolment matches a teaching record when all four key columns agree: course_id, sec_id, semester, year.', 'Use a multi-column tuple in your matching condition.', "SELECT COUNT(DISTINCT ID) AS num_students FROM takes WHERE (course_id, sec_id, semester, year) IN (SELECT course_id, sec_id, semester, year FROM teaches WHERE ID='10101');"]
      }
    ]
  },

  {
    id: 'w3l2', title: 'Set Comparison', icon: '⚖️', xpReward: 220,
    sublevels: [
      {
        id: 'w3l2s1', title: '> SOME', badge: '🟡',
        difficulty: 'HARD', xp: 75, concept: '> SOME (any one)',
        schema: 'university',
        tutorial: {
          concept: 'SOME (same as ANY) means "at least one". X > SOME(set) is TRUE if X is greater than at least one value in the set. = SOME is equivalent to IN.',
          syntax: "WHERE col > SOME (\n  SELECT col FROM table WHERE cond\n);\n\n-- Works with: >, <, >=, <=, =, <>\n-- (= SOME) ≡ IN\n-- (<> SOME) ≢ NOT IN  ← common mistake!",
          example: { query: "SELECT name FROM instructor\nWHERE salary > SOME (\n  SELECT salary FROM instructor\n  WHERE dept_name='Biology'\n);", note: 'Anyone earning more than at least one Biology instructor.' }
        },
        narrative: 'Find instructors who out-earn at least one person in the Biology department.',
        task: 'Find the names of all instructors whose salary is <strong>greater than the salary of at least one</strong> instructor in the Biology department.',
        solution: "SELECT name FROM instructor WHERE salary > SOME (SELECT salary FROM instructor WHERE dept_name='Biology');",
        isDML: false,
        hints: ['The comparison is against ANY single salary in Biology — just one needs to be lower than yours.', 'Use a comparison operator with a keyword that means "at least one".', "SELECT name FROM instructor WHERE salary > SOME (SELECT salary FROM instructor WHERE dept_name='Biology');"]
      },
      {
        id: 'w3l2s2', title: '> ALL', badge: '🔴',
        difficulty: 'HARD', xp: 80, concept: '> ALL (every single one)',
        schema: 'university',
        tutorial: {
          concept: 'ALL means "every single value". X > ALL(set) is TRUE only if X is greater than EVERY value in the set. (<> ALL) is equivalent to NOT IN.',
          syntax: "WHERE col > ALL (\n  SELECT col FROM table WHERE cond\n);\n\n-- (> ALL) finds max condition\n-- (<> ALL) ≡ NOT IN",
          example: { query: "SELECT name FROM instructor\nWHERE salary > ALL (\n  SELECT salary FROM instructor\n  WHERE dept_name='Biology'\n);", note: 'Only instructors with salary strictly greater than every Biology salary.' }
        },
        narrative: 'Who earns more than every single instructor in the Biology department?',
        task: 'Find the names of instructors whose salary is <strong>higher than the salary of every</strong> instructor in the Biology department.',
        solution: "SELECT name FROM instructor WHERE salary > ALL (SELECT salary FROM instructor WHERE dept_name='Biology');",
        isDML: false,
        hints: ['Every Biology salary must be lower — not just one.', 'Use a comparison operator with a keyword that means "every single value".', "SELECT name FROM instructor WHERE salary > ALL (SELECT salary FROM instructor WHERE dept_name='Biology');"]
      }
    ]
  },

  {
    id: 'w3l3', title: 'EXISTS Arena', icon: '🔬', xpReward: 230,
    sublevels: [
      {
        id: 'w3l3s1', title: 'EXISTS', badge: '🟢',
        difficulty: 'HARD', xp: 80, concept: 'EXISTS (correlated subquery)',
        schema: 'university',
        tutorial: {
          concept: 'EXISTS returns TRUE if the subquery returns at least one row. The subquery references the outer query (correlated). For each outer row, the inner query is re-evaluated.',
          syntax: "SELECT col\nFROM outer_table AS S\nWHERE EXISTS (\n  SELECT *\n  FROM inner_table AS T\n  WHERE S.col = T.col  -- correlation link!\n);",
          example: { query: "SELECT course_id\nFROM section AS S\nWHERE semester='Fall' AND year=2019\n  AND EXISTS (\n    SELECT * FROM section AS T\n    WHERE semester='Spring' AND year=2020\n      AND S.course_id = T.course_id\n  );", note: 'For each Fall 2019 section (S), checks if a matching Spring 2020 section (T) exists.' }
        },
        narrative: 'Identify which Fall 2019 courses had a corresponding section the following semester.',
        task: 'Find all Fall 2019 <strong>course IDs</strong> for which a section also exists in Spring 2020.',
        solution: "SELECT course_id FROM section AS S WHERE semester='Fall' AND year=2019 AND EXISTS (SELECT * FROM section AS T WHERE semester='Spring' AND year=2020 AND S.course_id = T.course_id);",
        isDML: false,
        hints: ['For each Fall 2019 course, check whether a matching record exists in another query.', 'The inner query must reference the outer query\'s row — this is a correlated subquery.', "SELECT course_id FROM section AS S WHERE semester='Fall' AND year=2019 AND EXISTS (SELECT * FROM section AS T WHERE semester='Spring' AND year=2020 AND S.course_id = T.course_id);"]
      },
      {
        id: 'w3l3s2', title: 'NOT EXISTS', badge: '⚫',
        difficulty: 'HARD', xp: 85, concept: 'NOT EXISTS',
        schema: 'university',
        tutorial: {
          concept: 'NOT EXISTS returns TRUE when the subquery returns NO rows. It is the safer alternative to NOT IN when NULLs may be present in data.',
          syntax: "SELECT col\nFROM table AS S\nWHERE NOT EXISTS (\n  SELECT *\n  FROM other AS T\n  WHERE S.col = T.col\n);\n\n-- Prefer NOT EXISTS over NOT IN\n-- when subquery columns can contain NULL",
          example: { query: "SELECT name FROM instructor I\nWHERE NOT EXISTS (\n  SELECT * FROM teaches T\n  WHERE I.ID = T.ID\n);", note: 'Instructors for whom NO teaching record exists.' }
        },
        narrative: 'Some instructors have never been assigned to teach any course. Find them.',
        task: 'Find the names of all instructors who have <strong>never taught</strong> any course.',
        solution: 'SELECT name FROM instructor I WHERE NOT EXISTS (SELECT * FROM teaches T WHERE I.ID = T.ID);',
        isDML: false,
        hints: ['You need instructors for whom no matching row exists in the teaches table.', 'Use a correlated existence check — and negate it.', 'SELECT name FROM instructor I WHERE NOT EXISTS (SELECT * FROM teaches T WHERE I.ID = T.ID);']
      }
    ]
  },

  {
    id: 'w3l4', title: 'Advanced Subqueries', icon: '🧮', xpReward: 240,
    sublevels: [
      {
        id: 'w3l4s1', title: 'Scalar Subquery in SELECT', badge: '⭐',
        difficulty: 'HARD', xp: 80, concept: 'Scalar subquery returns one value',
        schema: 'university',
        tutorial: {
          concept: 'A scalar subquery in the SELECT clause returns exactly ONE value per row of the outer query. If it returns more than one row, it is a runtime error.',
          syntax: "SELECT col,\n  (SELECT aggregate\n   FROM other\n   WHERE condition) AS alias\nFROM table;",
          example: { query: "SELECT dept_name,\n  (SELECT COUNT(*) FROM instructor\n   WHERE department.dept_name\n         = instructor.dept_name\n  ) AS num_instructors\nFROM department;", note: 'For each department row, the scalar subquery counts instructors in that department.' }
        },
        narrative: 'The university directory needs to show each department alongside how many instructors it employs.',
        task: 'For every department, show its <strong>name</strong> and the total <strong>number of instructors</strong> in that department, labelled <strong>num_instructors</strong>.',
        solution: 'SELECT dept_name, (SELECT COUNT(*) FROM instructor WHERE department.dept_name = instructor.dept_name) AS num_instructors FROM department;',
        isDML: false,
        hints: ['You need a count computed separately for each department row.', 'Place a subquery inside your SELECT clause — it must return exactly one value per row.', 'SELECT dept_name, (SELECT COUNT(*) FROM instructor WHERE department.dept_name = instructor.dept_name) AS num_instructors FROM department;']
      },
      {
        id: 'w3l4s2', title: 'Subquery in FROM', badge: '💜',
        difficulty: 'HARD', xp: 85, concept: 'Subquery as derived table in FROM',
        schema: 'university',
        tutorial: {
          concept: 'A subquery in the FROM clause creates a temporary table (derived table). You must give it an alias. Then you can filter it like a regular table.',
          syntax: "SELECT col\nFROM (\n  SELECT col, aggregate\n  FROM table\n  GROUP BY col\n) AS derived_name\nWHERE derived_name.aggregate > value;",
          example: { query: "SELECT dept_name, avg_sal\nFROM (\n  SELECT dept_name,\n         AVG(salary) AS avg_sal\n  FROM instructor\n  GROUP BY dept_name\n) AS dept_avg\nWHERE avg_sal > 80000;", note: 'The inner GROUP BY runs first, creating dept_avg. Then the outer WHERE filters it.' }
        },
        narrative: 'The provost wants a list of only the well-funded departments based on what they pay instructors.',
        task: 'Find departments where the average instructor salary exceeds <strong>80,000</strong>. Use a <strong>subquery inside FROM</strong> (not HAVING). Show department name and average salary as <strong>avg_sal</strong>.',
        solution: 'SELECT dept_name, avg_sal FROM (SELECT dept_name, AVG(salary) AS avg_sal FROM instructor GROUP BY dept_name) AS dept_avg WHERE avg_sal > 80000;',
        isDML: false,
        hints: ['Compute the averages inside a subquery in FROM, give it an alias.', 'Then filter the result of that subquery in the outer WHERE clause.', 'SELECT dept_name, avg_sal FROM (SELECT dept_name, AVG(salary) AS avg_sal FROM instructor GROUP BY dept_name) AS dept_avg WHERE avg_sal > 80000;']
      }
    ]
  },

  {
    id: 'w3l5', title: 'WITH Clause (CTE)', icon: '🧪', xpReward: 220,
    sublevels: [
      {
        id: 'w3l5s1', title: 'WITH … AS', badge: '💙',
        difficulty: 'HARD', xp: 85, concept: 'WITH clause (Common Table Expression)',
        schema: 'university',
        tutorial: {
          concept: 'WITH defines a named temporary result set (CTE). It runs before the main query. Use it to break complex queries into readable pieces.',
          syntax: "WITH cte_name AS (\n  SELECT col, aggregate\n  FROM table\n  GROUP BY col\n)\nSELECT *\nFROM cte_name\nWHERE condition;",
          example: { query: "WITH dept_total AS (\n  SELECT dept_name,\n         SUM(salary) AS total_salary\n  FROM instructor\n  GROUP BY dept_name\n)\nSELECT dept_name, total_salary\nFROM dept_total\nWHERE total_salary > 100000;", note: 'dept_total is computed first. Then filtered. Much more readable than a nested subquery.' }
        },
        narrative: 'The finance office wants to flag departments with a total salary bill over 100,000.',
        task: 'Using a WITH clause, find all departments whose <strong>total salary payroll exceeds 100,000</strong>. Show the department name and its total salary.',
        solution: 'WITH dept_total AS (SELECT dept_name, SUM(salary) AS total_salary FROM instructor GROUP BY dept_name) SELECT dept_name, total_salary FROM dept_total WHERE total_salary > 100000;',
        isDML: false,
        hints: ['Define the aggregation as a named CTE using WITH.', 'Then query that CTE and apply your filter.', 'WITH dept_total AS (SELECT dept_name, SUM(salary) AS total_salary FROM instructor GROUP BY dept_name) SELECT dept_name, total_salary FROM dept_total WHERE total_salary > 100000;']
      },
      {
        id: 'w3l5s2', title: 'WITH for complex aggregation', badge: '⭐',
        difficulty: 'HARD', xp: 90, concept: 'WITH + max of aggregates',
        schema: 'university',
        tutorial: {
          concept: 'A classic exam pattern: find the maximum of a grouped aggregate. You cannot use MAX(AVG(salary)) directly — use WITH to compute the aggregates first, then take MAX.',
          syntax: "WITH dept_avg AS (\n  SELECT dept_name, AVG(salary) AS avg_sal\n  FROM instructor\n  GROUP BY dept_name\n)\nSELECT MAX(avg_sal) AS max_avg_sal\nFROM dept_avg;",
          example: { query: "WITH dept_avg AS (\n  SELECT dept_name, AVG(salary) AS avg_sal\n  FROM instructor\n  GROUP BY dept_name\n)\nSELECT MAX(avg_sal) AS max_avg_sal\nFROM dept_avg;", note: 'First compute AVG per department, then MAX over those averages.' }
        },
        narrative: 'The board wants to know the highest average salary among all departments — a classic two-step aggregation.',
        task: 'Find the <strong>highest average salary</strong> recorded across all departments. Label the result <strong>max_avg_sal</strong>. Use a WITH clause.',
        solution: 'WITH dept_avg AS (SELECT dept_name, AVG(salary) AS avg_sal FROM instructor GROUP BY dept_name) SELECT MAX(avg_sal) AS max_avg_sal FROM dept_avg;',
        isDML: false,
        hints: ['You cannot nest aggregate functions — compute the averages first, then find the maximum.', 'Use WITH to name the intermediate result, then apply MAX in the outer query.', 'WITH dept_avg AS (SELECT dept_name, AVG(salary) AS avg_sal FROM instructor GROUP BY dept_name) SELECT MAX(avg_sal) AS max_avg_sal FROM dept_avg;']
      }
    ]
  }
];
