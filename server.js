// Import inquirer 
const inquirer = require("inquirer")
// Import mysql2
const mysql = require('mysql2');
// Import console.table
const cTable = require('console.table'); 

require('dotenv').config()

// Connect to mysql database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '',
      //db name
      database: 'employee_db'
    },
  );

db.connect(err => {
    if(err) throw err;
    console.log('Connected to employee_db')
    startApp();
})

//starts application
var startApp = () => {
    console.log("** EMPLOYEE MANAGER APP **")
    //start inquirer package
    startInquirer();
}

//starts Inquirer
var startInquirer = () => {
    inquirer.prompt([
        {
            type:'list',
            name:'choices',
            message:'Please choose one of the following options',
            choices:[
                'View Departments',
                'View Roles',
                'View Employees',
                'Add department',
                'Add role',
                'Add employee',
                'Update role',
                'Update manager',
                'View by manager',
                'View by department',
                'Delete department',
                'Delete role',
                'Delete employee',
                'View budgets']
        }
    ])
    .then((answers) => {
        const {choices} = answers;
        // Choice: view departments
        if(choices== "View Departments") {
            viewDepartments();
        }
        // Choice: view roles
        else
        if(choices == "View Roles"){
            viewRoles();
        }
        // Choice: view employees
        else
        if(choices == "View Employees"){
            viewEmployees();
        }
        // Choice: add department
        else
        if(choices == "Add department"){
            department();
        }
        // Choice: add role
        else
        if(choices == "Add role"){
            role();
        }
        // Choice: adds an emoloyee
        else
        if(choices == "Add employee"){
            employee();
        }
        // Choice: update role
        else
        if(choices == "Update role"){
            updateRole();
        }
        // Choice: update manager
        else
        if(choices == "Update manager"){
          updateManager();
        }
        // Choice: view by manager
        else
        if(choices == "View by manager"){
          byManager();
       }
       // Choice: view by departments
        else
        if(choices == "View by department"){
           byDept();
        }
        // Choice: delete department
        else
        if (choices === "Delete department") {
          deleteDepartment();
        }
        // Choice: delete role
        else
        if (choices === "Delete role") {
          deleteRole();
        }
        // Choice: delete employee
        else
        if (choices === "Delete employee") {
          deleteEmployee();
        }
        // Choice: view departments
        else
        if (choices === "View budgets") {
          budget();
        }
    }); 
};

//View Departments
viewDepartments = () => {
  //returns a table with: dept id,name 
  const sql = `SELECT department.id,department.name FROM department`;
  db.query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows);
    startInquirer();
  });
}

//View Roles
viewRoles = () => {
  //returns a tables with: role id,title,salary,dept name 
    const sql = `SELECT role.id,role.title,role.salary,department.name AS department FROM role
  INNER JOIN department ON role.department_id = department.id
  `;
    db.query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows);
    startInquirer();
  });
}

//View Employees
viewEmployees = () => {
  //returns a table with employee id,first and last name, title, dept name, salary and mamager name
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,
  CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee
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
department = () => {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'dept',
        message: "Please enter the name of the department you would like to add?",
        validate: dept => {
          if (dept) {
              return true;
          } else {
              console.log('Please enter the name of the department you would like to add?');
              return false;
          }
        }
      }
    ])
      .then(choice => {
        //adds new dept to existing dept table
        const sql = `INSERT INTO department (name) VALUES (?)`;
        db.query(sql, choice.dept, (err, result) => {
          if (err) throw err;
          console.log('New department added: ' + choice.dept); 
          viewDepartments();
      });
    });
  };

  //add Role
  role= () => {
    inquirer.prompt([
      //role title inquirer
        {
          type: "input",
          name: "role",
          message: "Please enter the title of the role you would like to add?",
          validate: (role) => {
            if (role) {
              return true;
            } else {
              console.log("Please enter the title of the role you would like to add?");
              return false;
            }
          },
        }, 
        // role salary inquirer
        {
          type: "input",
          name: "salary",
          message: "Please enter the salary for this role?",
          validate: (salary) => {
            //checks if the user entered a number
            if (isNaN(salary)) {
              console.log("Please enter the salary for this role?");
              return false;
            } else {
              return true;
            }
          },
        },
      ])
      .then((choice) => {
        //role and salary array
        const array = [choice.role, choice.salary];
        //gets the list of departments
        const sqlDept = `SELECT name, id FROM department`;
        //displays the list of departments
        db.query(sqlDept, (err, data) => {
          if (err) throw err;
          const depts = data.map(({ name, id }) => ({
            name: name,
            value: id,
          }));
          // department name inquirer
          inquirer
            .prompt([
              {
                type: "list",
                name: "dept",
                message: "Please select the department which this role belongs to?",
                choices: depts,
              },
            ])
            .then((choice) => {
              //gets the dept choice
              const dept = choice.dept;
              array.push(dept);
              //adds new role to role table
              const sqlRole = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                db.query(sqlRole, array, (err, result) => {
                if (err) throw err;
                console.log(`New role added: ${choice.role}`);
                viewRoles();
              });
            });
        });
      });
  }

