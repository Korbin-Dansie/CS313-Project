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
 * Export File
 **********************************************************/
module.exports = router;