// server.js
// load the things we need
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// index page --Reads file index.html
app.get('/', (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/html"
  });
  res.write("Main File");
  res.end();
});


//Set up /api/
const api = require('./routes/api');
app.use('/api/', api);


//For unkown pages
// ! Do not put other pages after this
app.use('*', readUnkownPage);




//Include images
app.use('/img', express.static(path.join(__dirname, 'public/img')))
app.use('/css', express.static(path.join(__dirname, 'public/css')))

//Test Folder
app.use('/test', express.static(path.join(__dirname, 'Test')))

app.listen(port);
console.log("listening on port " + port);


/**********************************************************
 * Functions Down Here
 **********************************************************/
function readUnkownPage(req, res) {
  //console.log("Current path is: "+ path.join(__dirname));
  fs.readFile(path.join(__dirname, 'views/pages/unknownPage.html'), 'utf8', (err, data) => {
    if (err) {
      //console.error(err.name + ': ' + err.message);
      res.writeHead(200, {
        "Content-Type": "text/html"
      });
      res.write("Error Unable To read file");
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