// add Employee
employee = () => {
    inquirer.prompt([
      //first name of employee inquirer
        {
          type: 'input', 
          name: 'first',
          message: "Please enter the employee's first name?",
          validate: FN => {
            if (FN) {
                return true;
            } else {
                console.log("Please enter the employee's first name?");
                return false;
            }
          }
        },
        //last name of employee inquirer
        {
            type: 'input', 
            name: 'last',
            message: "Please enter the employee's last name??",
            validate: LN => {
              if (LN) {
                  return true;
              } else {
                  console.log("Please enter the employee's last name?");
                  return false;
              }
            }
          }  ])
          .then((input)=>{
            //first and last name array
              const array = [input.first, input.last];
              //gets the list of roles
              const sqlRole  = `SELECT id, title FROM role`;
              //displays list of roles
              db.query(sqlRole, (err,data)=> {
                  if(err) throw err;
                  const roleList = data.map(({id,title})=> ({
                      name:title,
                      value:id,
                  }))
                  //role inquirer
                  inquirer.prompt([
                      {
                          type:"list",
                          name: "role",
                          message: "Please choose the role for this employee",
                          choices: roleList
                      }
                  ])
                  .then(choice => {
                    //user choice for role
                      const role = choice.role;
                      //adds role to array
                      array.push(role);
                      // gets managers
                      const sqlManager = `SELECT * FROM employee`;
                      db.query(sqlManager,(err,data)=>{
                          if (err) throw err;
                          const managers=data.map(({id,first_name,last_name})=>({
                          name:first_name + " ", last_name, value: id
                          }
                          ));
                          //inquirer for employee manager
                          inquirer.prompt([
                            {
                              type: 'list',
                              name: 'manager',
                              message: "Please select the manager for this employee?",
                              choices: managers
                            }
                          ])
                          .then(choice => {
                            //manager choice 
                              const manager = choice.manager;
                              //adds manager to array
                              array.push(manager);
                              const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                              db.query(sql, array, (err, result) => {
                                if (err) throw err;
                                console.log("New employee has been added")
                                viewEmployees();
         
                            });
                        });
                      });
                    });
                 });
              });
            };



//update employee manager
updateManager = () => {
  //selects employee sql
 const sqlEmp = `SELECT * FROM employee`;
 db.query(sqlEmp,(err,data)=>{
   if(err) throw err;
   const employeesList = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
   //asks user to choose an employee to update
   inquirer.prompt([
    {
     type: 'list',
     name: 'name',
     message: "Please select the employee you would like to update",
     choices: employeesList
    }
  ])
  .then(choice => {
    const employee = choice.name;
    const array=[];
    array.push(employee);
    const sqlManager = `SELECT * FROM employee`;
    db.query(sqlManager,(err,data)=>{
      const managersList = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
      //asks the user to choose a new manager
      inquirer.prompt([
        {
          type: 'list',
          name: 'manager',
          message: "Please select a new manager for this employee",
          choices: managersList
        }
      ])
      .then (choice=>{
        const manager=choice.manager;
        array.push(manager);
        let employee =array[0];
        array[0]=manager;
        array[1]=employee;
        //updates manager
        const sql = `UPDATE employee SET manager_id=? WHERE id=?`;
        db.query(sql,array,(err,data)=>{
        if(err) throw err;
        console.log("Employee manager updated!");  
        //displays employees table again     
        viewEmployees();
        })
      })
    })
  })
  }) 
} 

