// World 3 — Subquery Universe (University schema)
// Topics: every subquery form from chapter 3:
//   IN, NOT IN, SOME/ANY, ALL, EXISTS, NOT EXISTS, Scalar subquery,
//   Subquery in FROM, WITH clause, UNIQUE (conceptual)
// All solutions verified against SCHEMA_UNIVERSITY data
const WORLD3_LEVELS = [
  // ── LEVEL 1: Set Membership (IN, NOT IN) ─────────────────────────────
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
          example: { query: "SELECT DISTINCT course_id\nFROM section\nWHERE semester='Fall' AND year=2019\n  AND course_id IN (\n    SELECT course_id FROM section\n    WHERE semester='Spring' AND year=2020\n  );", note: 'Courses in Fall 2019 that are also listed in the Spring 2020 subquery result.' }
        },
        narrative: 'Find courses offered in Fall 2019 that are also in Spring 2020.',
        task: 'Use IN with a subquery: find <strong>course_id</strong> from section in Fall 2019 where course_id <strong>IN</strong> (Spring 2020 course_ids). Use DISTINCT.',
        solution: "SELECT DISTINCT course_id FROM section WHERE semester='Fall' AND year=2019 AND course_id IN (SELECT course_id FROM section WHERE semester='Spring' AND year=2020);",
        isDML: false,
        hints: ['The subquery gets Spring 2020 course_ids.', 'Outer query filters Fall 2019 by that list.', "SELECT DISTINCT course_id FROM section WHERE semester='Fall' AND year=2019 AND course_id IN (SELECT course_id FROM section WHERE semester='Spring' AND year=2020);"]
      },
      {
        id: 'w3l1s2', title: 'NOT IN', badge: '🟠',
        difficulty: 'MEDIUM', xp: 65, concept: 'WHERE col NOT IN (subquery)',
        schema: 'university',
        tutorial: {
          concept: 'NOT IN returns rows where the value is NOT in the subquery result. Warning: if the subquery contains any NULL, NOT IN returns nothing! This is a common bug.',
          syntax: "WHERE col NOT IN (\n  SELECT col FROM table WHERE cond\n);\n\n-- ⚠️ If subquery can return NULL:\n-- Use NOT EXISTS instead (safer)",
          example: { query: "SELECT DISTINCT course_id\nFROM section\nWHERE semester='Fall' AND year=2019\n  AND course_id NOT IN (\n    SELECT course_id FROM section\n    WHERE semester='Spring' AND year=2020\n  );", note: 'Only Fall 2019 courses that were NOT offered in Spring 2020.' }
        },
        narrative: 'Courses in Fall 2019 but NOT offered in Spring 2020.',
        task: 'Use NOT IN: <strong>course_id</strong> from section (Fall 2019) where course_id NOT IN Spring 2020 sections. Use DISTINCT.',
        solution: "SELECT DISTINCT course_id FROM section WHERE semester='Fall' AND year=2019 AND course_id NOT IN (SELECT course_id FROM section WHERE semester='Spring' AND year=2020);",
        isDML: false,
        hints: ['Flip IN to NOT IN.', 'Same structure as previous level.', "SELECT DISTINCT course_id FROM section WHERE semester='Fall' AND year=2019 AND course_id NOT IN (SELECT course_id FROM section WHERE semester='Spring' AND year=2020);"]
      },
      {
        id: 'w3l1s3', title: 'IN with tuple', badge: '🟣',
        difficulty: 'HARD', xp: 70, concept: 'IN with multi-column tuple',
        schema: 'university',
        tutorial: {
          concept: 'You can use IN with a tuple (multiple columns) to match composite keys. The inner query must return the same number of columns.',
          syntax: "WHERE (col1, col2) IN (\n  SELECT col1, col2\n  FROM table\n  WHERE condition\n);",
          example: { query: "SELECT COUNT(DISTINCT ID) AS num_students\nFROM takes\nWHERE (course_id, sec_id, semester, year) IN (\n  SELECT course_id, sec_id, semester, year\n  FROM teaches\n  WHERE ID = '10101'\n);", note: "Finds students who took any section taught by instructor 10101 — matches on all 4 key columns." }
        },
        narrative: 'How many distinct students took courses taught by instructor 10101?',
        task: 'Show <strong>COUNT(DISTINCT ID)</strong> as num_students from takes where the (course_id, sec_id, semester, year) tuple is IN (SELECT those columns FROM teaches WHERE ID = \'10101\').',
        solution: "SELECT COUNT(DISTINCT ID) AS num_students FROM takes WHERE (course_id, sec_id, semester, year) IN (SELECT course_id, sec_id, semester, year FROM teaches WHERE ID='10101');",
        isDML: false,
        hints: ['Use a 4-column tuple in IN.', 'The subquery selects course_id, sec_id, semester, year from teaches.', "SELECT COUNT(DISTINCT ID) AS num_students FROM takes WHERE (course_id, sec_id, semester, year) IN (SELECT course_id, sec_id, semester, year FROM teaches WHERE ID='10101');"]
      }
    ]
  },

  // ── LEVEL 2: Set Comparison (SOME, ALL) ──────────────────────────────
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
          example: { query: "SELECT name FROM instructor\nWHERE salary > SOME (\n  SELECT salary FROM instructor\n  WHERE dept_name='Biology'\n);", note: 'Biology salaries are [72000]. Anyone earning > 72000 qualifies. Most instructors pass.' }
        },
        narrative: 'Find instructors earning more than at least one Biology instructor.',
        task: "Show <strong>name</strong> from instructor where salary <strong>> SOME</strong> (salaries in Biology dept).",
        solution: "SELECT name FROM instructor WHERE salary > SOME (SELECT salary FROM instructor WHERE dept_name='Biology');",
        isDML: false,
        hints: ['> SOME = greater than at least one.', "Subquery: SELECT salary FROM instructor WHERE dept_name='Biology'", "SELECT name FROM instructor WHERE salary > SOME (SELECT salary FROM instructor WHERE dept_name='Biology');"]
      },
      {
        id: 'w3l2s2', title: '> ALL', badge: '🔴',
        difficulty: 'HARD', xp: 80, concept: '> ALL (every single one)',
        schema: 'university',
        tutorial: {
          concept: 'ALL means "every single value". X > ALL(set) is TRUE only if X is greater than EVERY value in the set. (<> ALL) is equivalent to NOT IN.',
          syntax: "WHERE col > ALL (\n  SELECT col FROM table WHERE cond\n);\n\n-- (> ALL) finds max condition\n-- (<> ALL) ≡ NOT IN",
          example: { query: "SELECT name FROM instructor\nWHERE salary > ALL (\n  SELECT salary FROM instructor\n  WHERE dept_name='Biology'\n);", note: 'Biology max = 72000. Only instructors with salary strictly > 72000 are returned.' }
        },
        narrative: 'Find instructors earning more than ALL Biology instructors.',
        task: "Show <strong>name</strong> from instructor where salary <strong>> ALL</strong> (Biology dept salaries).",
        solution: "SELECT name FROM instructor WHERE salary > ALL (SELECT salary FROM instructor WHERE dept_name='Biology');",
        isDML: false,
        hints: ['> ALL = greater than every value.', "Biology salaries: just 72000 (Crick).", "SELECT name FROM instructor WHERE salary > ALL (SELECT salary FROM instructor WHERE dept_name='Biology');"]
      }
    ]
  },

  // ── LEVEL 3: EXISTS / NOT EXISTS ─────────────────────────────────────
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
          example: { query: "SELECT course_id\nFROM section AS S\nWHERE semester='Fall' AND year=2019\n  AND EXISTS (\n    SELECT * FROM section AS T\n    WHERE semester='Spring' AND year=2020\n      AND S.course_id = T.course_id\n  );", note: 'For each Fall 2019 section (S), we check if a matching Spring 2020 section (T) exists. S.course_id = T.course_id is the correlation.' }
        },
        narrative: 'Courses in Fall 2019 for which a Spring 2020 section also exists.',
        task: 'Use EXISTS: <strong>course_id</strong> from section (sem=\'Fall\', year=2019) AS S, where EXISTS (a section in Spring 2020 where course_id matches S.course_id).',
        solution: "SELECT course_id FROM section AS S WHERE semester='Fall' AND year=2019 AND EXISTS (SELECT * FROM section AS T WHERE semester='Spring' AND year=2020 AND S.course_id = T.course_id);",
        isDML: false,
        hints: ['Give the outer table an alias S.', 'Inner query: SELECT * FROM section AS T WHERE ... AND S.course_id = T.course_id', "SELECT course_id FROM section AS S WHERE semester='Fall' AND year=2019 AND EXISTS (SELECT * FROM section AS T WHERE semester='Spring' AND year=2020 AND S.course_id = T.course_id);"]
      },
      {
        id: 'w3l3s2', title: 'NOT EXISTS', badge: '⚫',
        difficulty: 'HARD', xp: 85, concept: 'NOT EXISTS',
        schema: 'university',
        tutorial: {
          concept: 'NOT EXISTS returns TRUE when the subquery returns NO rows. It is the safer alternative to NOT IN when NULLs may be present in data.',
          syntax: "SELECT col\nFROM table AS S\nWHERE NOT EXISTS (\n  SELECT *\n  FROM other AS T\n  WHERE S.col = T.col\n);\n\n-- Use NOT EXISTS over NOT IN\n-- when subquery columns can contain NULL",
          example: { query: "SELECT name FROM instructor I\nWHERE NOT EXISTS (\n  SELECT * FROM teaches T\n  WHERE I.ID = T.ID\n);", note: 'Instructors for whom NO teaching record exists — they have never taught.' }
        },
        narrative: 'Find instructors who have never taught any course.',
        task: "Show <strong>name</strong> from instructor AS I where <strong>NOT EXISTS</strong> (SELECT * FROM teaches AS T WHERE I.ID = T.ID).",
        solution: 'SELECT name FROM instructor I WHERE NOT EXISTS (SELECT * FROM teaches T WHERE I.ID = T.ID);',
        isDML: false,
        hints: ['NOT EXISTS checks that no matching row exists.', 'Inner query links I.ID = T.ID.', 'SELECT name FROM instructor I WHERE NOT EXISTS (SELECT * FROM teaches T WHERE I.ID = T.ID);']
      }
    ]
  },

  // ── LEVEL 4: Scalar Subquery + Subquery in FROM ───────────────────────
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
        narrative: 'List each department with how many instructors it has.',
        task: 'Show <strong>dept_name</strong> and a scalar subquery <strong>COUNT(*)</strong> as num_instructors (matching dept_name) from department.',
        solution: 'SELECT dept_name, (SELECT COUNT(*) FROM instructor WHERE department.dept_name = instructor.dept_name) AS num_instructors FROM department;',
        isDML: false,
        hints: ['Scalar subquery is inside the SELECT clause.', 'It references department.dept_name — that is the correlation.', 'SELECT dept_name, (SELECT COUNT(*) FROM instructor WHERE department.dept_name = instructor.dept_name) AS num_instructors FROM department;']
      },
      {
        id: 'w3l4s2', title: 'Subquery in FROM', badge: '💜',
        difficulty: 'HARD', xp: 85, concept: 'Subquery as derived table in FROM',
        schema: 'university',
        tutorial: {
          concept: 'A subquery in the FROM clause creates a temporary table (derived table). You must give it an alias. Then you can JOIN or filter it like a regular table.',
          syntax: "SELECT col\nFROM (\n  SELECT col, aggregate\n  FROM table\n  GROUP BY col\n) AS derived_name\nWHERE derived_name.aggregate > value;",
          example: { query: "SELECT dept_name, avg_sal\nFROM (\n  SELECT dept_name,\n         AVG(salary) AS avg_sal\n  FROM instructor\n  GROUP BY dept_name\n) AS dept_avg\nWHERE avg_sal > 80000;", note: 'The inner GROUP BY runs first, creating dept_avg. Then the outer WHERE filters it. Could also be written with HAVING.' }
        },
        narrative: 'Find departments where the average salary exceeds 80000 — using a subquery in FROM.',
        task: 'Use a subquery in FROM: compute AVG(salary) as avg_sal per dept_name, alias the subquery as dept_avg, then show <strong>dept_name</strong> and <strong>avg_sal</strong> where avg_sal > 80000.',
        solution: 'SELECT dept_name, avg_sal FROM (SELECT dept_name, AVG(salary) AS avg_sal FROM instructor GROUP BY dept_name) AS dept_avg WHERE avg_sal > 80000;',
        isDML: false,
        hints: ['The subquery goes inside FROM and must have an alias.', 'Inner query: SELECT dept_name, AVG(salary) AS avg_sal FROM instructor GROUP BY dept_name', 'SELECT dept_name, avg_sal FROM (SELECT dept_name, AVG(salary) AS avg_sal FROM instructor GROUP BY dept_name) AS dept_avg WHERE avg_sal > 80000;']
      }
    ]
  },

  // ── LEVEL 5: WITH clause (CTE) ────────────────────────────────────────
  {
    id: 'w3l5', title: 'WITH Clause (CTE)', icon: '🧪', xpReward: 220,
    sublevels: [
      {
        id: 'w3l5s1', title: 'WITH … AS', badge: '💙',
        difficulty: 'HARD', xp: 85, concept: 'WITH clause (Common Table Expression)',
        schema: 'university',
        tutorial: {
          concept: 'WITH defines a named temporary result set (CTE). It runs before the main query. Use it to break complex queries into readable pieces. Multiple CTEs can be chained with commas.',
          syntax: "WITH cte_name AS (\n  SELECT col, aggregate\n  FROM table\n  GROUP BY col\n)\nSELECT *\nFROM cte_name\nWHERE condition;\n\n-- Multiple CTEs:\nWITH cte1 AS (...),\n     cte2 AS (...)\nSELECT ...",
          example: { query: "WITH dept_total AS (\n  SELECT dept_name,\n         SUM(salary) AS total_salary\n  FROM instructor\n  GROUP BY dept_name\n)\nSELECT dept_name, total_salary\nFROM dept_total\nWHERE total_salary > 100000;", note: 'dept_total is computed first. Then filtered. Much more readable than a nested subquery.' }
        },
        narrative: 'Use a CTE to find departments with total salary payroll above 100000.',
        task: "WITH dept_total AS (SELECT dept_name, SUM(salary) AS total_salary FROM instructor GROUP BY dept_name): show <strong>dept_name</strong> and <strong>total_salary</strong> where total_salary > 100000.",
        solution: 'WITH dept_total AS (SELECT dept_name, SUM(salary) AS total_salary FROM instructor GROUP BY dept_name) SELECT dept_name, total_salary FROM dept_total WHERE total_salary > 100000;',
        isDML: false,
        hints: ['Write the CTE in WITH ... AS (...).', 'Then reference it in main SELECT + WHERE.', 'WITH dept_total AS (SELECT dept_name, SUM(salary) AS total_salary FROM instructor GROUP BY dept_name) SELECT dept_name, total_salary FROM dept_total WHERE total_salary > 100000;']
      },
      {
        id: 'w3l5s2', title: 'WITH for complex aggregation', badge: '⭐',
        difficulty: 'HARD', xp: 90, concept: 'WITH + max of aggregates',
        schema: 'university',
        tutorial: {
          concept: 'A classic exam pattern: find the maximum of a grouped aggregate. You cannot use MAX(AVG(salary)) directly — use WITH (or subquery in FROM) to compute the aggregates first, then take MAX.',
          syntax: "WITH dept_avg AS (\n  SELECT dept_name, AVG(salary) AS avg_sal\n  FROM instructor\n  GROUP BY dept_name\n)\nSELECT MAX(avg_sal) AS max_avg_sal\nFROM dept_avg;",
          example: { query: "WITH dept_avg AS (\n  SELECT dept_name, AVG(salary) AS avg_sal\n  FROM instructor\n  GROUP BY dept_name\n)\nSELECT MAX(avg_sal) AS max_avg_sal\nFROM dept_avg;", note: 'First compute AVG per department, then MAX over those averages. Two-step aggregation in one query.' }
        },
        narrative: 'Find the maximum of all departmental average salaries.',
        task: 'Use WITH: compute dept-level AVG(salary) as avg_sal, then SELECT <strong>MAX(avg_sal)</strong> as max_avg_sal from that CTE.',
        solution: 'WITH dept_avg AS (SELECT dept_name, AVG(salary) AS avg_sal FROM instructor GROUP BY dept_name) SELECT MAX(avg_sal) AS max_avg_sal FROM dept_avg;',
        isDML: false,
        hints: ['CTE computes AVG per department.', 'Main query takes MAX of those averages.', 'WITH dept_avg AS (SELECT dept_name, AVG(salary) AS avg_sal FROM instructor GROUP BY dept_name) SELECT MAX(avg_sal) AS max_avg_sal FROM dept_avg;']
      }
    ]
  }
];
