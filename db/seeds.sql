INSERT INTO department (name,manager_role) VALUES 
('Front End',0),
('Back End',0),
('Database',0),
('IT',0),
('Managers',1);


INSERT INTO role (title,salary,department_id) VALUES 
('Front End Developer',60000,1),
('Front End Code Quality',60000,1),
('Back End Developer',60000,2),
('Back End Code Quality',60000,2),
('MySql Administrator',60000,3),
('MySql Developer',60000,3),
('AWS Cloud Implementation',60000,4),
('AWS Cloud Administrator',60000,4),
('Project Manager',60000,5);


INSERT INTO manager (name,role_id) VALUES 
('John Manager',9),
('Johana Manager',9),
('Albert Manager',9);


INSERT INTO employee (first_name, last_name, manager_id,role_id) VALUES 
('Jose','Velasquez',1,1),
('Sivan','Pending',2,3),
('Antonio','Huertas',3,5),
('Goku','Kwoligi',2,3),
('Christian','Salcedo',3,6);





