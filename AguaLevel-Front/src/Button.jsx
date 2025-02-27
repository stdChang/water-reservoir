import React from 'react';
import { useState } from "react";
import Chart from 'chart.js/auto';
import { Bar } from "react-chartjs-2";
import "./Button.css"

// input data should be an object, 
// which will be sent as JSON
// reused from TikTok Stage 3
async function sendPostRequest(url,data) {
  let params = {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data) };
  console.log("about to send post request");
  
  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

let userData = null; // needs to be global can't be in function button() why??????

function Button() {
  
  const StevenStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 30
  };
  let time = {month: 4, year: 2022};

  const [buttonName, setButtonName] = useState("See more");
  const [month, setMonth] = useState("April")
  
  async function gitClicked() {
    alert("WE are nutty!");
    console.log(time);
    let response = JSON.parse(await sendPostRequest("/query/getWaterData", time));
    //expect response to be an array, add [0] to pre-existing functions
    //all things with the water capactity use response[1].....
    console.log(response);
    
    let valueList = [];
    for (let i = 0; i < response.length; i++) {
      valueList.push(` ${response[i].stationId}: ${response[i].value} AF`);    
    }
    

    for (let i = 0; i < response.length; i++) {
      waterLevels.push(response[i].value);    
    }
      
    userData = {
      labels: waterPlants,
      datasets: [
        {
          label: "Water Level in Acre-Foot",
          data: waterLevels,
          backgroundColor: [
            "rgb(66, 145, 152)"
          ],
        },
        {
          label: "Maximum Water Capacity in Acre-Foot",
          data: waterPlantCapacities,
          backgroundColor: [
            "rgb(120, 199, 227)"
          ],
        },
      ]
    };

    //alert(userData);

    if (buttonName == "See more") {
      setButtonName("See less");
    } else {
      setButtonName("See more");
    }
    
  };

  let waterLevels = [];
  let waterPlants = ['Shasta', 'Oroville', 'Trinity Lake', 'New Melones', 'San Luis', 'Don Pedro', 'Berryessa'];
  let waterPlantCapacities = [4552000, 3537577, 2447650, 2400000, 1062000, 2030000, 1602000];

  let options = {
    plugins: {
      title: {
        display: true,
        text: 'AGUA LEVELS!!!',
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x:{
        grid: {
          display: false
        },
        stacked: true
      },
      y: {
        grid: {
          display: false
        }
      },
    }
  };

  if (buttonName == "See more") {
    return (
      <div style = {StevenStyle}>
        <div style = {{margin: "auto"}}>
          <button onClick = {gitClicked}>{buttonName}</button>
        </div>
      </div>
    );
  }
  //alert(userData == null);
  
  return (
    <div style = {StevenStyle}>
      <div id = "bar-chart-container">
        <Bar data={userData} options={options} />;
      </div>
    </div>
  );
}

export default Button;