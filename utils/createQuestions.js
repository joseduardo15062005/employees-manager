//Create the Role Question list
function createRoleQuestionList(roles) {
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

//Create the Department Question list
function createDepartmentQuestionList(departments) {
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

//Create the manager Question list
function createManagerQuestionList(managers) {
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

//Create the Employee Question list
function createEmployeeQuestionList(employees) {
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

module.exports = {
  createDepartmentQuestionList,
  createRoleQuestionList,
  createManagerQuestionList,
  createEmployeeQuestionList,
};
