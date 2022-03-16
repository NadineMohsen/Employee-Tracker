// import inquirer and express
const inquirer = require("inquirer")
// Import and require mysql2
const mysql = require('mysql2');
// import console.table
const cTable = require('console.table'); 

require('dotenv').config()

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password here
      password: '',
      database: 'employee_db'
    },
  );
//Check if there's an error, else starts the application
db.connect(err => {
    if(err) throw err;
    console.log('Connected to employee_db database')
    startApp();
})
//displays the following as a start of the app
var startApp = () => {
    console.log("***********************************")
    console.log("*                                 *")
    console.log("*        EMPLOYEE MANAGER         *")
    console.log("*                                 *")
    console.log("***********************************")
    startInquirer();
}
//starts Inquirer
var startInquirer = () => {
    inquirer.prompt([
        {
            type:'list',
            name:'choices',
            message:'What would you like to do',
            choices:[
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add a department',
                'Ad a role',
                'Add an employee',
                'Update an employee role',
                'Update an employee manager',
                'View employees by manager',
                'View employees by department',
                'Delete a department',
                'Delete a role',
                'Delete an employee',
                'View department budgets',
                'No action']
        }
    ])
    .then((answers) => {
        const {choices} = answers;
        // In case user chooses View all departments
        if(choices== "View All Departments") {
            showDepartments();
        }
        if(choices == "View All Roles"){
            showRoles();
        }
        if(choices == "View All Employees"){
            showEmployees();
        }
        if(choices == "Add a department"){
            addDepartment();
        }
    }); 
};

//Show Departments
showDepartments = () => {
    const sql = `SELECT 
  department.id,
  department.name
  FROM
  department
  `;

  db.query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows);
    startInquirer();
  });
}

//Show Roles
showRoles = () => {
    const sql = `SELECT 
  role.id,
  role.title,
  role.salary,
  department.name AS department
  FROM
  role
  INNER JOIN department ON role.department_id = department.id
  `;

  db.query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows);
    startInquirer();
  });
}

//Show Employees
showEmployees = () => {
    const sql = `SELECT 
  employee.id,
  employee.first_name,
  employee.last_name,
  role.title,
  department.name AS department,
  role.salary,
  CONCAT (manager.first_name, " ", manager.last_name) AS manager
  FROM
  employee
  LEFT JOIN role ON employee.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  db.query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows);
    startInquirer();
  });
}

//add department
addDepartment = () => {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'addDept',
        message: "What is the name of the department?",
        validate: addDept => {
          if (addDept) {
              return true;
          } else {
              console.log('Please enter a department');
              return false;
          }
        }
      }
    ])
      .then(answer => {
        const sql = `INSERT INTO department (name)
                    VALUES (?)`;
        db.query(sql, answer.addDept, (err, result) => {
          if (err) throw err;
          console.log('Added ' + answer.addDept + " to departments!"); 
          showDepartments();
      });
    });
  };