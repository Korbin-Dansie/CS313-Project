const express = require('express');
const app = express();
const router = express.Router();

const path = require('path');
const { Pool } = require('pg');
const pool = new Pool();

var conString = process.env.DATABASE_URL;

router.get('/', (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });
    res.write("Api File");
    res.end();
});

router.get('/users', function(req, res, next) {
    pool.connect((err, client, release) => {
        if (err) {
          return console.error('Error acquiring client', err.stack)
        }
        client.query('SELECT NOW()', (err, result) => {
          release()
          if (err) {
            return console.error('Error executing query', err.stack)
          }
          console.log(result.rows)
        })
      })
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