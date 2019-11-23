// server.js
// load the things we need
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// set the view engine to ejs
app.set('view engine', 'ejs');
/**********************************************************
 * Include folders
 **********************************************************/
app.use('/img', express.static(path.join(__dirname, 'public/img')))
app.use('/css', express.static(path.join(__dirname, 'public/css')))
app.use('/test', express.static(path.join(__dirname, 'Test')))

/**********************************************************
 * Home Page
 **********************************************************/
app.get('/', readIndexFile);

/**********************************************************
 * Route for api
 **********************************************************/
const api = require('./routes/api');
app.use('/api/', api);

/**********************************************************
 * For Unkown pages
 * ! Do not put other pages after this
 **********************************************************/
app.use('*', readUnkownPage);


/**********************************************************
 * Start listening on port
 **********************************************************/
app.listen(port);
console.log("listening on port " + port);


/**********************************************************
 * Functions Down Here
 **********************************************************/
function readUnkownPage(req, res) {
  //console.log("Current path is: "+ path.join(__dirname));
  var location = path.join(__dirname, 'views/pages/unknownPage.html');
  fs.readFile(location, 'utf8', (err, data) => {
    if (err) {
      //console.error(err.name + ': ' + err.message);
      res.writeHead(404, {
        "Content-Type": "text/html"
      });
      res.write("Error Unable To read file. At" + location);
      res.end();
      return;
    }
    res.writeHead(404, {
      "Content-Type": "text/html"
    });
    res.write(data);
    res.end();
  });
}

function readIndexFile(req, res) {
  //console.log("Current path is: "+ path.join(__dirname));
  fs.readFile(path.join(__dirname, 'views/pages/index.html'), 'utf8', (err, data) => {
    if (err) {
      console.error("Error Reading file", err);
      readUnkownPage(req, res);
      return;
    }
    res.writeHead(200, {
      "Content-Type": "text/html"
    });
    res.write(data);
    res.end();
  });
}
