require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function getEmployees() {
  const sql = `
  SELECT  e.id,CONCAT(e.first_name,' ',e.last_name) as full_name, 
  role.title as employee_role, CONCAT('$',FORMAT(role.salary,2)) as employee_salary,
  manager.name as manager_name,department.name as employee_deparment
  FROM employee AS e
  INNER JOIN manager ON manager.id =e.manager_id 
  INNER JOIN role ON role.id=e.role_id
  INNER JOIN department ON department.id=role.department_id
  ORDER BY full_name
  `;
  const result = await pool.query(sql);
  return result[0];
}

async function getEmployee(id) {
  const sql = `
  SELECT  e.id,CONCAT(e.first_name,' ',e.last_name) as full_name, 
  role.title as employee_role, CONCAT('$',FORMAT(role.salary,2)) as employee_salary,
  manager.name as manager_name,department.name as employee_deparment, e.first_name as first_name,e.last_name as last_name
  FROM employee AS e
  INNER JOIN manager ON manager.id =e.manager_id 
  INNER JOIN role ON role.id=e.role_id
  INNER JOIN department ON department.id=role.department_id
  WHERE  e.id=?
  `;

  const result = await pool.query(sql, id);
  return result[0];
}

async function deleteEmployee(id) {
  const sql = `DELETE FROM  employee WHERE id=?`;

  const result = await pool.query(sql, id);
  return result[0];
}

async function getDeparments() {
  const result = await pool.query("SELECT * FROM department ORDER BY name ASC");
  return result[0];
}

async function getManagers() {
  const result = await pool.query("SELECT * FROM manager  ORDER BY name ASC");
  return result[0];
}

async function getRoles() {
  const result = await pool.query(
    `SELECT role.id,role.title,CONCAT('$',FORMAT(role.salary,2)) AS role_salary,department.name as department_name 
    FROM role  
    INNER JOIN department ON role.department_id=department.id;`
  );
  return result[0];
}

async function getRole(id) {
  const sql = `SELECT role.id,role.title,CONCAT('$',FORMAT(role.salary,2)) AS role_salary,department.name as department_name
    FROM role  INNER JOIN department ON role.department_id=department.id 
    WHERE role.id=?`;
  const result = await pool.query(sql, id);
  return result[0];
}

async function insertDepartment(name, manager_role) {
  try {
    const sql = "INSERT INTO department (name,manager_role) VALUES (?,?)";
    params = [name, manager_role];
    const result = await pool.query(sql, params);
    return "success";
  } catch (error) {
    throw error;
  }
}

async function insertRole(title, salary, department_id) {
  try {
    const sql = "INSERT INTO role (title,salary,department_id) VALUES (?,?,?)";
    params = [title, salary, department_id];
    const result = await pool.query(sql, params);
    return "success";
  } catch (error) {
    throw error;
  }
}

async function insertEmployee(first_name, last_name, manager_id, role_id) {
  try {
    const sql =
      "INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES (?,?,?,?)";
    params = [first_name, last_name, manager_id, role_id];
    const result = await pool.query(sql, params);
    return "success";
  } catch (error) {
    throw error;
  }
}

async function updateEmployee(employee) {
  try {
    const sql =
      "UPDATE employee SET first_name=?,last_name=?, manager_id=?,role_id=? WHERE id=?";
    const params = [
      employee.first_name,
      employee.last_name,
      employee.manager_id,
      employee.role_id,
      employee.id,
    ];
    const result = await pool.query(sql, params);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateRole(role) {
  try {
    const sql = `UPDATE role set title=?, salary=?,department_id=? WHERE id=?`;
    const params = [role.title, role.salary, role.department_id, role.id];
    const result = await pool.query(sql, params);
    return result;
  } catch (error) {
    throw error;
  }
}
module.exports = {
  getEmployees,
  getEmployee,
  getRoles,
  getRole,
  getDeparments,
  getManagers,
  insertDepartment,
  insertRole,
  insertEmployee,
  updateEmployee,
  updateRole,
  deleteEmployee,
};
