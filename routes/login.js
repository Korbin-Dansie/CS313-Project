const express = require('express');

const app = express();
const router = express.Router();
const TAG = "login.js:";

const fs = require('fs');
const path = require('path');

const bcrypt = require('bcrypt');
const saltRounds = 10;

var session = require('express-session');
app.use(session({
    secret: 'Shadow',
    resave: false,
    saveUninitialized: true
}));


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
    res.redirect("/login/sign-up");
    res.end();
    return;
});

router.get('/profile', readProfilePage);

router.get('/signout', function (req, res, next) {
    session = null;
    res.redirect('/logout');
    res.end();
    return;
});


/**********************************************************
 * Login Page
 **********************************************************/
router.get('/sign-up', readSignupFile);
router.post('/sign-up/callback', signupVerification);

router.get('/sign-in', readSigninFile);
router.post('/sign-in/callback', signinVerification);

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
    //console.debug(TAG, data);
    //Username is invalid
    if (data == false) {
        res.redirect("../sign-up");
        res.end();
        return;
    }


    //console.log("Current path is: "+ path.join(__dirname));
    //bcrypt.hash(req.body.UserPassword, saltRounds, function (err, hash) {}
    //bcrypt.compare(req.body.UserPassword, hash, (err, response) => {}

    //console.debug(TAG, "loginVerification:");
    var result = [];

    //Add to array
    if (name) {
        result.push(name);
    }
    if (pass) {
        bcrypt.hash(pass, saltRounds, (err, hash) => {
            result.push(hash);
            //console.debug(result);


            let statment = 'insert into customers (username, userpassword) VALUES ($1, $2)';

            pool
                .query(statment, result)
                .then(() => {
                    res.redirect("../sign-in");
                    res.end();
                })
                .catch(err => {
                    console.error('Error executing query', err.stack);
                    res.redirect("../sign-up");
                    res.end();
                })

        });
    }
}


function readSigninFile(req, res) {
    //console.log("Current path is: "+ path.join(__dirname));
    res.render('pages/signin');
}

function signinVerification(req, res) {

    //Then name And password variables
    let name = req.body.UserName;
    let pass = req.body.UserPassword;

    //console.log("Current path is: "+ path.join(__dirname));
    //bcrypt.hash(req.body.UserPassword, saltRounds, function (err, hash) {}
    //bcrypt.compare(req.body.UserPassword, hash, (err, response) => {}

    //console.debug(TAG, "loginVerification:");
    var result = [];

    //Add to array
    if (name !== '' && pass !== '') {
        result.push(name);
        // userpassword
        let statment = 'Select * FROM customers WHERE username = $1';

        pool
            .query(statment, result)
            .then((responseDB) => {
                console.debug(responseDB.rows);
                if (responseDB.rows[0].userpassword != undefined) {
                    let hash = responseDB.rows[0].userpassword;

                    bcrypt.compare(pass, hash, (err, response) => {
                        // res == true
                        if (response == true) {
                            session = require('express-session');
                            session.Cookie.userName = responseDB.rows[0].username;
                            res.redirect("/sign-in");
                        } else {
                            res.redirect("../sign-in");
                        }
                        res.end();
                    });
                } else {
                    res.redirect("../sign-in");
                    res.end();
                }
            })
            .catch(err => {
                console.error('Error executing query', err.stack);
                res.end();
            })
    } else {
        res.redirect("../sign-in");
        res.end();
    }
}

function readProfilePage(req, res) {
    //console.log("Current path is: "+ path.join(__dirname));

    //If the varible is unset return to the sign in page
    if (session.Cookie.userName == undefined) {
        res.redirect("sign-in");
        res.end();
        return;
    }
    res.render('pages/profile');
}

/**********************************************************
 * Export File
 **********************************************************/
module.exports = router;