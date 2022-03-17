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
                'Add a role',
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
        if(choices == "Add a role"){
            addRole();
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

  function addRole() {
    // inquirer prompt for adding a new role
    inquirer
      //   role title
      .prompt([
        {
          type: "input",
          name: "role",
          message: "What role title would you like to add?",
          validate: (addRole) => {
            if (addRole) {
              return true;
            } else {
              console.log("Please enter a valid role");
              return false;
            }
          },
        },
        //   role salary
        {
          type: "input",
          name: "salary",
          message: "What is the salary of the role?",
          validate: (addSalary) => {
            if (isNaN(addSalary)) {
              console.log("Please enter a valid salary (numbers only)");
              return false;
            } else {
              return true;
            }
          },
        },
      ])
      .then((answer) => {
        // create array using destructuring
        const inputs = [answer.role, answer.salary];
  
        //   SQL to get department information
        const deptSql = `SELECT
        name, 
        id
        FROM
        department`;
  
        db.query(deptSql, (err, data) => {
          if (err) throw err;

          // functional loop to create a list of departments
          const deptartments = data.map(({ name, id }) => ({
            name: name,
            value: id,
          }));
  
          // inquirer prompt to select department
          inquirer
            .prompt([
              {
                type: "list",
                name: "dept",
                message: "What department is this role in?",
                choices: deptartments,
              },
            ])
            .then((choice) => {
              //   push the selected department into the input array
              const dept = choice.dept;
              inputs.push(dept);
  
              // sql query with dynamic options
              const sql = `INSERT INTO role (title, salary, department_id)
              VALUES (?, ?, ?)`;
  
             db.query(sql, inputs, (err, result) => {
                if (err) throw err;
                console.log(`Added ${answer.role} to roles!`);
                showRoles();
              });
            });
        });
      });
  }