//update a role
updateRole = () => {
  //select employees from employee table
  const sqlEmp = `SELECT * FROM employee`
  db.query(sqlEmp,(err,data)=> {
      if(err) throw err;
      const employeesList = data.map (({id,first_name,last_name})=>({name: first_name + " "+ last_name, value: id }));
      //inquirer to choose an employee to update
      inquirer.prompt([
          {
           type: 'list',
           name: 'name',
           message: "Please select the employee you would like to update",
           choices: employeesList
          }
      ]) .then(choice => {
          const employee=choice.name;
          const array = [];
          array.push(employee);
          const sqlRole =`SELECT * FROM role`;
          db.query(sqlRole,(err,data)=>{
              const rolesList = data.map(({id,title})=>({name:title,value:id}));
              //inquirer to choose a new role
              inquirer.prompt([
                  {
                    type: 'list',
                    name: 'role',
                    message: "Please choose a new role for this employee",
                    choices: rolesList
                  }
                ])
                .then(choice=>{
                    const role=choice.role;
                    array.push(role);
                    let employee = array[0];
                    array[0] = role;
                    array[1] = employee;
                    //updates role
                    const sql = `UPDATE employee SET role_id =? WHERE id=?`;
                    db.query(sql,array,(err,result)=>{
                        if(err) throw err;
                        console.log("Employee role updated!");
                        //displays list of employees
                        viewEmployees();
                    })
                })
          })
      })
  })
}

//view by manager
byManager = () => {
  //selects employee first name,last name and manager
  const sql = `SELECT 
  employee.first_name, 
  employee.last_name, 
  CONCAT (manager.first_name, " ", manager.last_name) 
  AS manager FROM employee
  LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  db.query(sql,(err,rows)=>{
    if (err) throw err; 
    console.table(rows); 
    startInquirer();
  })
}

//view by department
byDept = () => {
  //selects employee fist name,last name and department name
  const sql = `SELECT 
  employee.first_name,
  employee.last_name,
  department.name 
  AS department FROM employee
  LEFT JOIN role ON employee.role_id = role.id 
  LEFT JOIN department ON role.department_id = department.id`

  db.query(sql,(err,rows)=>{
    if (err) throw err; 
    console.table(rows); 
    startInquirer();
  })
}

//delete department
deleteDepartment = () => {
  //gets depts from department table
  const sqlDept = `SELECT * FROM department`; 
  db.query(sqlDept, (err, data) => {
    //displays all depts as list of choices
    if (err) throw err; 
    const allDept = data.map(({ name, id }) => ({ name: name, value: id }));
    //asks user to choose a department they wish to remoce
    inquirer.prompt([
      {
        type: 'list', 
        name: 'dept',
        message: "Please select the department you wish to remove",
        choices: allDept
      }
    ])
      .then(choice => {
        //delete dept
        const dept = choice.dept;
        const sql = `DELETE FROM department WHERE id = ?`;
         db.query(sql, dept, (err, result) => {
          if (err) throw err;
          console.log("A department has been removed"); 
          //displays table of departments
          viewDepartments();
      });
    });
  });
}

// delete role
deleteRole = () => {
  //gets roles from role table
  const sqlRole = `SELECT * FROM role`; 
  //displays all roles as a list of choices
  db.query(sqlRole, (err, data) => {
    if (err) throw err; 
    const allRoles = data.map(({ title, id }) => ({ name: title, value: id }));
    //asks user to choose a role they wish to delete
    inquirer.prompt([
      {
        type: 'list', 
        name: 'role',
        message: "Please select the role you wish to remove",
        choices: allRoles
      }
    ])
      .then(choice => {
        const role = choice.role;
        //deletes a role
        const sql = `DELETE FROM role WHERE id = ?`;
        db.query(sql, role, (err, result) => {
          if (err) throw err;
          console.log("A role has been removed"); 
          //displays table of roles again
          viewRoles();
      });
    });
  });
};

//delete Employee
deleteEmployee = () => {
  // get employees from employee table 
  const sqlEmp = `SELECT * FROM employee`;
  //displays all employees as a list of choices
  db.query(sqlEmp, (err, data) => {
    if (err) throw err; 
    const allEmployees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
    //asks user to choose an employee
    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Please select the employee you wish to remove ",
        choices: allEmployees
      }
    ])
      .then(choice => {
        //deletes the employee
        const employee = choice.name;
        const sql = `DELETE FROM employee WHERE id = ?`;
        db.query(sql, employee, (err, result) => {
          if (err) throw err;
          console.log("An employee has been removed");
          //displays table of employees again
          viewEmployees();
    });
  });
 });
};

// view department budget 
budget = () => {
  //gets dept id,name and sums the budgets 
  const sql = `SELECT department_id AS id, 
                      department.name AS department,
                      SUM(salary) AS budget
               FROM  role  
               JOIN department ON role.department_id = department.id GROUP BY  department_id`;
  
  db.query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows);
    startInquirer(); 
  });            
};