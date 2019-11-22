const express = require('express');
const app = express();
const path = require('path');

const router = express.Router();
const fs = require('fs');


router.get('/', (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });
    res.write("Api File");
    res.end();
});

router.get('/DataBase', (req, res) => {
    

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