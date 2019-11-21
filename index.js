// server.js
// load the things we need
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file
function readIndexFile (req, res){
  //console.log("Current path is: "+ path.join(__dirname));
  fs.readFile(path.join(__dirname, 'views/pages/index.html'), 'utf8', (err, data) => {
    if (err) {
      //console.error(err.name + ': ' + err.message);
      res.writeHead(200, {"Content-Type": "text/html"});
      res.write("Error Unable To read file");
      res.end();
      return;
    }
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write(data);
    res.end();
  });
}

function readGetDateFile(req,res){
  var vaildInputs = true;
  //Get the weight
  var weight = req.query.Weight;
  //Get what mail type they inputed
  var mailOption = req.query.MailOption;
  //Check if Weight and mailOptions are valid
  if(isNaN(weight) || weight < 0){
    vaildInputs = false;
  }
  if(isNaN(mailOption)){
    vaildInputs = false;
  }

  var cost = calculateRate(mailOption, weight);
  //If cost is Not a Number return to index page
  if(isNaN(cost) || cost == -1){
    vaildInputs = false;
  }

  //The display text before the cost
  //If an issue happed then dispaly an error
  var text = "";
  if(vaildInputs == false){
    text = "An error occurred ";
  }
  else {
    text = "The cost is ";
    cost = "<b>$" + cost + "</b>";
  }
  res.render('pages/displayRate',
  {
    text: text,
    cost: cost
  });
}

function calculateRate(mailType, weight){

  //Debug console log
  console.debug("CalculateRate Debug")
  console.debug("Mail type: " + mailType + "\nWeight: " + weight);
  var value; //The variable we return

  switch (Number(mailType)) {
    /*********************
    * Letters (Stamped)
    *********************/
    case 1:
    if(weight <= 1){
      value = 0.55;
    }
    else if(weight <= 2){
      value = 0.70;
    }
    else if (weight <= 3){
      value = 0.85;
    }
    else if (weight <= 3.5){
      value = 1;
    }
    else{
      //The package is too heavy and you need to see large prices
      console.log("Letters (Stamped) weight is too heavy");
      value = "the weight is too heavey the max weight is " + 3.5 +
      " please see Large Envelopes prices.";
    }
    break;

    /*********************
    * Letters (Metered)
    *********************/
    case 2:
    if(weight <= 1){
      value = 0.50;
    }
    else if(weight <= 2){
      value = 0.65;
    }
    else if (weight <= 3){
      value = 0.80;
    }
    else if (weight <= 3.5){
      value = 0.95;
    }
    else{
      //The package is too heavy and you need to see large prices
      console.log("Letters (Metered) weight is too heavy");
      value = "the weight is too heavey the max weight is " + 3.5 +
      " please see Large Envelopes prices.";
    }
    break;

    /*********************
    * Large Envelopes (Flats)
    *********************/
    case 3:
    if(weight <= 1){
      value = 1;
    }
    else if(weight <= 13){
      value = 1 + ((weight - 1) * 0.15);
    }
    else{
      console.log("Large Envelope weight is to heavy");
      value = "the Large Envelope weight is to heavy the max weight is "
      + 13 + ".";
    }
    break;

    /*********************
    * First-Class Package Service—Retail
    *********************/
    case 4:
    if(weight >= 1 && weight <= 4){
      value = 3.66;
    }
    else if(weight >= 5 && weight <= 8){
      value = 4.39;
    }
    else if(weight >= 9 && weight <= 12){
      value = 5.19;
    }
    else if(weight <= 13){
      value = 5.71;
    }
    else{
      console.log("First-Class Package Service weight is to heavy");
      value = "the First-Class Package Service weight is to heavy"
      + " the max weight is " + 13 + ".";
    }
    break;

    /*********************
    * If there is an invalid package type
    *********************/
    default:
    console.error("Invalid mail type");
    console.error("Mail Type: " + mailType + "\nWeight: " + weight);
    value = "Mail Type or Weight invalid";
    break;
  }

  console.debug("Value: " + value);
  return value;
}



// index page --Reads file index.html
app.get('/', readIndexFile);

// about getData --Reads file displayRate.ejs
app.get('/getData', readGetDateFile);

//Include images
app.use('/img', express.static(path.join(__dirname, 'public/img')))
app.use('/css', express.static(path.join(__dirname, 'public/css')))

app.listen(port);
console.log("listening on port " + port);
