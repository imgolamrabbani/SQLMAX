// World 2 — UniVerse I (University schema)
// Topics: UNION, INTERSECT, EXCEPT, NULL, Aggregates, GROUP BY, HAVING, NATURAL JOIN, String ops
const WORLD2_LEVELS = [
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
        narrative: 'The registrar wants a complete list of all courses offered across the last two semesters.',
        task: 'Find all courses that were offered in <strong>Fall 2019</strong> or <strong>Spring 2020</strong> (or both). Return each course ID once only.',
        solution: "SELECT course_id FROM section WHERE semester='Fall' AND year=2019 UNION SELECT course_id FROM section WHERE semester='Spring' AND year=2020;",
        isDML: false,
        hints: ['You need to combine results from two separate queries.', 'Use a set operation that merges both result sets and removes duplicates.', "SELECT course_id FROM section WHERE semester='Fall' AND year=2019 UNION SELECT course_id FROM section WHERE semester='Spring' AND year=2020;"]
      },
      {
        id: 'w2l1s2', title: 'INTERSECT', badge: '🟣',
        difficulty: 'MEDIUM', xp: 60, concept: 'INTERSECT',
        schema: 'university',
        tutorial: {
          concept: 'INTERSECT returns rows that appear in BOTH queries. Like a Venn diagram overlap. Duplicates removed.',
          syntax: 'SELECT col FROM A\nINTERSECT\nSELECT col FROM B;',
          example: { query: "SELECT course_id FROM section\nWHERE semester='Fall' AND year=2019\nINTERSECT\nSELECT course_id FROM section\nWHERE semester='Spring' AND year=2020;", note: 'Only courses offered in BOTH semesters.' }
        },
        narrative: 'The dean wants to know which courses ran consistently across both semesters.',
        task: 'Find courses that were offered in <strong>both</strong> Fall 2019 <strong>and</strong> Spring 2020.',
        solution: "SELECT course_id FROM section WHERE semester='Fall' AND year=2019 INTERSECT SELECT course_id FROM section WHERE semester='Spring' AND year=2020;",
        isDML: false,
        hints: ['You need only the common results from both queries.', 'Use a set operation that keeps only what appears in both.', "SELECT course_id FROM section WHERE semester='Fall' AND year=2019 INTERSECT SELECT course_id FROM section WHERE semester='Spring' AND year=2020;"]
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
        narrative: 'Some courses were discontinued after Fall 2019. Find them.',
        task: 'Find courses that were offered in Fall 2019 but were <strong>not</strong> offered in Spring 2020.',
        solution: "SELECT course_id FROM section WHERE semester='Fall' AND year=2019 EXCEPT SELECT course_id FROM section WHERE semester='Spring' AND year=2020;",
        isDML: false,
        hints: ['You need the difference between two result sets.', 'Use a set operation that subtracts the second result from the first.', "SELECT course_id FROM section WHERE semester='Fall' AND year=2019 EXCEPT SELECT course_id FROM section WHERE semester='Spring' AND year=2020;"]
      }
    ]
  },

  {
    id: 'w2l2', title: 'Null Traps', icon: '❓', xpReward: 150,
    sublevels: [
      {
        id: 'w2l2s1', title: 'NULL in Aggregates', badge: '🟠',
        difficulty: 'MEDIUM', xp: 55, concept: 'NULL + Aggregates',
        schema: 'university',
        tutorial: {
          concept: 'COUNT(*) counts all rows including NULLs. COUNT(col) ignores NULL values in that column. SUM, AVG, MAX, MIN all ignore NULLs.',
          syntax: 'SELECT COUNT(*)     -- includes NULL rows\n       COUNT(grade)  -- ignores NULL grades\n       AVG(salary)   -- ignores NULL salaries\nFROM table;',
          example: { query: 'SELECT COUNT(*) AS total_enrollments,\n       COUNT(grade) AS graded_enrollments\nFROM takes;', note: 'COUNT(*) counts that row; COUNT(grade) does not when grade is NULL.' }
        },
        narrative: 'The examinations office needs to compare total enrolments against how many have been graded.',
        task: 'How many total enrolment records exist, and of those, how many actually have a grade assigned? Label the results <strong>total_enrollments</strong> and <strong>graded_enrollments</strong>.',
        solution: 'SELECT COUNT(*) AS total_enrollments, COUNT(grade) AS graded_enrollments FROM takes;',
        isDML: false,
        hints: ['COUNT(*) includes rows with NULL, COUNT(column) does not.', 'Both counts come from the takes table in the same query.', 'SELECT COUNT(*) AS total_enrollments, COUNT(grade) AS graded_enrollments FROM takes;']
      },
      {
        id: 'w2l2s2', title: 'IS NULL check', badge: '⚫',
        difficulty: 'EASY', xp: 45, concept: 'IS NULL in practice',
        schema: 'university',
        tutorial: {
          concept: 'Use IS NULL to find rows with missing values. Never use = NULL — it always fails because NULL is not equal to anything, not even itself.',
          syntax: 'WHERE col IS NULL\nWHERE col IS NOT NULL',
          example: { query: 'SELECT ID, course_id, grade\nFROM takes\nWHERE grade IS NULL;', note: 'Finds students with ungraded records.' }
        },
        narrative: 'The grading system flagged some student records as incomplete.',
        task: 'Find all students whose result has not been recorded yet — show their <strong>ID</strong>, <strong>course_id</strong>, and <strong>grade</strong>.',
        solution: 'SELECT ID, course_id, grade FROM takes WHERE grade IS NULL;',
        isDML: false,
        hints: ['A missing grade is stored as NULL — not as 0 or empty string.', 'Never use = NULL in SQL.', 'SELECT ID, course_id, grade FROM takes WHERE grade IS NULL;']
      }
    ]
  },

  {
    id: 'w2l3', title: 'Aggregate Clinic', icon: '📊', xpReward: 200,
    sublevels: [
      {
        id: 'w2l3s1', title: 'Aggregate Functions', badge: '🟠',
        difficulty: 'MEDIUM', xp: 55, concept: 'COUNT, SUM, AVG, MAX, MIN',
        schema: 'university',
        tutorial: {
          concept: 'Aggregate functions collapse many rows into a single value. Cannot mix with non-aggregate columns unless using GROUP BY.',
          syntax: 'SELECT COUNT(*)    -- count all rows\n       COUNT(col)   -- count non-null\n       SUM(col)     -- total\n       AVG(col)     -- average\n       MAX(col)     -- largest\n       MIN(col)     -- smallest\nFROM table;',
          example: { query: 'SELECT AVG(salary) AS avg_salary\nFROM instructor;', note: 'Returns one row: the average salary across all instructors.' }
        },
        narrative: 'The board of directors wants a snapshot of instructor salaries.',
        task: 'Calculate the <strong>average</strong>, <strong>highest</strong>, and <strong>lowest</strong> salary among all instructors. Label the results <strong>avg_salary</strong>, <strong>max_salary</strong>, and <strong>min_salary</strong>.',
        solution: 'SELECT AVG(salary) AS avg_salary, MAX(salary) AS max_salary, MIN(salary) AS min_salary FROM instructor;',
        isDML: false,
        hints: ['Three aggregate functions in a single SELECT.', 'Give each an alias using AS.', 'SELECT AVG(salary) AS avg_salary, MAX(salary) AS max_salary, MIN(salary) AS min_salary FROM instructor;']
      },
      {
        id: 'w2l3s2', title: 'COUNT DISTINCT', badge: '🔵',
        difficulty: 'MEDIUM', xp: 55, concept: 'COUNT(DISTINCT col)',
        schema: 'university',
        tutorial: {
          concept: 'COUNT(DISTINCT col) counts how many UNIQUE non-null values exist. Different from COUNT(col) which counts all non-null values including duplicates.',
          syntax: 'SELECT COUNT(DISTINCT col)\nFROM table;\n\n-- vs:\nSELECT COUNT(col)  -- counts duplicates too\nFROM table;',
          example: { query: 'SELECT COUNT(DISTINCT dept_name) AS num_depts\nFROM instructor;', note: 'Counts unique departments represented among instructors.' }
        },
        narrative: 'The university wants to know how many departments have at least one instructor.',
        task: 'How many <strong>distinct departments</strong> are represented among the instructors? Label the result <strong>dept_count</strong>.',
        solution: 'SELECT COUNT(DISTINCT dept_name) AS dept_count FROM instructor;',
        isDML: false,
        hints: ['Counting distinct values is different from counting all values.', 'Use DISTINCT inside COUNT().', 'SELECT COUNT(DISTINCT dept_name) AS dept_count FROM instructor;']
      },
      {
        id: 'w2l3s3', title: 'GROUP BY', badge: '🟢',
        difficulty: 'MEDIUM', xp: 65, concept: 'GROUP BY',
        schema: 'university',
        tutorial: {
          concept: 'GROUP BY groups rows with the same value, then applies aggregates per group. RULE: Every non-aggregate column in SELECT must appear in GROUP BY.',
          syntax: 'SELECT col, COUNT(*)\nFROM table\nGROUP BY col;\n\n-- col must be in both SELECT and GROUP BY',
          example: { query: 'SELECT dept_name, AVG(salary)\nFROM instructor\nGROUP BY dept_name;', note: 'One row per department showing the average salary for that department.' }
        },
        narrative: 'HR needs a breakdown of average pay across every department.',
        task: 'For each department, calculate the average salary of its instructors. Show the <strong>department name</strong> and the <strong>average salary</strong> labelled as <strong>avg_salary</strong>.',
        solution: 'SELECT dept_name, AVG(salary) AS avg_salary FROM instructor GROUP BY dept_name;',
        isDML: false,
        hints: ['Group the instructors by department first.', 'Then compute the average salary within each group.', 'SELECT dept_name, AVG(salary) AS avg_salary FROM instructor GROUP BY dept_name;']
      },
      {
        id: 'w2l3s4', title: 'HAVING', badge: '🔴',
        difficulty: 'HARD', xp: 75, concept: 'HAVING (filter groups)',
        schema: 'university',
        tutorial: {
          concept: 'HAVING filters GROUPS after GROUP BY. WHERE filters rows BEFORE grouping. Use HAVING for conditions on aggregate functions.',
          syntax: 'SELECT col, AVG(val)\nFROM table\nGROUP BY col\nHAVING AVG(val) > threshold;\n\n-- Order: WHERE → GROUP BY → HAVING → ORDER BY',
          example: { query: 'SELECT dept_name, AVG(salary)\nFROM instructor\nGROUP BY dept_name\nHAVING AVG(salary) > 42000;', note: 'Only departments with average salary ABOVE 42000 appear.' }
        },
        narrative: 'The finance committee wants to identify high-paying departments only.',
        task: 'List departments where the <strong>average instructor salary exceeds 80,000</strong>. Show the department name and its average salary labelled <strong>avg_salary</strong>.',
        solution: 'SELECT dept_name, AVG(salary) AS avg_salary FROM instructor GROUP BY dept_name HAVING AVG(salary) > 80000;',
        isDML: false,
        hints: ['First group by department, then filter the groups by their average salary.', 'You cannot use WHERE to filter on an aggregate — use HAVING instead.', 'SELECT dept_name, AVG(salary) AS avg_salary FROM instructor GROUP BY dept_name HAVING AVG(salary) > 80000;']
      }
    ]
  },

  {
    id: 'w2l4', title: 'Joins & Strings', icon: '🔗', xpReward: 180,
    sublevels: [
      {
        id: 'w2l4s1', title: 'Natural Join', badge: '🟡',
        difficulty: 'MEDIUM', xp: 60, concept: 'NATURAL JOIN',
        schema: 'university',
        tutorial: {
          concept: 'NATURAL JOIN automatically matches columns with the SAME NAME in both tables. The result contains only one copy of the common column.',
          syntax: 'SELECT col1, col2\nFROM table1 NATURAL JOIN table2;\n\n-- Equivalent to:\nFROM table1, table2\nWHERE table1.col = table2.col',
          example: { query: 'SELECT name, course_id\nFROM instructor NATURAL JOIN teaches;', note: 'instructor.ID = teaches.ID matched automatically.' }
        },
        narrative: 'The department wants to see which instructors are assigned to which courses.',
        task: 'List the <strong>name</strong> of each instructor alongside the <strong>course_id</strong> of every course they teach.',
        solution: 'SELECT name, course_id FROM instructor NATURAL JOIN teaches;',
        isDML: false,
        hints: ['You need columns from two related tables.', 'Both tables share a common column — the join can happen automatically.', 'SELECT name, course_id FROM instructor NATURAL JOIN teaches;']
      },
      {
        id: 'w2l4s2', title: 'String Operations', badge: '🟠',
        difficulty: 'MEDIUM', xp: 60, concept: 'UPPER, LOWER, LIKE with _',
        schema: 'university',
        tutorial: {
          concept: 'SQL has string functions: UPPER(s), LOWER(s). LIKE uses % (any chars) and _ (exactly one char). Use LOWER() for case-insensitive matching.',
          syntax: "UPPER(name)       -- Uppercase\nLOWER(name)       -- Lowercase\n\n-- Underscore in LIKE:\nLIKE '_a%'        -- 2nd char is 'a'\nLIKE '_ _ _'     -- exactly 3 chars",
          example: { query: "SELECT name FROM instructor\nWHERE LOWER(name) LIKE '%in%';", note: "Case-insensitive search: finds 'Srinivasan' and 'Einstein'." }
        },
        narrative: 'A student is trying to find instructors but can only remember part of their name.',
        task: 'Find all instructors whose name <strong>contains the letters "in"</strong>, regardless of capitalisation.',
        solution: "SELECT name FROM instructor WHERE LOWER(name) LIKE '%in%';",
        isDML: false,
        hints: ["Use a string function to make the comparison case-insensitive.", "The % wildcard matches any characters before or after 'in'.", "SELECT name FROM instructor WHERE LOWER(name) LIKE '%in%';"]
      }
    ]
  }
];
