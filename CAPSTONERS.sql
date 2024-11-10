-- CREATE DATABASE CAPSTONERS;
-- USE CAPSTONERS;


-- CREATE TABLE Login (
--     UserID VARCHAR(20) NOT NULL,
--     Email VARCHAR(100) NOT NULL,
--     Password VARCHAR(100) NOT NULL,
--     Role ENUM('Student', 'Teacher') NOT NULL,
--     PRIMARY KEY (UserID, Email, Password, Role)
-- );


-- CREATE TABLE student (
--   SRN varchar(20) NOT NULL,
--   Name varchar(100) NOT NULL,
--   Email varchar(100) NOT NULL,
--   Phone varchar(15) DEFAULT NULL,
--   gpa decimal(4,2) DEFAULT NULL,
--   PRIMARY KEY (SRN),
--   UNIQUE KEY Email (Email),
--   CONSTRAINT student_chk_1 CHECK (gpa >= 0.00 AND gpa <= 10.00)
-- );

-- CREATE TABLE semester (
--   SRN varchar(20) NOT NULL,
--   Sem_5 char(1) DEFAULT NULL,
--   Sem_6 char(1) DEFAULT NULL,
--   Sem_7 char(1) DEFAULT NULL,
--   Sem_8 char(1) DEFAULT NULL,
--   PRIMARY KEY (SRN),
--   CONSTRAINT semester_ibfk_1 FOREIGN KEY (SRN) REFERENCES student (SRN) ON DELETE CASCADE
-- );


-- CREATE TABLE guide (
--   G_id varchar(20) NOT NULL,
--   G_name varchar(100) NOT NULL,
--   G_domain enum('ML','CyberSec','Network','Blockchain') NOT NULL,
--   G_level enum('Professor','Associate Professor','Assistant Professor') NOT NULL,
--   PRIMARY KEY (G_id)
-- );

-- CREATE TABLE panel (
--   Panel_Id varchar(20) NOT NULL,
--   G_id1 varchar(20) NOT NULL,
--   G_id2 varchar(20) NOT NULL,
--   G_id3 varchar(20) NOT NULL,
--   PRIMARY KEY (Panel_Id),
--   KEY G_id1 (G_id1),
--   KEY G_id2 (G_id2),
--   KEY G_id3 (G_id3),
--   CONSTRAINT panel_ibfk_1 FOREIGN KEY (G_id1) REFERENCES guide (G_id),
--   CONSTRAINT panel_ibfk_2 FOREIGN KEY (G_id2) REFERENCES guide (G_id),
--   CONSTRAINT panel_ibfk_3 FOREIGN KEY (G_id3) REFERENCES guide (G_id),
--   CONSTRAINT different_guides CHECK (G_id1 <> G_id2 AND G_id2 <> G_id3 AND G_id1 <> G_id3)
-- );

-- CREATE TABLE team (
--   T_id varchar(20) NOT NULL,
--   Project_Title varchar(200) NOT NULL,
--   SRN1 varchar(20) NOT NULL,
--   SRN2 varchar(20) NOT NULL,
--   SRN3 varchar(20) NOT NULL,
--   SRN4 varchar(20) NOT NULL,
--   G_id varchar(20) NOT NULL,
--   T_domain enum('ML','CyberSec','Network','Blockchain') NOT NULL,
--   PRIMARY KEY (T_id),
--   KEY SRN1 (SRN1),
--   KEY SRN2 (SRN2),
--   KEY SRN3 (SRN3),
--   KEY SRN4 (SRN4),
--   KEY idx_team_guide (G_id),
--   CONSTRAINT team_ibfk_1 FOREIGN KEY (SRN1) REFERENCES student (SRN),
--   CONSTRAINT team_ibfk_2 FOREIGN KEY (SRN2) REFERENCES student (SRN),
--   CONSTRAINT team_ibfk_3 FOREIGN KEY (SRN3) REFERENCES student (SRN),
--   CONSTRAINT team_ibfk_4 FOREIGN KEY (SRN4) REFERENCES student (SRN),
--   CONSTRAINT team_ibfk_5 FOREIGN KEY (G_id) REFERENCES guide (G_id)
-- );

-- CREATE TABLE marksheet (
--   SRN varchar(20) NOT NULL,
--   G_id varchar(20) NOT NULL,
--   T_id varchar(20) NOT NULL,
--   Assessment_Number int NOT NULL,
--   Parameter1 decimal(5,2) DEFAULT NULL,
--   Parameter2 decimal(5,2) DEFAULT NULL,
--   Parameter3 decimal(5,2) DEFAULT NULL,
--   Parameter4 decimal(5,2) DEFAULT NULL,
--   avg_marks decimal(4,2) DEFAULT '0.00',
--   PRIMARY KEY (SRN, G_id, Assessment_Number),
--   KEY G_id (G_id),
--   KEY idx_marksheet_team (T_id),
--   CONSTRAINT marksheet_ibfk_1 FOREIGN KEY (SRN) REFERENCES student (SRN),
--   CONSTRAINT marksheet_ibfk_2 FOREIGN KEY (G_id) REFERENCES guide (G_id),
--   CONSTRAINT marksheet_ibfk_3 FOREIGN KEY (T_id) REFERENCES team (T_id),
--   CONSTRAINT marksheet_chk_1 CHECK (Parameter1 >= 0),
--   CONSTRAINT marksheet_chk_2 CHECK (Parameter2 >= 0),
--   CONSTRAINT marksheet_chk_3 CHECK (Parameter3 >= 0),
--   CONSTRAINT marksheet_chk_4 CHECK (Parameter4 >= 0)
-- );









