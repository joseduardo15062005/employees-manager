DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE employees_db;

CREATE TABLE managers (
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    manager_name VARCHAR(70) NOT NULL
);

CREATE TABLE roles (
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL
);

CREATE TABLE employees (
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(35) NOT NULL,
    last_name VARCHAR(35) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    manager_id INTEGER ,
    role_id INTEGER,
    FOREIGN KEY(manager_id) 
    REFERENCES managers(id)
    ON DELETE SET NULL,
    FOREIGN KEY(role_id)
    REFERENCES roles(id)
    ON DELETE SET NULL
);



