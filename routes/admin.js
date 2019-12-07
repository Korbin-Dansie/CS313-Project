const express = require('express');
const router = express.Router();
const TAG = "admin.js:";

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
    res.write("Hello");
    res.end();
    return;
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
    let name = req.body.UserName;
    /*
    Usernames can contain characters 
    a-z, A-Z, 0-9, underscores, periods, and dashes.
    The username cannot start with a period nor end with a period,
    more then one underscore or dash. 
    Also not have more than one period sequentially. 
    Max length is 30 chars.
    */
    let patt = new RegExp(/^(?!.*\.\.)(?!.*(\.|_{2,}|-{2,})$)[^\W][\w.\-]{0,29}$/); //acceptable name
    let result = patt.test(name);
    console.log(TAG, result);
    //Username is invalid
    if(result == false){
        res.redirect("../sign-in");
        res.end();
        return;
    }

    let pass = req.body.UserPassword;

    //console.log("Current path is: "+ path.join(__dirname));
    bcrypt.hash(req.body.UserPassword, saltRounds, function (err, hash) {
        // Store hash in database
        res.write("<h1>Testing Submiting form</h1><br>");
        res.write("<a href=\"../sign-in\">Back</a><br>");

        res.write("Name = " + name);
        res.write("<br>");
        res.write("Valid Name = " + result);
        res.write("<br><br>");

        res.write("Pass = " + pass);
        res.write("<br>");
        res.write("Hash = " + hash);
        res.write("<br>");
        res.write("Compare = ");
        bcrypt.compare(req.body.UserPassword, hash, (err, response) => {
            if (response) {
                res.write("true");
            } else {
                res.write("false");
            }
            res.end();
        });
    });
}

/**********************************************************
 * Export File
 **********************************************************/
module.exports = router;