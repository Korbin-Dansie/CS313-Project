const express = require('express');
const app = express();
const router = express.Router();

const path = require('path');

const fs = require('fs');


const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

client.connect();

client.query('SELECT * FROM public.rarity;', (err, res) => {
  if (err) {
      console.log(err);
      return;
  }
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});


//console.log("API.JS: " +  process.env.DATABASE_URL);

router.get('/', (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });
    res.write("Api File");
    res.end();
});

router.get('/DataBase', (req, res) => {
    console.log("Here");

            res.writeHead(200, {
                "Content-Type": "text/html"
            });
            res.write("Got Here\n");
            res.end();

});

router.get('/Data', (req, res) => {
    fs.readFile(path.join(__dirname, '../Test/info.json'), 'utf8', (err, data) => {
        if (err) {
            //console.error(err.name + ': ' + err.message);
            res.writeHead(200, {
                "Content-Type": "text/html"
            });
            res.write("Error Unable To read file");
            res.end();
            return;
        }

   
        let student = JSON.parse(data);
        console.log(student);
    
        res.json(student);
        res.end();
    });

});

module.exports = router;