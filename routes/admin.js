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
router.get('/', readAdminIndexFile);

/**********************************************************
 * Add Products
 **********************************************************/
router.get('/addProduct', readAddProductFile);

/**********************************************************
 * Add Products
 **********************************************************/
router.get('/addProduct/addValidation', (req, res) => {
    //console.log("Current path is: "+ path.join(__dirname));
    //Validate form
    console.debug(TAG, "addValidation:");
    var result = [];

    for (var i in req.query)
        result.push([i, req.query[i]]);

    console.debug((result));


    let statment = 'insert into products (name, price, sub_categoryid, rarityid, quantity
        \) VALUES ($1, $2, $3, $4, $5)';

    pool
        .query(statment, result)
        .then(res => console.log(res.rows[0].name)) // brianc
        .catch(err => console.error('Error executing query', err.stack))

    res.end();


});

/**********************************************************
 * Function Under Here
 **********************************************************/
function readAdminIndexFile(req, res) {
    //console.log("Current path is: "+ path.join(__dirname));
    res.render('pages/adminIndex');
}

function readAddProductFile(req, res) {
    //console.log("Current path is: "+ path.join(__dirname));
    res.render('pages/addProduct');
}

/**********************************************************
 * Export File
 **********************************************************/
module.exports = router;