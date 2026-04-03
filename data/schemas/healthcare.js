// World 2 — Healthcare Schema (Med City)
const SCHEMA_HEALTHCARE = `
CREATE TABLE departments (
  dept_id INTEGER PRIMARY KEY,
  dept_name TEXT NOT NULL,
  location TEXT
);

CREATE TABLE doctors (
  doctor_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  specialization TEXT,
  city TEXT,
  contact TEXT,
  dept_id INTEGER,
  FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

CREATE TABLE patients (
  patient_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  contact TEXT,
  city TEXT
);

CREATE TABLE appointments (
  appt_id INTEGER PRIMARY KEY,
  doctor_id INTEGER,
  patient_id INTEGER,
  appt_date TEXT,
  diagnosis TEXT,
  FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

-- Departments
INSERT INTO departments VALUES (1, 'Ophthalmology',   'Rajshahi');
INSERT INTO departments VALUES (2, 'Cardiology',      'Dhaka');
INSERT INTO departments VALUES (3, 'Neurology',       'Chittagong');
INSERT INTO departments VALUES (4, 'Pediatrics',      'Rajshahi');
INSERT INTO departments VALUES (5, 'Orthopedics',     'Dhaka');
INSERT INTO departments VALUES (6, 'Ophthalmology',   'Dhaka');
INSERT INTO departments VALUES (7, 'Dermatology',     'Sylhet');

-- Doctors
INSERT INTO doctors VALUES (1,  'Dr. Watson',    'General Medicine', 'Dhaka',    '01700-111111', 2);
INSERT INTO doctors VALUES (2,  'Dr. Rahman',    'Eye Specialist',   'Rajshahi', '01800-222222', 1);
INSERT INTO doctors VALUES (3,  'Dr. Farida',    'Eye Specialist',   'Rajshahi', '01900-333333', 1);
INSERT INTO doctors VALUES (4,  'Dr. Karim',     'Cardiologist',     'Dhaka',    '01600-444444', 2);
INSERT INTO doctors VALUES (5,  'Dr. Sultana',   'Neurologist',      'Chittagong','01500-555555',3);
INSERT INTO doctors VALUES (6,  'Dr. Hasan',     'Pediatrician',     'Rajshahi', '01700-666666', 4);
INSERT INTO doctors VALUES (7,  'Dr. Chowdhury', 'Orthopedist',      'Dhaka',    '01800-777777', 5);
INSERT INTO doctors VALUES (8,  'Dr. Ahmed',     'Eye Specialist',   'Dhaka',    '01900-888888', 6);
INSERT INTO doctors VALUES (9,  'Dr. Nadia',     'Dermatologist',    'Sylhet',   '01600-999999', 7);
INSERT INTO doctors VALUES (10, 'Dr. Islam',     'Eye Specialist',   'Rajshahi', '01500-101010', 1);

-- Patients (50 patients)
INSERT INTO patients VALUES (1,  'Patient A',  45, 'M', '01700-p001', 'Dhaka');
INSERT INTO patients VALUES (2,  'Patient B',  32, 'F', '01800-p002', 'Rajshahi');
INSERT INTO patients VALUES (3,  'Patient C',  67, 'M', '01900-p003', 'Chittagong');
INSERT INTO patients VALUES (4,  'Patient D',  28, 'F', '01600-p004', 'Dhaka');
INSERT INTO patients VALUES (5,  'Patient E',  55, 'M', '01500-p005', 'Rajshahi');
INSERT INTO patients VALUES (6,  'Patient F',  39, 'F', '01700-p006', 'Sylhet');
INSERT INTO patients VALUES (7,  'Patient G',  12, 'M', '01800-p007', 'Khulna');
INSERT INTO patients VALUES (8,  'Patient H',  71, 'F', '01900-p008', 'Dhaka');
INSERT INTO patients VALUES (9,  'Patient I',  43, 'M', '01600-p009', 'Rajshahi');
INSERT INTO patients VALUES (10, 'Patient J',  25, 'F', '01500-p010', 'Barisal');
INSERT INTO patients VALUES (11, 'Patient K',  50, 'M', '01700-p011', 'Dhaka');
INSERT INTO patients VALUES (12, 'Patient L',  36, 'F', '01800-p012', 'Rajshahi');

-- Appointments
-- Dr. Watson appointments (many in April 2025 for CT-02 Q)
INSERT INTO appointments VALUES (1,  1, 1,  '2025-04-02', 'Hypertension');
INSERT INTO appointments VALUES (2,  1, 2,  '2025-04-03', 'Diabetes');
INSERT INTO appointments VALUES (3,  1, 3,  '2025-04-05', 'Fever');
INSERT INTO appointments VALUES (4,  1, 4,  '2025-04-07', 'Chest Pain');
INSERT INTO appointments VALUES (5,  1, 5,  '2025-04-10', 'Fatigue');
INSERT INTO appointments VALUES (6,  1, 6,  '2025-04-14', 'Headache');
INSERT INTO appointments VALUES (7,  1, 7,  '2025-04-18', 'Cold');
INSERT INTO appointments VALUES (8,  1, 8,  '2025-04-21', 'Back Pain');
INSERT INTO appointments VALUES (9,  1, 9,  '2025-04-24', 'Anxiety');
INSERT INTO appointments VALUES (10, 1, 10, '2025-04-28', 'Migraine');
INSERT INTO appointments VALUES (11, 1, 11, '2025-03-15', 'Checkup');
INSERT INTO appointments VALUES (12, 2, 1,  '2025-04-01', 'Glaucoma');
INSERT INTO appointments VALUES (13, 2, 2,  '2025-04-06', 'Cataract');
INSERT INTO appointments VALUES (14, 3, 3,  '2025-03-22', 'Myopia');
INSERT INTO appointments VALUES (15, 4, 4,  '2025-04-09', 'Arrhythmia');
INSERT INTO appointments VALUES (16, 5, 5,  '2025-04-11', 'Stroke Risk');
INSERT INTO appointments VALUES (17, 6, 6,  '2025-04-13', 'Flu');
INSERT INTO appointments VALUES (18, 1, 12, '2025-04-30', 'Follow-up');
`;
