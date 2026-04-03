// World 2 — UniVerse (University schema — textbook data)
// Topics: UNION/INTERSECT/EXCEPT, Aggregates, GROUP BY, HAVING, Natural Join, String ops
// All solution queries verified against SCHEMA_UNIVERSITY data
const WORLD2_LEVELS = [
  // ── LEVEL 1: Set Operations ────────────────────────────────────────────
  {
    id: 'w2l1', title: 'Set Operations', icon: '🔀', xpReward: 170,
    sublevels: [
      {
        id: 'w2l1s1', title: 'UNION', badge: '🔵',
        difficulty: 'MEDIUM', xp: 55, concept: 'UNION',
        schema: 'university',
        tutorial: {
          concept: 'UNION combines two SELECT results into one, automatically removing duplicates. UNION ALL keeps duplicates. Both queries must have the same number of columns.',
          syntax: 'SELECT col FROM A\nUNION\nSELECT col FROM B;\n\n-- Keep duplicates:\nSELECT col FROM A\nUNION ALL\nSELECT col FROM B;',
          example: { query: "SELECT course_id FROM section\nWHERE semester='Fall' AND year=2019\nUNION\nSELECT course_id FROM section\nWHERE semester='Spring' AND year=2020;", note: 'All courses offered in either semester — duplicates removed automatically.' }
        },
        narrative: 'List all courses offered in either Fall 2019 OR Spring 2020.',
        task: 'Use UNION to find all <strong>course_id</strong> values from section in Fall 2019 OR Spring 2020.',
        solution: "SELECT course_id FROM section WHERE semester='Fall' AND year=2019 UNION SELECT course_id FROM section WHERE semester='Spring' AND year=2020;",
        isDML: false,
        hints: ['Two SELECT statements joined by UNION.', 'One for Fall 2019, one for Spring 2020.', "SELECT course_id FROM section WHERE semester='Fall' AND year=2019 UNION SELECT course_id FROM section WHERE semester='Spring' AND year=2020;"]
      },
      {
        id: 'w2l1s2', title: 'INTERSECT', badge: '🟣',
        difficulty: 'MEDIUM', xp: 60, concept: 'INTERSECT',
        schema: 'university',
        tutorial: {
          concept: 'INTERSECT returns rows that appear in BOTH queries. Like a Venn diagram overlap. Duplicates removed.',
          syntax: 'SELECT col FROM A\nINTERSECT\nSELECT col FROM B;',
          example: { query: "SELECT course_id FROM section\nWHERE semester='Fall' AND year=2019\nINTERSECT\nSELECT course_id FROM section\nWHERE semester='Spring' AND year=2020;", note: 'Only courses offered in BOTH semesters — CS-101, PHY-101, CS-319 in our data.' }
        },
        narrative: 'Find courses offered in BOTH Fall 2019 AND Spring 2020.',
        task: 'Use INTERSECT to find <strong>course_id</strong> in section for BOTH <strong>Fall 2019</strong> AND <strong>Spring 2020</strong>.',
        solution: "SELECT course_id FROM section WHERE semester='Fall' AND year=2019 INTERSECT SELECT course_id FROM section WHERE semester='Spring' AND year=2020;",
        isDML: false,
        hints: ['INTERSECT keeps only common values.', 'One SELECT per semester.', "SELECT course_id FROM section WHERE semester='Fall' AND year=2019 INTERSECT SELECT course_id FROM section WHERE semester='Spring' AND year=2020;"]
      },
      {
        id: 'w2l1s3', title: 'EXCEPT', badge: '🔴',
        difficulty: 'MEDIUM', xp: 60, concept: 'EXCEPT',
        schema: 'university',
        tutorial: {
          concept: 'EXCEPT returns rows in the FIRST query but NOT in the second. Order matters: A EXCEPT B ≠ B EXCEPT A.',
          syntax: 'SELECT col FROM A\nEXCEPT\nSELECT col FROM B;\n-- Returns rows in A not in B',
          example: { query: "SELECT course_id FROM section\nWHERE semester='Fall' AND year=2019\nEXCEPT\nSELECT course_id FROM section\nWHERE semester='Spring' AND year=2020;", note: 'Courses in Fall 2019 that were NOT offered in Spring 2020.' }
        },
        narrative: 'Find courses in Fall 2019 but NOT in Spring 2020.',
        task: 'Use EXCEPT to find <strong>course_id</strong> in section for Fall 2019 but NOT Spring 2020.',
        solution: "SELECT course_id FROM section WHERE semester='Fall' AND year=2019 EXCEPT SELECT course_id FROM section WHERE semester='Spring' AND year=2020;",
        isDML: false,
        hints: ['EXCEPT is set subtraction.', 'First SELECT: Fall 2019. Second: Spring 2020.', "SELECT course_id FROM section WHERE semester='Fall' AND year=2019 EXCEPT SELECT course_id FROM section WHERE semester='Spring' AND year=2020;"]
      }
    ]
  },

  // ── LEVEL 2: NULL values (from lecture page on NULLs)────────────────
  {
    id: 'w2l2', title: 'Null Traps', icon: '❓', xpReward: 150,
    sublevels: [
      {
        id: 'w2l2s1', title: 'NULL in Aggregates', badge: '🟠',
        difficulty: 'MEDIUM', xp: 55, concept: 'NULL + Aggregates',
        schema: 'university',
        tutorial: {
          concept: 'COUNT(*) counts all rows including NULLs. COUNT(col) ignores NULL values in that column. SUM, AVG, MAX, MIN all ignore NULLs. A column of all-NULLs gives NULL, not 0.',
          syntax: 'SELECT COUNT(*)     -- includes NULL rows\n       COUNT(grade)  -- ignores NULL grades\n       AVG(salary)   -- ignores NULL salaries\nFROM table;',
          example: { query: 'SELECT COUNT(*) AS total_enrollments,\n       COUNT(grade) AS graded_enrollments\nFROM takes;', note: 'In our data, 98988 has a NULL grade in BIO-301. COUNT(*) counts that row; COUNT(grade) does not.' }
        },
        narrative: 'How many enrollment records have a grade vs. total records?',
        task: 'Show <strong>COUNT(*)</strong> as total_enrollments and <strong>COUNT(grade)</strong> as graded_enrollments from takes.',
        solution: 'SELECT COUNT(*) AS total_enrollments, COUNT(grade) AS graded_enrollments FROM takes;',
        isDML: false,
        hints: ['COUNT(*) counts all rows, COUNT(grade) skips NULL grades.', 'Both in one SELECT from takes.', 'SELECT COUNT(*) AS total_enrollments, COUNT(grade) AS graded_enrollments FROM takes;']
      },
      {
        id: 'w2l2s2', title: 'IS NULL check', badge: '⚫',
        difficulty: 'EASY', xp: 45, concept: 'IS NULL in practice',
        schema: 'university',
        tutorial: {
          concept: 'Use IS NULL to find rows with missing values. Never use = NULL — it always fails because NULL is not equal to anything, not even itself.',
          syntax: 'WHERE col IS NULL\nWHERE col IS NOT NULL',
          example: { query: 'SELECT ID, course_id, grade\nFROM takes\nWHERE grade IS NULL;', note: 'Finds students with ungraded records — in our data, student 98988 in BIO-301.' }
        },
        narrative: 'Find students whose grade was not recorded yet.',
        task: 'Show <strong>ID</strong>, <strong>course_id</strong>, <strong>grade</strong> from takes where <strong>grade IS NULL</strong>.',
        solution: 'SELECT ID, course_id, grade FROM takes WHERE grade IS NULL;',
        isDML: false,
        hints: ['Use IS NULL, never = NULL.', 'Table is takes.', 'SELECT ID, course_id, grade FROM takes WHERE grade IS NULL;']
      }
    ]
  },

  // ── LEVEL 3: Aggregates + GROUP BY + HAVING ──────────────────────────
  {
    id: 'w2l3', title: 'Aggregate Clinic', icon: '📊', xpReward: 200,
    sublevels: [
      {
        id: 'w2l3s1', title: 'Aggregate Functions', badge: '🟠',
        difficulty: 'MEDIUM', xp: 55, concept: 'COUNT, SUM, AVG, MAX, MIN',
        schema: 'university',
        tutorial: {
          concept: 'Aggregate functions collapse many rows into a single value. Used in SELECT. Cannot mix with non-aggregate columns unless using GROUP BY.',
          syntax: 'SELECT COUNT(*)    -- count all rows\n       COUNT(col)   -- count non-null\n       SUM(col)     -- total\n       AVG(col)     -- average\n       MAX(col)     -- largest\n       MIN(col)     -- smallest\nFROM table;',
          example: { query: 'SELECT AVG(salary) AS avg_salary\nFROM instructor;', note: 'Returns one row: the average salary across all instructors.' }
        },
        narrative: 'Give the board a salary overview.',
        task: 'Show <strong>AVG(salary)</strong> as avg_salary, <strong>MAX(salary)</strong> as max_salary, <strong>MIN(salary)</strong> as min_salary from instructor.',
        solution: 'SELECT AVG(salary) AS avg_salary, MAX(salary) AS max_salary, MIN(salary) AS min_salary FROM instructor;',
        isDML: false,
        hints: ['Three aggregate functions in one SELECT.', 'Give each an alias with AS.', 'SELECT AVG(salary) AS avg_salary, MAX(salary) AS max_salary, MIN(salary) AS min_salary FROM instructor;']
      },
      {
        id: 'w2l3s2', title: 'COUNT DISTINCT', badge: '🔵',
        difficulty: 'MEDIUM', xp: 55, concept: 'COUNT(DISTINCT col)',
        schema: 'university',
        tutorial: {
          concept: 'COUNT(DISTINCT col) counts how many UNIQUE non-null values exist. Different from COUNT(col) which counts all non-null values including duplicates.',
          syntax: 'SELECT COUNT(DISTINCT col)\nFROM table;\n\n-- vs:\nSELECT COUNT(col)  -- counts duplicates too\nFROM table;',
          example: { query: 'SELECT COUNT(DISTINCT dept_name) AS num_depts\nFROM instructor;', note: 'Counts unique departments represented among instructors — not the total number of instructor rows.' }
        },
        narrative: 'How many distinct departments teach courses?',
        task: 'Show <strong>COUNT(DISTINCT dept_name)</strong> as dept_count from instructor.',
        solution: 'SELECT COUNT(DISTINCT dept_name) AS dept_count FROM instructor;',
        isDML: false,
        hints: ['Put DISTINCT inside COUNT().', 'Table is instructor, column is dept_name.', 'SELECT COUNT(DISTINCT dept_name) AS dept_count FROM instructor;']
      },
      {
        id: 'w2l3s3', title: 'GROUP BY', badge: '🟢',
        difficulty: 'MEDIUM', xp: 65, concept: 'GROUP BY',
        schema: 'university',
        tutorial: {
          concept: 'GROUP BY groups rows with the same value, then applies aggregates per group. RULE: Every non-aggregate column in SELECT must appear in GROUP BY.',
          syntax: 'SELECT col, COUNT(*)\nFROM table\nGROUP BY col;\n\n-- col must be in both SELECT and GROUP BY',
          example: { query: 'SELECT dept_name, AVG(salary)\nFROM instructor\nGROUP BY dept_name;', note: 'One row per department. Each shows the average salary for that department.' }
        },
        narrative: 'Show average salary per department.',
        task: 'Show <strong>dept_name</strong> and <strong>AVG(salary)</strong> as avg_salary from instructor, grouped by dept_name.',
        solution: 'SELECT dept_name, AVG(salary) AS avg_salary FROM instructor GROUP BY dept_name;',
        isDML: false,
        hints: ['GROUP BY dept_name groups instructors into departments.', 'AVG(salary) is computed per group.', 'SELECT dept_name, AVG(salary) AS avg_salary FROM instructor GROUP BY dept_name;']
      },
      {
        id: 'w2l3s4', title: 'HAVING', badge: '🔴',
        difficulty: 'HARD', xp: 75, concept: 'HAVING (filter groups)',
        schema: 'university',
        tutorial: {
          concept: 'HAVING filters GROUPS after GROUP BY. WHERE filters individual rows BEFORE grouping. Use HAVING for conditions on aggregate functions.',
          syntax: 'SELECT col, AVG(val)\nFROM table\nGROUP BY col\nHAVING AVG(val) > threshold;\n\n-- Execution order:\n-- WHERE → GROUP BY → HAVING → ORDER BY',
          example: { query: 'SELECT dept_name, AVG(salary)\nFROM instructor\nGROUP BY dept_name\nHAVING AVG(salary) > 42000;', note: 'Only departments with average salary ABOVE 42000. WHERE cannot do this — it runs before grouping.' }
        },
        narrative: 'Find departments with average salary above 80000.',
        task: 'Show <strong>dept_name</strong> and <strong>AVG(salary)</strong> as avg_salary from instructor GROUP BY dept_name HAVING <strong>AVG(salary) > 80000</strong>.',
        solution: 'SELECT dept_name, AVG(salary) AS avg_salary FROM instructor GROUP BY dept_name HAVING AVG(salary) > 80000;',
        isDML: false,
        hints: ['HAVING comes after GROUP BY.', 'HAVING AVG(salary) > 80000 filters groups.', 'SELECT dept_name, AVG(salary) AS avg_salary FROM instructor GROUP BY dept_name HAVING AVG(salary) > 80000;']
      }
    ]
  },

  // ── LEVEL 4: Natural Join + String ops (from lecture slides) ─────────
  {
    id: 'w2l4', title: 'Joins & Strings', icon: '🔗', xpReward: 180,
    sublevels: [
      {
        id: 'w2l4s1', title: 'Natural Join', badge: '🟡',
        difficulty: 'MEDIUM', xp: 60, concept: 'NATURAL JOIN',
        schema: 'university',
        tutorial: {
          concept: 'NATURAL JOIN automatically matches columns with the SAME NAME in both tables. The result contains only one copy of the common column. Simpler than writing the ON condition manually.',
          syntax: 'SELECT col1, col2\nFROM table1 NATURAL JOIN table2;\n\n-- Equivalent to:\nFROM table1, table2\nWHERE table1.col = table2.col',
          example: { query: 'SELECT name, course_id\nFROM instructor NATURAL JOIN teaches;', note: 'instructor.ID = teaches.ID matched automatically. No WHERE needed.' }
        },
        narrative: 'Show each instructor name with the courses they teach — using NATURAL JOIN.',
        task: 'Show <strong>name</strong> and <strong>course_id</strong> from instructor NATURAL JOIN teaches.',
        solution: 'SELECT name, course_id FROM instructor NATURAL JOIN teaches;',
        isDML: false,
        hints: ['NATURAL JOIN matches the ID column automatically (same name in both tables).', 'No WHERE clause needed.', 'SELECT name, course_id FROM instructor NATURAL JOIN teaches;']
      },
      {
        id: 'w2l4s2', title: 'String Operations', badge: '🟠',
        difficulty: 'MEDIUM', xp: 60, concept: 'UPPER, LOWER, LIKE with _',
        schema: 'university',
        tutorial: {
          concept: 'SQL has string functions: UPPER(s), LOWER(s). LIKE uses % (any chars) and _ (exactly one char). String concatenation: || operator in SQLite/PostgreSQL.',
          syntax: "UPPER(name)       -- Uppercase\nLOWER(name)       -- Lowercase\n\n-- Underscore in LIKE:\nLIKE '_a%'        -- 2nd char is 'a'\nLIKE '_ _ _'     -- exactly 3 chars",
          example: { query: "SELECT name FROM instructor\nWHERE LOWER(name) LIKE '%in%';", note: "Case-insensitive search: finds 'Srinivasan' and 'Einstein'." }
        },
        narrative: "Find instructor names containing 'in' (case-insensitive).",
        task: "Show <strong>name</strong> from instructor where <strong>LOWER(name) LIKE '%in%'</strong>.",
        solution: "SELECT name FROM instructor WHERE LOWER(name) LIKE '%in%';",
        isDML: false,
        hints: ["LOWER() converts to lowercase before comparing.", "LIKE '%in%' means 'in' anywhere in the string.", "SELECT name FROM instructor WHERE LOWER(name) LIKE '%in%';"]
      }
    ]
  }
];
