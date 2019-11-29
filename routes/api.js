const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const path = require('path');
const TAG = "api.js:";
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
    var sortBy = returnSort(req.query);
    const where = (whereValue == undefined ? "" : whereValue);
    const sort = (sortBy == undefined ? "ORDER BY ProductsID ASC " : sortBy);
    const sql = select + " " + where + " " + sort;

    pool
        .query(sql)
        .then(result => {
            console.debug(TAG,  "productTable" + ": Back From database with results.");
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
            console.debug(TAG, "rarity" + ": From database with results.");
            res.json(result.rows);
        })
        .catch(e =>
            setImmediate(() => {
                console.error('Error executing query', e.stack);
            })
        )
});

/**********************************************************
 * Category
 **********************************************************/
router.get('/Category', (req, res) => {
    var sql = "SELECT * FROM public.category";
    pool
        .query(sql)
        .then(result => {
            console.debug(TAG, "Category" + ": Back From database with results.");
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

    if (data.PriceLow != undefined && data.PriceHigh != undefined) {
        console.debug(TAG + "Prices are numberes: ", !isNaN(data.PriceLow) + " and " + !isNaN(data.PriceHigh));
        //If they are both numbers
        if (!(isNaN(data.PriceLow) || isNaN(data.PriceHigh))) {
            whereClause.push("Products.price BETWEEN " + data.PriceLow + ' and ' + data.PriceHigh);
        }
    }

    if (data.Category != undefined) {
        whereClause.push("LOWER(Category.name) LIKE LOWER('%" + data.Category + "%')");      
    }

    console.debug(TAG, data);

    //For each where clause add "and" between them
    var returnStr = "";
    whereClause.forEach(element => {
        returnStr += element + " and ";
    });

    //Snip off the extra and
    if (returnStr.length > 0) {
        returnStr = returnStr.substring(0, returnStr.length - 4);

    }
    console.debug(TAG + "Return String: ", returnStr);
    if (returnStr != "") {
        return "WHERE " + returnStr + " ";
    } else {
        return "";
    }
}

/**********************************************************
 * Return Where
 * Parse url query data check for valid inputs
 * ORDER BY ProductsID ASC
 **********************************************************/
function returnSort(data) {
    /*
    <option value="None" selected>None</option>
    <option value="ProductName">Name</option>
    <option value="Price">Price</option>
    <option value="Category">Category</option>
    <option value="SubCategory">SubCategory</option>
    <option value="Rarity">Rarity</option>
    */
    var returnStr = "";
    const defaultOrder = "ORDER BY ProductsID ASC ";
    // If we dont have SortBy return default
    // We dont need OrderBy because it will defalut to ASC
    if (data.SortBy == undefined) {
        return defaultOrder;
    }
    //Statment to determine which sort we should use
    returnStr = "ORDER BY ";
    switch (data.SortBy) {
        case "ProductName":
            returnStr += "productsname";
            break;
        case "Price":
            returnStr += "productsprice";
            break;
        case "Category":
            returnStr += "categoryname";
            break;
        case "SubCategory":
            returnStr += "sub_categoryname";
            break;
        case "Rarity":
            returnStr += "rarityname";
            break;
        case "ID":
            returnStr += "productsid";
            break;
        case "quantity":
            returnStr += "productsquantity";
            break;
        default:
            //Error in value
            console.error(TAG, "Error in order by switch value.");
            return defaultOrder;
            break;
    }

    if (data.OrderBy != undefined) {
        if (data.OrderBy == "DESC") {
            returnStr += " DESC";
        } else {
            returnStr += " ASC";
        }
    } else {
        returnStr += " ASC";
    }


    //For each where clause add "and" between them
    console.debug(TAG, "Sort By:" + returnStr);
    return returnStr + " ";
}

/**********************************************************
 * Export File
 **********************************************************/
module.exports = router;