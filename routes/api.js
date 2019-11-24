const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');

const path = require('path');
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
router.get('/', readAPIHomepage);

/**********************************************************
 *  Product Table
 *  Main table
 **********************************************************/
router.get('/productTable', function (req, res, next) {
    const select = "select Products.id AS ProductsID, Category.name AS CategoryName, Sub_Category.name AS Sub_CategoryName, Rarity.name AS RarityName, Products.name AS ProductsName, Products.quantity AS ProductsQuantity, Products.price AS ProductsPrice from products left OUTER JOIN Rarity ON products.rarityid = Rarity.id left OUTER JOIN Sub_Category ON products.sub_categoryid = Sub_Category.id left OUTER JOIN Category ON Sub_Category.categoryid = Category.id";
    //If undefined use and empty string
    var whereValue = returnWhere(req.query);
    const where = (whereValue == undefined ? "" : whereValue);
    const sort = "ORDER BY ProductsID ASC";
    const sql = select + " " + where + " " + sort;

    pool
        .query(sql)
        .then(result => {
            console.debug("Back From database with results.");
            res.json(result.rows);
        })
        .catch(e =>
            setImmediate(() => {
                console.error('Error executing query', e.stack);
            })
        )
});

/**********************************************************
 * Rarity
 **********************************************************/
router.get('/rarity', function (req, res, next) {
    var sql = "SELECT * FROM public.rarity";
    pool
        .query(sql)
        .then(result => {
            console.debug("Back From database with results.");
            res.json(result.rows);
        })
        .catch(e =>
            setImmediate(() => {
                console.error('Error executing query', e.stack);
            })
        )
});

/**********************************************************
 * Test file
 * TODO: Delete later
 **********************************************************/
router.get('/Data', (req, res) => {
    const location = path.join(__dirname, '../Test/info.json');
    fs.readFile(location, 'utf8', (err, data) => {
        if (err) {
            //console.error(err.name + ': ' + err.message);
            res.writeHead(404, {
                "Content-Type": "text/plain"
            });
            res.write("Error Unable To read file. At " + location);
            res.end();
            return;
        }
        let info = JSON.parse(data);
        console.debug(info);
        res.json(info);
        res.end();
    });

});

/**********************************************************
 * Functions Down Here
 **********************************************************/
function readAPIHomepage(req, res) {
    //console.log("Current path is: "+ path.join(__dirname));
    var location = path.join(__dirname, '../views/pages/api.html');
    fs.readFile(location, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading API File", err);
            res.writeHead(404, {
                "Content-Type": "text/html"
            });
            res.write("Error Reading file");
            res.end();
            return;
        }

        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.write(data);
        res.end();
    });
}

/**********************************************************
 * Return Where
 * Parse url query data check for valid inputs
 **********************************************************/
function returnWhere(data) {
    var whereClause = [];
    if (data.ProductName != undefined) {
        whereClause.push("LOWER(Products.name) LIKE LOWER('%" + data.ProductName + "%')");
    }

    //For each where clause add "and" between them
    var returnStr = "";
    whereClause.forEach(element => {
        returnStr += element;
    });
    console.debug("Return String:", returnStr);
    if(returnStr != ""){
        return "WHERE " + returnStr;
    }
    else{
        return "";
    }
}
/**********************************************************
 * Export File
 **********************************************************/
module.exports = router;