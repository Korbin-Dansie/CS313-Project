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
router.get('/deleteProduct', readDeleteProductFile);


/**********************************************************
 * Add Products
 **********************************************************/
router.get('/addProduct/addValidation', (req, res) => {
    //console.log("Current path is: "+ path.join(__dirname));
    //Validate form
    console.debug(TAG, "addValidation:");
    var result = [];

    //Add to array
    if (req.query.ProductName) {
        result.push(req.query.ProductName);
    }
    if (req.query.Price) {
        result.push(req.query.Price);
    }
    if (req.query.SubCategory) {
        result.push(req.query.SubCategory);
    }
    if (req.query.Rarity) {
        result.push(req.query.Rarity);
    }
    if (req.query.Quantity) {
        result.push(req.query.Quantity);
    }

    console.debug(result);
    console.log(req.query);


    let statment = 'insert into products (name, price, sub_categoryid, rarityid, quantity) VALUES ($1, $2, $3, $4, $5)';

    pool
        .query(statment, result)
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

function readDeleteProductFile(req, res) {
    //console.log("Current path is: "+ path.join(__dirname));
    res.render('pages/deleteProduct');
}


/**********************************************************
 * Export File
 **********************************************************/
module.exports = router;