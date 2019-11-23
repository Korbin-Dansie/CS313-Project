const express = require('express');
const app = express();
const router = express.Router();

const path = require('path');
const connectionString = process.env.DATABASE_URL + "?ssl=true";
const {
    Pool
} = require('pg');

const pool = new Pool({
    connectionString: connectionString
});
console.log("ENV Variable:" + connectionString);

router.get('/', (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });
    res.write("Api File");
    res.end();
});



router.get('/r', function (req, res, next) {
    var sql = "SELECT * FROM public.rarity";
    pool.query(sql, function (err, result) {
        // If an error occurred...
        if (err) {
            console.error("Error in query: ")
            console.error(err);
        }

        // Log this to the console for debugging purposes.
        console.debug("Back from DB with result:");
        res.json(JSON.stringify(result.rows));
        res.end();
    });
});






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

module.exports = router;