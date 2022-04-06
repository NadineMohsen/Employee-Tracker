INSERT INTO department (name)
VALUES 
('Finance'),
('Human Resources'),
('Marketing'),
('Engineering');

INSERT INTO role (title, salary, department_id)
VALUES
('Accountant', 12000, 1), 
('IT engineer', 20000, 4),
('Trainee HR', 25000, 4),
('Social media employee', 150000, 3),
('Finance Manager', 30000, 1), 
('Marketing Manager', 30000, 3),
('Engineering Manager', 350000, 4),
('HR Manager', 40000, 2);



INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Nadine', 'Mohsen', 7, null),
('Joe', 'Smith', 8, null),
('Ashley', 'Green', 6, null),
('Mary', 'Lewis', 5, null),
('Anna', 'Allen', 1, 5),
('Katherine', 'Williams', 2, 7),
('Adam', 'Parker', 3, 8),
('Alex', 'Jones', 4, 6);