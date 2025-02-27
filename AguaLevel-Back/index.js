// index.js
// This is our main server file

// include express
const express = require("express");
// create object to interface with express
const app = express();

const fetch = require("cross-fetch"); 

const bodyParser = require('body-parser');


// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})

app.use(bodyParser.json());

// No static server or /public because this server
// is only for AJAX requests

// respond to all AJAX querires with this message
app.post("/query/getWaterData", async (req, res) => {
  let data = req.body;
  console.log("We received: ", data.year);
  let waterData = await waterCallToCDEC(data.month, data.year);
  console.log("We gonna send em: ", waterData, "YATTA!!");
  return res.json(waterData); // May change if data is an object instead.
});

app.use(function(req, res, next) {
  res.json({msg: "No such AJAX request"})
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});

async function waterCallToCDEC (month, year) {
  let startMonth = (month < 10) ? `0${month}` : `${month}`;
  let startYear = `${year}`;
  let endMonth = `12`;
  let endYear = `2022`;
  
  if (month == 12) {
    endMonth = `01`;
    endYear = `${year + 1}`;
  } else {
    endMonth = (month + 1 < 10) ? `0${month + 1}` : `${month + 1}`;
    endYear = `${year}`;
  }
  
  const url = `https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=SHA,ORO,CLE,NML,LUS,DNP,BER&SensorNums=15&dur_code=M&Start=${startYear}-${startMonth}-01&End=${endYear}-${endMonth}-01`; // Gives us the month for the 7 water places
  console.log(url);

  let waterResponse = await fetch(url);
  let waterData = await waterResponse.json();
  console.log(waterData);
  let listOfWaters = [];

  for (let i = 0; i < waterData.length; i += 2) {
    listOfWaters.push(waterData[i]);
  }
  
  return listOfWaters;
  
}