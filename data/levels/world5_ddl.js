// World 0 / World 5 — DDL Workshop (new University schema)
// Topics: CREATE TABLE, data types, primary key, foreign key, not null, check,
//         unique, drop table, alter table — all from Chapter 3 DDL section
// This world uses the UNIVERSITY schema for reading queries,
// and DDL challenges are verified by running a SELECT on the created tables.
const WORLD5_LEVELS = [
  {
    id: 'w5l1', title: 'DDL Workshop', icon: '🏗️', xpReward: 200,
    sublevels: [
      {
        id: 'w5l1s1', title: 'CREATE TABLE basics', badge: '🔵',
        difficulty: 'MEDIUM', xp: 60, concept: 'CREATE TABLE + data types',
        schema: 'university',
        tutorial: {
          concept: 'CREATE TABLE defines a new table. You must specify column names and their data types. SQL standard types: CHAR(n), VARCHAR(n), INT, SMALLINT, NUMERIC(p,d), REAL, FLOAT(n), DATE, TIME, TIMESTAMP.',
          syntax: "CREATE TABLE table_name (\n  col1  datatype,\n  col2  datatype,\n  col3  datatype\n);\n\n-- Common types:\n-- TEXT / VARCHAR(n) — variable-length string\n-- INTEGER / INT     — whole numbers\n-- REAL / FLOAT      — decimals\n-- DATE              — e.g. '2024-01-15'",
          example: { query: "CREATE TABLE student (\n  ID        VARCHAR(5),\n  name      VARCHAR(20),\n  dept_name VARCHAR(20),\n  tot_cred  NUMERIC(3,0)\n);", note: 'Notice: no constraints yet. All columns accept NULL values by default.' }
        },
        narrative: 'Create a simple grade_report table.',
        task: "CREATE TABLE grade_report (student_id INT, course_id TEXT, grade TEXT). Then SELECT name FROM sqlite_master WHERE type='table' AND name='grade_report';",
        solution: "CREATE TABLE grade_report (student_id INT, course_id TEXT, grade TEXT); SELECT name FROM sqlite_master WHERE type='table' AND name='grade_report';",
        isDML: true,
        hints: ['CREATE TABLE name (col1 type, col2 type, ...)', "Then verify: SELECT name FROM sqlite_master WHERE type='table' AND name='grade_report';", "CREATE TABLE grade_report (student_id INT, course_id TEXT, grade TEXT); SELECT name FROM sqlite_master WHERE type='table' AND name='grade_report';"]
      },
      {
        id: 'w5l1s2', title: 'NOT NULL constraint', badge: '🟠',
        difficulty: 'MEDIUM', xp: 65, concept: 'NOT NULL integrity constraint',
        schema: 'university',
        tutorial: {
          concept: 'NOT NULL is an integrity constraint. It ensures the column can never hold a NULL value. Any INSERT or UPDATE that tries to set that column to NULL will be rejected by the database.',
          syntax: "CREATE TABLE table (\n  col1 TEXT NOT NULL,\n  col2 INT,           -- allows NULL\n  col3 TEXT NOT NULL  -- disallows NULL\n);",
          example: { query: "CREATE TABLE instructor (\n  ID        VARCHAR(5) PRIMARY KEY,\n  name      VARCHAR(20) NOT NULL,\n  dept_name VARCHAR(20),\n  salary    NUMERIC(8,2)\n);", note: 'name is NOT NULL — every instructor must have a name. But dept_name and salary can be missing.' }
        },
        narrative: 'Check which columns in the instructor table are NOT NULL.',
        task: "Run: PRAGMA table_info(instructor); — Look at the 'notnull' column. Show the result (this tells you the constraint info).",
        solution: 'PRAGMA table_info(instructor);',
        isDML: false,
        hints: ['PRAGMA table_info(table_name) is SQLite-specific metadata.', 'The notnull column is 1 for NOT NULL, 0 for nullable.', 'PRAGMA table_info(instructor);']
      },
      {
        id: 'w5l1s3', title: 'PRIMARY KEY', badge: '🟡',
        difficulty: 'MEDIUM', xp: 70, concept: 'PRIMARY KEY constraint',
        schema: 'university',
        tutorial: {
          concept: 'PRIMARY KEY uniquely identifies each row. It is always NOT NULL. No two rows can have the same primary key value. A table can have only one primary key (but it can span multiple columns).',
          syntax: "-- Single column PK:\nCREATE TABLE t (\n  id INT PRIMARY KEY,\n  col TEXT\n);\n\n-- Composite PK:\nCREATE TABLE t (\n  col1 TEXT,\n  col2 TEXT,\n  PRIMARY KEY (col1, col2)\n);",
          example: { query: "CREATE TABLE course (\n  course_id  VARCHAR(8) PRIMARY KEY,\n  title      VARCHAR(50) NOT NULL,\n  dept_name  VARCHAR(20),\n  credits    NUMERIC(2,0)\n);", note: 'course_id is the primary key. No two courses can share an ID.' }
        },
        narrative: 'Look at what columns make up the primary key in the takes table.',
        task: "Run PRAGMA table_info(takes); — the pk column shows which columns form the primary key (1 = first pk column, 2 = second, etc.).",
        solution: 'PRAGMA table_info(takes);',
        isDML: false,
        hints: ['PRAGMA table_info shows column metadata.', 'The pk column (last column) shows key membership order.', 'PRAGMA table_info(takes);']
      },
      {
        id: 'w5l1s4', title: 'FOREIGN KEY', badge: '🔴',
        difficulty: 'HARD', xp: 75, concept: 'FOREIGN KEY — referential integrity',
        schema: 'university',
        tutorial: {
          concept: 'A FOREIGN KEY ensures values in one table exist in another (referential integrity). It prevents "orphan" rows. The referenced column must be a PRIMARY KEY (or UNIQUE) in the other table.',
          syntax: "CREATE TABLE child (\n  id    INT PRIMARY KEY,\n  parent_id INT,\n  FOREIGN KEY (parent_id) REFERENCES parent(id)\n);\n\n-- parent_id values must exist in parent.id\n-- Cannot insert a child row with a non-existent parent",
          example: { query: "CREATE TABLE teaches (\n  ID        VARCHAR(5),\n  course_id VARCHAR(8),\n  semester  VARCHAR(6),\n  year      NUMERIC(4,0),\n  PRIMARY KEY (ID, course_id, semester, year),\n  FOREIGN KEY (ID)        REFERENCES instructor(ID),\n  FOREIGN KEY (course_id) REFERENCES course(course_id)\n);", note: 'Both ID and course_id are foreign keys. A teaches row can only reference an existing instructor and course.' }
        },
        narrative: 'List all instructors and the departments they belong to — verify referential integrity works.',
        task: "Show <strong>name</strong> and <strong>dept_name</strong> from instructor JOIN department ON instructor.dept_name = department.dept_name ORDER BY dept_name.",
        solution: 'SELECT name, instructor.dept_name FROM instructor JOIN department ON instructor.dept_name = department.dept_name ORDER BY dept_name;',
        isDML: false,
        hints: ['Use JOIN ... ON for explicit join syntax.', 'Both tables have dept_name — qualify with table name in SELECT.', 'SELECT name, instructor.dept_name FROM instructor JOIN department ON instructor.dept_name = department.dept_name ORDER BY dept_name;']
      }
    ]
  },
  {
    id: 'w5l2', title: 'Constraints Deep Dive', icon: '🔒', xpReward: 200,
    sublevels: [
      {
        id: 'w5l2s1', title: 'CHECK constraint', badge: '🟣',
        difficulty: 'HARD', xp: 75, concept: 'CHECK constraint',
        schema: 'university',
        tutorial: {
          concept: 'CHECK adds a domain constraint — each row must satisfy the CHECK predicate. If an INSERT or UPDATE violates it, the operation is rejected. Can reference any columns in the same table.',
          syntax: "CREATE TABLE table (\n  col1 NUM CHECK (col1 >= 0),\n  col2 TEXT CHECK (col2 IN ('A','B','C'))\n);\n\n-- Or named constraint:\nCONSTRAINT check_name CHECK (condition)",
          example: { query: "CREATE TABLE section (\n  course_id TEXT,\n  semester  TEXT CHECK (semester IN ('Fall','Winter','Spring','Summer')),\n  year      INT  CHECK (year > 1701 AND year < 2100),\n  PRIMARY KEY (course_id, semester, year)\n);", note: 'semester can only be one of the four allowed values. year must be in a valid range.' }
        },
        narrative: 'Find instructors whose salary satisfies being > 40000 (the CHECK rule in our schema).',
        task: 'Show <strong>name</strong> and <strong>salary</strong> from instructor where salary > 40000 ORDER BY salary ASC.',
        solution: 'SELECT name, salary FROM instructor WHERE salary > 40000 ORDER BY salary ASC;',
        isDML: false,
        hints: ['WHERE salary > 40000', 'ORDER BY salary ASC', 'SELECT name, salary FROM instructor WHERE salary > 40000 ORDER BY salary ASC;']
      },
      {
        id: 'w5l2s2', title: 'Domains & Defaults', badge: '🔵',
        difficulty: 'MEDIUM', xp: 65, concept: 'DEFAULT values',
        schema: 'university',
        tutorial: {
          concept: 'A DEFAULT value is automatically used when an INSERT does not specify a value for that column. It is defined as part of the column specification.',
          syntax: "CREATE TABLE table (\n  col1 TEXT,\n  col2 INT DEFAULT 0,\n  col3 TEXT DEFAULT 'Active'\n);\n\n-- When INSERT omits col2 and col3,\n-- they get 0 and 'Active' respectively.",
          example: { query: "CREATE TABLE employee (\n  name   TEXT NOT NULL,\n  status TEXT DEFAULT 'active',\n  dept   TEXT\n);", note: "If INSERT INTO employee (name, dept) VALUES ('Ali', 'CS') — status automatically becomes 'active'." }
        },
        narrative: 'Find sections offered in the most common semester in our data.',
        task: 'Show <strong>semester</strong> and <strong>COUNT(*)</strong> as section_count from section GROUP BY semester ORDER BY section_count DESC.',
        solution: 'SELECT semester, COUNT(*) AS section_count FROM section GROUP BY semester ORDER BY section_count DESC;',
        isDML: false,
        hints: ['GROUP BY semester.', 'COUNT(*) per semester, ORDER BY count DESC.', 'SELECT semester, COUNT(*) AS section_count FROM section GROUP BY semester ORDER BY section_count DESC;']
      }
    ]
  }
];
