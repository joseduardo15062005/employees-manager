const inquirer = require("inquirer");
const { options } = require("./questions");
const { printDataTable, printTitle } = require("./print");

const {
  newDepartmentQuestions,
  newRoleQuestions,
  newEmployeesQuestions,
} = require("./questions");
const {
  createDepartmentQuestionList,
  createRoleQuestionList,
  createManagerQuestionList,
  createEmployeeQuestionList,
} = require("./createQuestions");

const {
  getEmployees,
  getEmployee,
  getEmployeesByManager,
  getEmployeesByDepartment,
  getDeparments,
  getRoles,
  getRole,
  getManagers,
  insertDepartment,
  insertRole,
  insertEmployee,
  updateEmployee,
  updateRole,
  deleteEmployee,
} = require("../db/connection");

function askOptions() {
  inquirer
    .prompt(options)
    .then((answer) => {
      console.log(answer);
      switch (answer.option) {
        case "View All Departments":
          console.clear();
          getDeparments().then((departments) => {
            printDataTable("Departments", departments);
            return askOptions();
          });
          break;
        case "View All Roles":
          console.clear();
          getRoles().then((roles) => {
            printDataTable("Roles", roles);
            return askOptions();
          });
          break;
        case "View All Employees":
          console.clear();
          getEmployees().then((employees) => {
            printDataTable("Employees", employees);
            return askOptions();
          });
          break;
        case "Add a Department":
          console.clear();
          return createDepartment();
        case "Add a Role":
          console.clear();
          return createRole();
        case "Add an Employee":
          console.clear();
          return createEmployee();
        case "Delete an Employee":
          console.clear();
          return delete_Employee();
        case "Update an Employee":
          console.clear();
          return update_Employee();
        case "Update a Role":
          console.clear();
          return update_Role();
        case "View employees by manager":
          console.clear();
          return viewEmployeesByManager();
        case "View employees by department":
          console.clear();
          return viewEmployeesByDepartment();
      }
    })
    .catch((err) => console.error(err));
}

//view employees by department
function viewEmployeesByDepartment() {
  let departmentId = 0;
  getDeparments()
    .then((departments) => {
      const departmentQuestion = createDepartmentQuestionList(departments);
      return inquirer.prompt(departmentQuestion);
    })
    .then((answer) => {
      departmentId = answer.department_id;
      return getEmployeesByDepartment(departmentId);
    })
    .then((employees) => {
      printDataTable("Employees", employees);
      return askOptions();
    })
    .catch((err) => console.error(err));
}

//View employees by manager
function viewEmployeesByManager() {
  let managerId = 0;
  getManagers()
    .then((managers) => {
      const managerQuestion = createManagerQuestionList(managers);
      return inquirer.prompt(managerQuestion);
    })
    .then((answer) => {
      managerId = answer.manager_id;
      return getEmployeesByManager(managerId);
    })
    .then((employees) => {
      printDataTable("Employees", employees);
      return askOptions();
    })
    .catch((err) => console.error(err));
}

//Delret an employee
function delete_Employee() {
  let employeeId = 0;
  getEmployees()
    .then((employees) => {
      const employeeQuestion = createEmployeeQuestionList(employees);
      return inquirer.prompt(employeeQuestion);
    })
    .then((answer) => {
      //Select the employee to delete
      employeeId = answer.employee_id;
      return deleteEmployee(employeeId);
    })
    .then((result) => {
      return askOptions();
    })
    .catch((err) => console.error(err));
}

//Insert a new department
function createDepartment() {
  console.log(askOptions);
  printTitle("Add a Department");
  inquirer.prompt(newDepartmentQuestions).then((answer) => {
    const { name, manager_role } = answer;
    insertDepartment(name, manager_role)
      .then((result) => {
        return askOptions();
      })
      .catch((err) => console.error(err));
  });
}
//Insert a new role
function createRole() {
  let roleQuestion = newRoleQuestions;
  printTitle("Add a Role");
  getDeparments()
    .then((departments) => {
      roleQuestion.push(createDepartmentQuestionList(departments));
      return inquirer.prompt(roleQuestion);
    })
    .then((answer) => {
      const { title, salary, department_id } = answer;
      insertRole(title, salary, department_id).then((result) => {
        return askOptions();
      });
    })
    .catch((err) => console.error(err));
}
//Insert a new employee
function createEmployee() {
  let employeeQuestions = newEmployeesQuestions;
  getRoles()
    .then((roles) => {
      employeeQuestions.push(createRoleQuestionList(roles));
      return getManagers();
    })
    .then((managers) => {
      employeeQuestions.push(createManagerQuestionList(managers));
      return inquirer.prompt(employeeQuestions);
    })
    .then((answer) => {
      const { first_name, last_name, role_id, manager_id } = answer;
      return insertEmployee(first_name, last_name, manager_id, role_id);
    })
    .then((result) => {
      return askOptions();
    })
    .catch((err) => console.error(err));
}
//update a role
async function update_Role() {
  const questions = [];
  const departments = await getDeparments();
  let roleId = 0;

  getRoles()
    .then((roles) => {
      const question = [];
      question.push(createRoleQuestionList(roles, "Select the role update:"));
      return inquirer.prompt(question);
    })
    .then((answer) => {
      roleId = answer.role_id;
      return getRole(roleId);
    })
    .then((role) => {
      const titleQuestion = {
        type: "input",
        name: "title",
        message: "title:",
        default: role[0].title,
      };
      questions.push(titleQuestion);
      const salaryQuestion = {
        type: "input",
        name: "salary",
        message: "Annual Salary:",
        default: role[0].role_salary,
      };
      questions.push(
        createDepartmentQuestionList(departments, "Select the Department")
      );

      questions.push(salaryQuestion);
      return inquirer.prompt(questions);
    })
    .then((answer) => {
      answer.id = roleId;
      return updateRole(answer);
    })
    .then((result) => {
      return askOptions();
    })
    .catch((err) => console.error(err));
}
//update an employee
function update_Employee() {
  const questions = [];
  let employeeId = 0;
  getEmployees()
    .then((employees) => {
      const employeeQuestion = createEmployeeQuestionList(employees);
      return inquirer.prompt(employeeQuestion);
    })
    .then((answer) => {
      //Select the employee to edit
      employeeId = answer.employee_id;
      return getEmployee(employeeId);
    })
    .then((employee) => {
      const questionFisrtName = {
        type: "input",
        name: "first_name",
        message: "Employee First Name:",
        default: `${employee[0].first_name}`,
      };
      const questionLastName = {
        type: "input",
        name: "last_name",
        message: "Employee Last Name:",
        default: `${employee[0].last_name}`,
      };
      questions.push(questionFisrtName);
      questions.push(questionLastName);

      return getManagers();
    })
    .then((managers) => {
      questions.push(createManagerQuestionList(managers));
      return getRoles();
    })
    .then((roles) => {
      questions.push(createRoleQuestionList(roles));
      return inquirer.prompt(questions);
    })
    .then((answer) => {
      answer.id = employeeId;
      //Update employee
      return updateEmployee(answer);
    })
    .then((result) => {
      return askOptions();
    });
}

module.exports = { askOptions };
