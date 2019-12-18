// server.js
// load the things we need
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const session = require('express-session');
app.use(session({
  secret: 'Shadow',
  resave: false,
  saveUninitialized: true
}));

const TAG = "sever.js:";

require('dotenv').config();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
})); // support encoded bodies

const port = process.env.PORT || 5000;

// set the view engine to ejs
app.set('view engine', 'ejs');
/**********************************************************
 * Include folders
 **********************************************************/
app.use('/img', express.static(path.join(__dirname, 'public/img')))
app.use('/css', express.static(path.join(__dirname, 'public/css')))
app.use('/js', express.static(path.join(__dirname, 'public/js')))
app.use('/test', express.static(path.join(__dirname, 'Test')))

/**********************************************************
 * Home Page
 **********************************************************/
app.get('/', readIndexFile);

/*
var cb0 = function (req, res, next) {
  res.write('CB0')
  next()
},

var cb1 = function (req, res, next) {
  res.write('CB1')
  next()
}

var cb2 = function (req, res) {
  res.write('Hello from C2!')
  res.end();
}

app.get('/example/c', [cb0, cb1, cb2])
*/

/**********************************************************
 * Route for api
 **********************************************************/
const api = require('./routes/api');
app.use('/api/', api);

/**********************************************************
 * Route for login
 **********************************************************/
const login = require('./routes/login');
app.use('/login/', login);

/**********************************************************
 * Route for login
 **********************************************************/
const admin = require('./routes/admin');
app.use('/admin/', admin);

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

  //Create a json obj
  let results = {};
  let i = 0;

  if (session.Cookie.userName != undefined) {
    results["userName"] = session.Cookie.userName;
  } else {
    results["userName"] = "";
  }

  res.render('pages/index', results);
}