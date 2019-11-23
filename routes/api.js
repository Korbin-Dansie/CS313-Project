const express = require('express');
const app = express();
const router = express.Router();

const path = require('path');

const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});
client.connect();


router.get('/', (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });
    res.write("Api File\n");
    res.write(testLog);

    res.end();
});


router.get('/DataBase', (req, res) => {

    client.query('SELECT * FROM public.rarity;', (err, response) => {
        if (err) {
            res.writeHead(404, {
                "Content-Type": "text/plain"
            });
            res.write("Error Unable to make query to Rarity");
            res.end();
            return;

        }
        for (let row of res.rows) {
            console.log("api.js:" + JSON.stringify(row));
        }
        client.end();
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