// import inquirer and express
const inquirer = require("inquirer")
const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');

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

db.connect(err => {
    if(err) throw err;
    console.log('Connected to employee_db database')
    startApp();
})

var startApp = () => {
    console.log("***********************************")
    console.log("*                                 *")
    console.log("*        EMPLOYEE MANAGER         *")
    console.log("*                                 *")
    console.log("***********************************")
    startInquirer();
}

var startInquirer = () => {
    
}
