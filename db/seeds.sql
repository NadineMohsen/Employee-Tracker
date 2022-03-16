INSERT INTO department(name)
VALUES
("Marketing"),
("Sales"),
("Finance"),
("Engineering"),
("Design"),
("HR");

INSERT INTO role(title, salary, department_id)
VALUES
-- MARKETING ROLES
("Head of Marketing", 50000, 1),
("Senior Marketing Executive", 30000, 1),
("Marketing Assistant", 25000, 1),
-- SALES ROLES
("Head of Sales", 50000, 2),
("Senior Sales Executive", 30000, 2),
("Sales Assistant", 25000, 2),
-- FINANCE ROLES
("Head of Finance", 30000, 3),
("Accountant", 25000, 3),
-- ENGINEERING ROLES
("Lead Engineer", 50000, 4),
("Senior Software Engineer", 30000, 4),
("Junior Software Engineer", 25000, 4),
-- DESIGN ROLES
("Senior Product Designer", 30000, 5),
("Junior Product Designer", 25000, 5),
-- HR ROLES
("Head of Human Resources", 25000, 6),
("Recruitment Manager", 25000, 6),
("Recruitment Consultant", 25000, 6);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
("Sarah", "Parker", 1, NULL), 
("James","Lee", 1, 1),
("Arun","Singh", 2, NULL),
("Dav", "Kudhail", 2, 2),
("Peter", "Parker", 3, NULL),
("Hannah", "Millar", 4, 4),
("Bav", "Kudhail", 4, NULL),
("Yavor", "Ivanov", 4, 4),
("Mia", "Malora", 4, NULL),
("John", "Doe", 4, 4), 
("Polly","Smith", 5, NULL),
("Thomas","Shelby", 5, 5),
("Arhur", "Singh", 5, NULL),
("Isiah", "Parker", 6, 6),
("Johnny", "Renner", 6, NULL),
("Esme", "Millar", 6, 6),
("Liam", "Ivanov", 6, NULL),
("Lilly", "Foster", 6, 6);