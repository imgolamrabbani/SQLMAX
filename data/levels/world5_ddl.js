// World 5 — DDL Workshop (University schema)
const WORLD5_LEVELS = [
  {
    id: 'w5l1', title: 'Schema Architect', icon: '🏗️', xpReward: 200,
    sublevels: [
      {
        id: 'w5l1s1', title: 'CREATE TABLE', badge: '🟢',
        difficulty: 'MEDIUM', xp: 65, concept: 'CREATE TABLE',
        schema: 'university',
        tutorial: {
          concept: 'CREATE TABLE defines a new table. You specify each column with a name and a data type. Common types: INT or INTEGER (whole numbers), REAL (decimals), TEXT or VARCHAR(n) (strings), DATE (date only).',
          syntax: "CREATE TABLE table_name (\n  col1  DATA_TYPE,\n  col2  DATA_TYPE,\n  col3  DATA_TYPE\n);\n\n-- Types:\n-- INT / INTEGER   → whole numbers\n-- REAL / FLOAT   → decimals\n-- TEXT / VARCHAR → strings\n-- DATE           → date values",
          example: { query: "CREATE TABLE grade_report (\n  student_id INT,\n  course_id  TEXT,\n  grade      TEXT\n);", note: "Creates a new empty table. Nothing is inserted — just the structure is defined." }
        },
        narrative: 'The registrar needs a new table to store grade reports.',
        task: 'Create a table named <strong>grade_report</strong> with three columns: <strong>student_id</strong> (integer), <strong>course_id</strong> (text), and <strong>grade</strong> (text). Then verify the table was created by checking the database schema.',
        solution: "CREATE TABLE grade_report (student_id INT, course_id TEXT, grade TEXT); SELECT name FROM sqlite_master WHERE type='table' AND name='grade_report';",
        isDML: false,
        hints: ['Use CREATE TABLE, followed by the table name and column definitions in parentheses.', 'Each column needs a name and a data type.', "CREATE TABLE grade_report (student_id INT, course_id TEXT, grade TEXT); SELECT name FROM sqlite_master WHERE type='table' AND name='grade_report';"]
      },
      {
        id: 'w5l1s2', title: 'NOT NULL Constraint', badge: '🟠',
        difficulty: 'MEDIUM', xp: 65, concept: 'NOT NULL',
        schema: 'university',
        tutorial: {
          concept: 'NOT NULL prevents a column from ever storing a NULL (missing) value. Adding it forces every INSERT to provide a real value for that column.',
          syntax: "CREATE TABLE table_name (\n  col1  TEXT    NOT NULL,  -- required!\n  col2  INTEGER,           -- allows NULL\n  col3  REAL    NOT NULL   -- required!\n);\n\n-- NOT NULL at definition time only\n-- Cannot be bypassed by INSERT",
          example: { query: "CREATE TABLE employee_contacts (\n  emp_id  INT  NOT NULL,\n  phone   TEXT NOT NULL,\n  email   TEXT\n);", note: 'emp_id and phone are mandatory. email is optional (can be NULL).' }
        },
        narrative: 'Inspect what NOT NULL constraints already exist in the instructor table.',
        task: 'Examine the column definitions of the <strong>instructor</strong> table and show the constraint information. Look at the <strong>notnull</strong> column — a value of 1 means that column requires a value.',
        solution: 'PRAGMA table_info(instructor);',
        isDML: false,
        hints: ['SQLite has a PRAGMA command that reveals table structure.', "Try: PRAGMA table_info(instructor);", 'PRAGMA table_info(instructor);']
      },
      {
        id: 'w5l1s3', title: 'PRIMARY KEY', badge: '🔑',
        difficulty: 'MEDIUM', xp: 70, concept: 'PRIMARY KEY constraint',
        schema: 'university',
        tutorial: {
          concept: 'PRIMARY KEY uniquely identifies each row. It is automatically NOT NULL and UNIQUE. A table can have only one primary key. Composite primary keys span multiple columns.',
          syntax: "-- Single column PK:\nCREATE TABLE students (\n  student_id INT PRIMARY KEY,\n  name TEXT NOT NULL\n);\n\n-- Composite PK:\nCREATE TABLE enrolment (\n  student_id INT,\n  course_id  TEXT,\n  PRIMARY KEY (student_id, course_id)\n);",
          example: { query: "PRAGMA table_info(takes);", note: 'The pk column shows which columns form the primary key. pk=1 is the first PK column, pk=2 is second, etc.' }
        },
        narrative: 'Examine the takes table to understand its composite primary key structure.',
        task: 'Show the full column information for the <strong>takes</strong> table. Identify which columns form the primary key by looking at the <strong>pk</strong> column in the result.',
        solution: 'PRAGMA table_info(takes);',
        isDML: false,
        hints: ['SQLite stores constraint details in table_info.', 'The pk column value tells you the position in the composite key.', 'PRAGMA table_info(takes);']
      },
      {
        id: 'w5l1s4', title: 'FOREIGN KEY', badge: '🔗',
        difficulty: 'HARD', xp: 75, concept: 'FOREIGN KEY',
        schema: 'university',
        tutorial: {
          concept: 'FOREIGN KEY enforces referential integrity — a value in child table must exist in the parent table. REFERENCES says which table and column.',
          syntax: "CREATE TABLE child_table (\n  id         INT PRIMARY KEY,\n  parent_id  INT,\n  FOREIGN KEY (parent_id)\n    REFERENCES parent_table(id)\n);",
          example: { query: "SELECT instructor.name, department.dept_name\nFROM instructor\nJOIN department\n  ON instructor.dept_name = department.dept_name\nORDER BY dept_name;", note: 'This works because FOREIGN KEY guarantees every instructor.dept_name exists in department.' }
        },
        narrative: 'The foreign key between instructor and department ensures data consistency. Demonstrate it by joining them.',
        task: 'List each instructor\'s <strong>name</strong> alongside their <strong>department name</strong>, sorted alphabetically by department.',
        solution: 'SELECT instructor.name, department.dept_name FROM instructor JOIN department ON instructor.dept_name = department.dept_name ORDER BY dept_name;',
        isDML: false,
        hints: ['Join the instructor and department tables — they share the dept_name column.', 'Sort the result alphabetically by department name.', 'SELECT instructor.name, department.dept_name FROM instructor JOIN department ON instructor.dept_name = department.dept_name ORDER BY dept_name;']
      },
      {
        id: 'w5l1s5', title: 'CHECK & DEFAULT', badge: '✅',
        difficulty: 'HARD', xp: 75, concept: 'CHECK and DEFAULT',
        schema: 'university',
        tutorial: {
          concept: 'CHECK adds a validation rule — INSERTs that violate it are rejected. DEFAULT provides a fallback value when INSERT omits the column.',
          syntax: "CREATE TABLE table_name (\n  credits INT CHECK (credits >= 0),\n  type    TEXT DEFAULT 'Lecture'\n);\n\n-- CHECK: condition must be TRUE for insert\n-- DEFAULT: used when column is omitted",
          example: { query: "SELECT name, salary\nFROM instructor\nWHERE salary > 40000\nORDER BY salary ASC;", note: 'Demonstrates querying constrained data — salary has a CHECK constraint in real schemas.' }
        },
        narrative: 'Audit instructor salaries to confirm they meet the minimum threshold defined by schema constraints.',
        task: 'List the <strong>name</strong> and <strong>salary</strong> of all instructors whose salary is above <strong>40,000</strong>, sorted from lowest to highest.',
        solution: 'SELECT name, salary FROM instructor WHERE salary > 40000 ORDER BY salary ASC;',
        isDML: false,
        hints: ['Filter instructors by salary, then sort the result.', 'Ascending order means smallest first.', 'SELECT name, salary FROM instructor WHERE salary > 40000 ORDER BY salary ASC;']
      },
      {
        id: 'w5l1s6', title: 'Schema Review', badge: '🏆',
        difficulty: 'HARD', xp: 80, concept: 'Schema-level queries',
        schema: 'university',
        tutorial: {
          concept: 'After designing a schema, you often need to query across tables to verify it works correctly.',
          syntax: "-- count sections per semester:\nSELECT semester, COUNT(*)\nFROM section\nGROUP BY semester\nORDER BY COUNT(*) DESC;",
          example: { query: 'SELECT semester, COUNT(*) AS section_count\nFROM section\nGROUP BY semester\nORDER BY section_count DESC;', note: 'Shows which semesters had the most sections — a useful schema audit.' }
        },
        narrative: 'Final exam prep — audit which semester runs the most sections in the university.',
        task: 'Count how many sections were offered in each <strong>semester</strong>. Show the semester and the count labelled <strong>section_count</strong>, sorted from the semester with the most sections to the fewest.',
        solution: 'SELECT semester, COUNT(*) AS section_count FROM section GROUP BY semester ORDER BY section_count DESC;',
        isDML: false,
        hints: ['Group the section table by semester.', 'COUNT(*) gives the number of sections per group.', 'SELECT semester, COUNT(*) AS section_count FROM section GROUP BY semester ORDER BY section_count DESC;']
      }
    ]
  }
];
