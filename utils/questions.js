const options = [
  {
    type: "list",
    name: "option",
    message: "Whatl would you like to do?",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employees",
      "Add a Department",
      "Add a Role",
      "Add an Employee",
      "Delete an Employee",
      "Update an Employee",
      "Update a Role",
    ],
  },
];

const newDepartmentQuestions = [
  {
    type: "input",
    name: "name",
    message: "Department Name:",
  },
  {
    type: "confirm",
    name: "manager_role",
    message: "Is Manager Department ?",
  },
];

const newRoleQuestions = [
  {
    type: "input",
    name: "title",
    message: "Role title:",
  },
  {
    type: "input",
    name: "salary",
    message: "Annual Salary:",
  },
];

const newEmployeesQuestions = [
  {
    type: "input",
    name: "first_name",
    message: "Employees First Name:",
  },
  {
    type: "input",
    name: "last_name",
    message: "Employees Last Name:",
  },
];

module.exports = {
  options,
  newDepartmentQuestions,
  newRoleQuestions,
  newEmployeesQuestions,
};
