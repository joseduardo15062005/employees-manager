const inquirer = require("inquirer");
const cTable = require("console.table");

const {
  options,
  newDepartmentQuestions,
  newRoleQuestions,
  newEmployeesQuestions,
} = require("./utils/questions");
const {
  getEmployees,
  getEmployee,
  getDeparments,
  getRoles,
  getRole,
  getManagers,
  insertDepartment,
  insertRole,
  insertEmployee,
  updateEmployee,
  updateRole,
} = require("./db/connection");

Init();

function Init() {
  askOptions();
}

function askOptions() {
  inquirer
    .prompt(options)
    .then((answer) => {
      console.log(answer);
      switch (answer.option) {
        case "View All Departments":
          console.clear();
          getDeparments().then((departments) => {
            printData("Departments", departments);
            return askOptions();
          });
          break;
        case "View All Roles":
          console.clear();
          getRoles().then((roles) => {
            printData("Roles", roles);
            return askOptions();
          });
          break;
        case "View All Employees":
          console.clear();
          getEmployees().then((employees) => {
            printData("Employees", employees);
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
        case "Update an Employee":
          console.clear();
          return update_Employee();
        case "Update a Role":
          console.clear();
          return update_Role();
      }
    })
    .catch((err) => console.error(err));
}

async function update_Role() {
  const questions = [];
  const departments = await getDeparments();
  let roleId = 0;

  getRoles()
    .then((roles) => {
      const question = [];
      question.push(createRoleListQuestion(roles, "Select the role update:"));
      return inquirer.prompt(question);
    })
    .then((answer) => {
      roleId = answer.role_id;
      return getRole(roleId);
    })
    .then((role) => {
      console.log(role);
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
        createDepartmentListQuestion(departments, "Select the Department")
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
    });
}

function update_Employee() {
  const questions = [];
  let employeeId = 0;
  getEmployees()
    .then((employees) => {
      const employeeQuestion = createEmployeeListQuestion(employees);
      return inquirer.prompt(employeeQuestion);
    })
    .then((answer) => {
      //Select the employee to edit
      return getEmployee(answer.employee_id);
    })
    .then((employee) => {
      employeeId = employee[0].id;
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
      questions.push(createManagerQuestionChoice(managers));
      return getRoles();
    })
    .then((roles) => {
      questions.push(createRoleQuestionChoice(roles));
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

function createDepartment() {
  inquirer.prompt(newDepartmentQuestions).then((answer) => {
    const { name, manager_role } = answer;
    insertDepartment(name, manager_role).then((result) => {
      return askOptions();
    });
  });
}

let roleQuestion = newRoleQuestions;

function createRole() {
  getDeparments().then((departments) => {
    roleQuestion.push(createRoleQuestion(departments));

    inquirer.prompt(roleQuestion).then((answer) => {
      console.log(answer);
      const { title, salary, department_id } = answer;
      insertRole(title, salary, department_id).then((result) => {
        return askOptions();
      });
    });
  });
}
function createEmployee() {
  let employeeQuestions = newEmployeesQuestions;
  getRoles()
    .then((roles) => {
      employeeQuestions.push(createRoleQuestionChoice(roles));
      return getManagers();
    })
    .then((managers) => {
      employeeQuestions.push(createManagerQuestionChoice(managers));
      inquirer.prompt(employeeQuestions).then((answer) => {
        const { first_name, last_name, role_id, manager_id } = answer;
        insertEmployee(first_name, last_name, manager_id, role_id).then(
          (result) => {
            return askOptions();
          }
        );
      });
    });
}

function createRoleQuestionChoice(roles) {
  let choices = [];
  for (const { title, id } of roles) {
    const choice = {
      name: title,
      value: id,
    };
    choices.push(choice);
  }
  return {
    type: "list",
    name: "role_id",
    message: "Select the employee role:",
    choices: choices,
  };
}

function createDepartmentListQuestion(departments, question) {
  let choices = [];
  for (const { name, id } of departments) {
    const choice = {
      name,
      value: id,
    };
    choices.push(choice);
  }
  return {
    type: "list",
    name: "department_id",
    message: question,
    choices: choices,
  };
}

function createRoleListQuestion(roles, question) {
  let choices = [];
  for (const { title, id } of roles) {
    const choice = {
      name: title,
      value: id,
    };
    choices.push(choice);
  }
  return {
    type: "list",
    name: "role_id",
    message: question,
    choices: choices,
  };
}

function createManagerQuestionChoice(managers) {
  let choices = [];
  for (const { name, id } of managers) {
    const choice = {
      name,
      value: id,
    };
    choices.push(choice);
  }
  return {
    type: "list",
    name: "manager_id",
    message: "Select the employee manager:",
    choices: choices,
  };
}

function createRoleQuestion(departments) {
  let choices = [];
  for (const { name, id } of departments) {
    const choice = {
      name,
      value: id,
    };
    choices.push(choice);
  }
  return {
    type: "list",
    name: "department_id",
    message: "Select the Department",
    choices: choices,
  };
}

function createEmployeeListQuestion(employees) {
  let choices = [];
  for (const { full_name, id } of employees) {
    const choice = {
      name: full_name,
      value: id,
    };
    choices.push(choice);
  }
  return {
    type: "list",
    name: "employee_id",
    message: "Select the Employee to update",
    choices: choices,
  };
}

function printData(title, data) {
  console.log(`\n------------------\n${title}\n------------------`);
  console.table(data);
}
