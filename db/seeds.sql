INSERT INTO department (name)
VALUES 
('Finance'),
('Human Resources'),
('Marketing'),
('Engineering');

INSERT INTO role (title, salary, department_id)
VALUES
('Engineering Manager', 90000, 4),
('IT engineer', 20000, 1),
('Trainee HR', 25000, 2), 
('Social media employee', 350000, 2),
('Accountant', 90000, 1),
('Marketing manager', 70000, 3),
('Finance manager', 60000, 3), 
('HR Manager', 80000, 4);



INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Joe', 'Smith', 1, 1),
('Nadine', 'Mohsen', 2, null),
('Adam', 'Parker', 6, null),
('Katherine', 'Williams', 7, null),
('Mary', 'Brown', 4, null),
('Ashley', 'Green', 3, 3),
('Alex', 'Jones', 8, 7),
('Anna', 'Allen', 5, 5)

