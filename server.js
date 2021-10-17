const inquirer = require("inquirer");
const { options } = require("./utils/questions");
const db = require("./db/connection");

Init();

function Init() {
  db.connect((err) => {
    if (err) throw err;
    console.log("Database connected");
    inquirer
      .prompt(options)
      .then((answers) => {
        console.log(answers);
      })
      .catch((err) => console.error(err));
  });
}
