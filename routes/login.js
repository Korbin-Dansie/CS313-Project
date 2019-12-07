const express = require('express');
const router = express.Router();
const TAG = "login.js:";

const fs = require('fs');
const path = require('path');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const connectionString = process.env.DATABASE_URL + "?ssl=true";
const {
    Pool
} = require('pg');

const pool = new Pool({
    connectionString: connectionString
});

/**********************************************************
 * Home Page
 **********************************************************/
router.get('/', (req, res) => {
    res.send("Hello");
});

/**********************************************************
 * Login Page
 **********************************************************/
router.get('/sign-in', readLoginFile);
router.post('/sign-in/callback', loginVerification);

/**********************************************************
 * Function Down Here
 **********************************************************/
function readLoginFile(req, res) {
    //console.log("Current path is: "+ path.join(__dirname));
    res.render('pages/login');
  }
  
  function loginVerification(req, res) {
    //console.log("Current path is: "+ path.join(__dirname));
    let name = req.body.UserName;
    let pass = req.body.UserPassword;
  
    res.write("Hello\n");
    res.write("Name = " + name);
    res.write("\n");
    res.write("Pass = " + pass);
    res.end();
  
  }

/**********************************************************
 * Export File
 **********************************************************/
module.exports = router;