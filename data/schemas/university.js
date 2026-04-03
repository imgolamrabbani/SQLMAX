// World 3 — University Schema (UniVerse) — Based on standard DB textbook schema
const SCHEMA_UNIVERSITY = `
CREATE TABLE department (
  dept_name TEXT PRIMARY KEY,
  building TEXT,
  budget REAL
);

CREATE TABLE instructor (
  ID TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  dept_name TEXT,
  salary REAL,
  FOREIGN KEY (dept_name) REFERENCES department(dept_name)
);

CREATE TABLE student (
  ID TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  dept_name TEXT,
  tot_cred INTEGER,
  FOREIGN KEY (dept_name) REFERENCES department(dept_name)
);

CREATE TABLE course (
  course_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  dept_name TEXT,
  credits INTEGER,
  FOREIGN KEY (dept_name) REFERENCES department(dept_name)
);

CREATE TABLE section (
  course_id TEXT,
  sec_id TEXT,
  semester TEXT,
  year INTEGER,
  building TEXT,
  room_number TEXT,
  PRIMARY KEY (course_id, sec_id, semester, year),
  FOREIGN KEY (course_id) REFERENCES course(course_id)
);

CREATE TABLE teaches (
  ID TEXT,
  course_id TEXT,
  sec_id TEXT,
  semester TEXT,
  year INTEGER,
  PRIMARY KEY (ID, course_id, sec_id, semester, year),
  FOREIGN KEY (ID) REFERENCES instructor(ID)
);

CREATE TABLE takes (
  ID TEXT,
  course_id TEXT,
  sec_id TEXT,
  semester TEXT,
  year INTEGER,
  grade TEXT,
  PRIMARY KEY (ID, course_id, sec_id, semester, year),
  FOREIGN KEY (ID) REFERENCES student(ID)
);

-- Departments
INSERT INTO department VALUES ('Computer Science', 'Taylor',   100000);
INSERT INTO department VALUES ('Physics',          'Watson',   70000);
INSERT INTO department VALUES ('Music',            'Packard',  80000);
INSERT INTO department VALUES ('Biology',          'Painter',  90000);
INSERT INTO department VALUES ('History',          'Garfield',  50000);
INSERT INTO department VALUES ('Finance',          'Painter',  120000);
INSERT INTO department VALUES ('Statistics',       'Taylor',   85000);

-- Instructors
INSERT INTO instructor VALUES ('10101', 'Srinivasan', 'Computer Science', 95000);
INSERT INTO instructor VALUES ('12121', 'Wu',          'Finance',          90000);
INSERT INTO instructor VALUES ('15151', 'Mozart',      'Music',            40000);
INSERT INTO instructor VALUES ('22222', 'Einstein',    'Physics',          95000);
INSERT INTO instructor VALUES ('32343', 'El Said',     'History',          60000);
INSERT INTO instructor VALUES ('33456', 'Gold',        'Physics',          87000);
INSERT INTO instructor VALUES ('45565', 'Katz',        'Computer Science', 75000);
INSERT INTO instructor VALUES ('58583', 'Califieri',   'History',          62000);
INSERT INTO instructor VALUES ('76543', 'Singh',       'Finance',          80000);
INSERT INTO instructor VALUES ('76766', 'Crick',       'Biology',          72000);
INSERT INTO instructor VALUES ('83821', 'Brandt',      'Computer Science', 92000);
INSERT INTO instructor VALUES ('98345', 'Kim',         'Electrical Eng.',  80000);
INSERT INTO instructor VALUES ('99999', 'Beethoven',   'Music',            45000);
INSERT INTO instructor VALUES ('55555', 'Patel',       'Statistics',       91000);

-- Students
INSERT INTO student VALUES ('00128', 'Zhang',     'Computer Science', 102);
INSERT INTO student VALUES ('12345', 'Shankar',   'Computer Science', 32);
INSERT INTO student VALUES ('19991', 'Brandt',    'History',          80);
INSERT INTO student VALUES ('23121', 'Chavez',    'Finance',          110);
INSERT INTO student VALUES ('44553', 'Peltier',   'Physics',          56);
INSERT INTO student VALUES ('45678', 'Levy',      'Physics',          46);
INSERT INTO student VALUES ('54321', 'Williams',  'Computer Science', 54);
INSERT INTO student VALUES ('55739', 'Sanchez',   'Music',           38);
INSERT INTO student VALUES ('70557', 'Snow',      'Physics',          0);
INSERT INTO student VALUES ('76543', 'Brown',     'Computer Science', 58);
INSERT INTO student VALUES ('76653', 'Aoi',       'Biology',          44);
INSERT INTO student VALUES ('98765', 'Bouchard',  'Statistics',       98);
INSERT INTO student VALUES ('98988', 'Tanaka',    'Biology',          120);

-- Courses
INSERT INTO course VALUES ('BIO-101', 'Intro. to Biology',      'Biology',          4);
INSERT INTO course VALUES ('BIO-301', 'Genetics',               'Biology',          4);
INSERT INTO course VALUES ('CS-101',  'Intro. to Computer Sci.','Computer Science', 4);
INSERT INTO course VALUES ('CS-315',  'Robotics',               'Computer Science', 3);
INSERT INTO course VALUES ('CS-319',  'Image Processing',       'Computer Science', 3);
INSERT INTO course VALUES ('CS-347',  'Database System Concepts','Computer Science',3);
INSERT INTO course VALUES ('EE-181',  'Intro. to Digital Sys.', 'Electrical Eng.',  3);
INSERT INTO course VALUES ('FIN-201', 'Investment Banking',     'Finance',          3);
INSERT INTO course VALUES ('HIS-351', 'World History',          'History',          3);
INSERT INTO course VALUES ('MU-199',  'Music Video Production', 'Music',            3);
INSERT INTO course VALUES ('PHY-101', 'Physical Principles',    'Physics',          4);
INSERT INTO course VALUES ('PHY-201', 'Optics',                 'Physics',          4);

-- Sections (some courses in both Fall 2019 and Spring 2020 for CT-03 Q)
INSERT INTO section VALUES ('CS-101',  '1', 'Fall',   2019, 'Packard', '101');
INSERT INTO section VALUES ('CS-101',  '1', 'Spring', 2020, 'Packard', '101');  -- Both!
INSERT INTO section VALUES ('PHY-101', '1', 'Fall',   2019, 'Watson',  '100');
INSERT INTO section VALUES ('PHY-101', '1', 'Spring', 2020, 'Watson',  '100');  -- Both!
INSERT INTO section VALUES ('CS-315',  '1', 'Spring', 2020, 'Taylor',  '3128');
INSERT INTO section VALUES ('CS-347',  '1', 'Fall',   2019, 'Taylor',  '3128');
INSERT INTO section VALUES ('BIO-101', '1', 'Summer', 2019, 'Painter', '514');
INSERT INTO section VALUES ('MU-199',  '1', 'Spring', 2020, 'Packard', '110');
INSERT INTO section VALUES ('HIS-351', '1', 'Fall',   2019, 'Garfield','359');
INSERT INTO section VALUES ('FIN-201', '1', 'Fall',   2019, 'Painter', '514');
INSERT INTO section VALUES ('CS-319',  '1', 'Fall',   2019, 'Taylor',  '3128');
INSERT INTO section VALUES ('CS-319',  '1', 'Spring', 2020, 'Taylor',  '3128');  -- Both!

-- Teaches
INSERT INTO teaches VALUES ('10101', 'CS-101',  '1', 'Fall',   2019);
INSERT INTO teaches VALUES ('10101', 'CS-347',  '1', 'Fall',   2019);
INSERT INTO teaches VALUES ('12121', 'FIN-201', '1', 'Fall',   2019);
INSERT INTO teaches VALUES ('15151', 'MU-199',  '1', 'Spring', 2020);
INSERT INTO teaches VALUES ('22222', 'PHY-101', '1', 'Fall',   2019);
INSERT INTO teaches VALUES ('22222', 'PHY-101', '1', 'Spring', 2020);
INSERT INTO teaches VALUES ('33456', 'PHY-201', '1', 'Summer', 2019);
INSERT INTO teaches VALUES ('45565', 'CS-101',  '1', 'Spring', 2020);
INSERT INTO teaches VALUES ('45565', 'CS-315',  '1', 'Spring', 2020);
INSERT INTO teaches VALUES ('76766', 'BIO-101', '1', 'Summer', 2019);
INSERT INTO teaches VALUES ('83821', 'CS-319',  '1', 'Fall',   2019);
INSERT INTO teaches VALUES ('83821', 'CS-319',  '1', 'Spring', 2020);
INSERT INTO teaches VALUES ('98345', 'EE-181',  '1', 'Spring', 2020);
INSERT INTO teaches VALUES ('32343', 'HIS-351', '1', 'Fall',   2019);

-- Takes (students → courses they attended)
INSERT INTO takes VALUES ('00128', 'CS-101',  '1', 'Fall',   2019, 'A');
INSERT INTO takes VALUES ('00128', 'CS-347',  '1', 'Fall',   2019, 'A-');
INSERT INTO takes VALUES ('12345', 'CS-101',  '1', 'Fall',   2019, 'C');
INSERT INTO takes VALUES ('12345', 'CS-319',  '1', 'Spring', 2020, 'A');
INSERT INTO takes VALUES ('19991', 'HIS-351', '1', 'Fall',   2019, 'B');
INSERT INTO takes VALUES ('23121', 'FIN-201', '1', 'Fall',   2019, 'C+');
INSERT INTO takes VALUES ('44553', 'PHY-101', '1', 'Fall',   2019, 'B-');
INSERT INTO takes VALUES ('44553', 'PHY-101', '1', 'Spring', 2020, 'B+');
INSERT INTO takes VALUES ('45678', 'CS-101',  '1', 'Spring', 2020, 'F');
INSERT INTO takes VALUES ('45678', 'PHY-101', '1', 'Fall',   2019, 'B+');
INSERT INTO takes VALUES ('54321', 'CS-101',  '1', 'Fall',   2019, 'A-');
INSERT INTO takes VALUES ('55739', 'MU-199',  '1', 'Spring', 2020, 'A+');
INSERT INTO takes VALUES ('76543', 'CS-319',  '1', 'Fall',   2019, 'A');
INSERT INTO takes VALUES ('76543', 'CS-319',  '1', 'Spring', 2020, 'A');
INSERT INTO takes VALUES ('76653', 'BIO-101', '1', 'Summer', 2019, 'A');
INSERT INTO takes VALUES ('98765', 'CS-315',  '1', 'Spring', 2020, 'B');
INSERT INTO takes VALUES ('98988', 'BIO-301', '1', 'Summer', 2019, NULL);
-- Physics dept course takers for CT-03
INSERT INTO takes VALUES ('00128', 'PHY-101', '1', 'Spring', 2020, 'B+');
INSERT INTO takes VALUES ('54321', 'PHY-101', '1', 'Fall',   2019, 'A');
`;