-- DELIMITER //
-- CREATE PROCEDURE allot_marks (
--     IN in_SRN VARCHAR(20),
--     IN in_G_id VARCHAR(20),
--     IN in_T_id VARCHAR(20),
--     IN in_Assessment_Number INT,
--     IN in_Parameter1 DECIMAL(5,2),
--     IN in_Parameter2 DECIMAL(5,2),
--     IN in_Parameter3 DECIMAL(5,2),
--     IN in_Parameter4 DECIMAL(5,2),
-- )
-- BEGIN
--     -- Insert marks without including Total, as it is a generated column
--     INSERT INTO Marksheet (SRN, G_id, T_id, Assessment_Number, Parameter1, Parameter2, Parameter3, Parameter4)
--     VALUES (in_SRN, in_G_id, in_T_id, in_Assessment_Number, in_Parameter1, in_Parameter2, in_Parameter3, in_Parameter4);
-- END //
-- DELIMITER ;


-- DELIMITER //
-- CREATE TRIGGER calculate_average_marks
-- BEFORE INSERT ON marksheet
-- FOR EACH ROW
-- BEGIN
--     SET NEW.avg_marks = (NEW.Parameter1 + NEW.Parameter2 + NEW.Parameter3 + NEW.Parameter4) / 4;
-- END //
-- DELIMITER ;

-- DELIMITER //
-- CREATE PROCEDURE GetStudentsByGrade(IN input_grade CHAR(1))
-- BEGIN
--   SELECT 
--     student.SRN,
--     student.Name AS Student_Name,
--     team.Project_Title AS Team_Name,
--     guide.G_name AS Team_Guide
--   FROM
--     semester
--   INNER JOIN 
--     student ON semester.SRN = student.SRN
--   INNER JOIN 
--     team ON student.SRN IN (team.SRN1, team.SRN2, team.SRN3, team.SRN4)
--   INNER JOIN 
--     guide ON team.G_id = guide.G_id
--   WHERE 
--     semester.Sem_5 = input_grade 
--     OR semester.Sem_6 = input_grade 
--     OR semester.Sem_7 = input_grade 
--     OR semester.Sem_8 = input_grade;
-- END //
-- DELIMITER ;





-- INSERT INTO student (SRN, Name, Email, Phone, gpa) VALUES
-- ('PES1UG22CS001', 'Amit Sharma', 'amit.sharma@example.com', '9876543210', 8.75),
-- ('PES1UG22CS002', 'Rajesh Kumar', 'rajesh.kumar@example.com', '8765432109', 9.10),
-- ('PES1UG22CS003', 'Priya Singh', 'priya.singh@example.com', '7654321098', 7.55),
-- ('PES1UG22CS004', 'Anjali Gupta', 'anjali.gupta@example.com', '6543210987', 8.90),
-- ('PES1UG22CS005', 'Sunita Menon', 'sunita.menon@example.com', '5432109876', 9.50);


-- INSERT INTO semester (SRN, Sem_5, Sem_6, Sem_7, Sem_8) VALUES
-- ('PES1UG22CS001', 'A', 'B', 'S', 'C'),
-- ('PES1UG22CS002', 'S', 'A', 'B', 'A'),
-- ('PES1UG22CS003', 'B', 'C', 'A', 'B'),
-- ('PES1UG22CS004', 'A', 'A', 'A', 'S'),
-- ('PES1UG22CS005', 'B', 'B', 'B', 'A');


-- INSERT INTO guide (G_id, G_name, G_domain, G_level) VALUES
-- ('G001', 'Dr. Arvind Desai', 'ML', 'Professor'),
-- ('G002', 'Dr. Reema Patil', 'CyberSec', 'Associate Professor'),
-- ('G003', 'Dr. Manish K', 'Network', 'Assistant Professor'),
-- ('G004', 'Dr. Kavita Rao', 'Blockchain', 'Professor'),
-- ('G005', 'Dr. Suresh Iyer', 'ML', 'Associate Professor');


-- INSERT INTO panel (Panel_Id, G_id1, G_id2, G_id3) VALUES
-- ('P001', 'G001', 'G002', 'G003'),
-- ('P002', 'G003', 'G004', 'G005'),
-- ('P003', 'G002', 'G004', 'G001');


-- INSERT INTO team (T_id, Project_Title, SRN1, SRN2, SRN3, SRN4, G_id, T_domain) VALUES
-- ('T001', 'AI-based Security System', 'PES1UG22CS001', 'PES1UG22CS002', 'PES1UG22CS003', 'PES1UG22CS004', 'G001', 'ML'),
-- ('T002', 'Blockchain Voting System', 'PES1UG22CS002', 'PES1UG22CS003', 'PES1UG22CS004', 'PES1UG22CS005', 'G004', 'Blockchain'),
-- ('T003', 'Cyber Defense Model', 'PES1UG22CS003', 'PES1UG22CS001', 'PES1UG22CS005', 'PES1UG22CS002', 'G002', 'CyberSec');


-- INSERT INTO marksheet (SRN, G_id, T_id, Assessment_Number, Parameter1, Parameter2, Parameter3, Parameter4, avg_marks) VALUES
-- ('PES1UG22CS001', 'G001', 'T001', 1, 88.50, 75.00, 82.00, 90.00, 83.38),
-- ('PES1UG22CS002', 'G001', 'T001', 1, 76.00, 85.00, 78.00, 88.00, 81.75),
-- ('PES1UG22CS003', 'G002', 'T003', 2, 80.00, 70.00, 75.00, 68.00, 73.25),
-- ('PES1UG22CS004', 'G004', 'T002', 1, 90.00, 85.00, 88.00, 82.00, 86.25),
-- ('PES1UG22CS005', 'G004', 'T002', 1, 70.00, 65.00, 68.00, 72.00, 68.75);



select * from student;
select * from team;
select * from marksheet;
select * from guide;
select * from semester;
select * from panel;
select * from login;




