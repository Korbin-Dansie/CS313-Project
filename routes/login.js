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
    res.redirect("login/sign-up");
    res.end();
    return;
});

/**********************************************************
 * Login Page
 **********************************************************/
router.get('/sign-up', readSignupFile);
router.post('/sign-up/callback', signupVerification);

/**********************************************************
 * Function Down Here
 **********************************************************/
function readSignupFile(req, res) {
    //console.log("Current path is: "+ path.join(__dirname));
    res.render('pages/signup');
}

function signupVerification(req, res) {

    //Then name And password variables
    let name = req.body.UserName;
    let pass = req.body.UserPassword;
    let saltRounds = 10;

    /*
    Usernames can contain characters 
    a-z, A-Z, 0-9, underscores, periods, and dashes.
    The username cannot start with a period nor end with a period,
    more then one underscore or dash. 
    Also not have more than one period sequentially. 
    Max length is 30 chars.
    */
    let patt = new RegExp(/^(?!.*\.\.)(?!.*(\.|_{2,}|-{2,})$)[^\W][\w.\-]{0,29}$/); //acceptable name
    let data = patt.test(name);
    console.log(TAG, data);
    //Username is invalid
    if (data == false) {
        res.redirect("../sign-in");
        res.end();
        return;
    }


    //console.log("Current path is: "+ path.join(__dirname));
    //bcrypt.hash(req.body.UserPassword, saltRounds, function (err, hash) {}
    //bcrypt.compare(req.body.UserPassword, hash, (err, response) => {}

    console.debug(TAG, "loginVerification:");
    var result = [];

    //Add to array
    if (name) {
        result.push(name);
    }
    if (pass) {
        console.log(pass);
        bcrypt.hash(pass, saltRounds, (err, hash) => {
            result.push(hash);
            console.debug(result);


            let statment = 'insert into customers (username, userpassword) VALUES ($1, $2)';
        
            pool
                .query(statment, result)
                .then(() => {
                    res.redirect("../sign-in");
                    res.end();
                })
                .catch(err => {
                    console.error('Error executing query', err.stack);
                    res.redirect("/sign-up");
                    res.end();
                })
        
        });
    }
}

/**********************************************************
 * Export File
 **********************************************************/
module.exports = router;