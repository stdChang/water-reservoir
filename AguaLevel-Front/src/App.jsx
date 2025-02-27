import React from 'react';
import './reset.css'
import './App.css';
import { useState } from "react";
import Chart from 'chart.js/auto';
import { Bar } from "react-chartjs-2";
import './Calendar.jsx'
import Calendar from './Calendar.jsx';

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

//TODO - steven remove "agua levels"

function App() {
  const [buttonName, setButtonName] = useState("See more");
  const [showCalendar, setShowCalendar] = useState(false);
  const [time, setTime] = useState({month: 4, year: 2022});
  function monthSetter(newMonth){
    let currYear = time.year;
    setTime({month: newMonth, year: currYear});
    askBackendForWater();
  }

  function yearSetter(newYear){
    let currMonth = time.month;
    setTime({month: currMonth, year: newYear});
    askBackendForWater();
  }

  function turnOnCalendar(){
    setShowCalendar(true);
  }
  
  let options = {
    plugins: {
      title: {
        display: true,
        text: '',
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
  let waterLevels = [];
  let waterPlants = ['Shasta', 'Oroville', 'Trinity Lake', 'New Melones', 'San Luis', 'Don Pedro', 'Berryessa'];
  let waterPlantCapacities = [4552000, 3537577, 2447650, 2400000, 1062000, 2030000, 1602000];
  const [userData, updateUserData] = useState({
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
    });

  
  async function askBackendForWater(){
    console.log(time);
    let response = JSON.parse(await sendPostRequest("/query/getWaterData", time));
    console.log(response);

    waterLevels = [];
    for (let i = 0; i < response.length; i++) {
      waterLevels.push(response[i].value);    
    }
    updateUserData({
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
    });
  }
  
  async function gitClicked() {
    askBackendForWater();
    //alert(userData);

    if (buttonName == "See more") {
      setButtonName("See less");
    } else {
      setButtonName("See more");
    }
    
  };
  let months = ["I'm too tired", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function numberToMonth(number, list) {
    return list[number];
  }

    return (
    <div id="appContainer">
      <hr/>
      <div id="header">
        <h1>Water storage in California reservoirs</h1>
      </div>
      
      <div id="main">
        <div id="leftCol">
          <div id="image">
            <figure>
              <img src="https://cdn.theatlantic.com/thumbor/HYdYHLTb9lHl5ds-IB0URvpSut0=/900x583/media/img/photo/2014/09/dramatic-photos-of-californias-historic-drought/c01_53834006/original.jpg
  "/>
              <figcaption>
                Lake Oroville in the 2012-2014 drought. Image credit Justin Sullivan, from The Atlatic article Dramatic Photos of California's Historic Drought.
              </figcaption>
            </figure>
          </div>
          <div id="noImage">
              <p id="bigPara">
            California's reservoirs are part of a <a href="https://www.ppic.org/wp-content/uploads/californias-water-storing-water-november-2018.pdf">complex water storage system</a>.  The State has very variable weather, both seasonally and from year-to-year, so storage and water management is essential.  Natural features - the Sierra snowpack and vast underground aquifers - provide more storage capacity,  but reservoirs are the part of the system that people control on a day-to-day basis.  Managing the flow of surface water through rivers and aqueducts, mostly from North to South, reduces flooding and attempts to provide a steady flow of water to cities and farms, and to maintain natural riparian habitats.  Ideally, it also transfers some water from the seasonal snowpack into long-term underground storage.  Finally, hydro-power from the many dams provides carbon-free electricity. 
            </p><p id="smallPara">
            California's water managers monitor the reservoirs carefully, and the state publishes daily data on reservoir storage.
            </p>
            <button onClick={gitClicked}>{buttonName}</button>
          </div>
        </div>
        
        <GetColumn/>
      </div>
    </div>
    );

  function GetColumn() {
    if (buttonName == "See less") {
      return (
        <div id="rightCol-active">
          
          <div id="monthAndText">
            <p>
Here's a quick look at some of the data on reservoirs from the <a href="https://cdec.water.ca.gov/index.html">California Data Exchange Center</a>, which consolidates climate and water data from multiple federal and state government agencies, and  electric utilities.  Select a month and year to see storage levels in the eleven largest in-state reservoirs.
            </p>

            <p id="changeMonthTitle">
            Change Month:
            </p>

            <div id="monthContainer">
              <div id="monthPickerDiv" onClick={turnOnCalendar}> <p id="buttonDate">{numberToMonth(time.month, months)} {time.year}</p>                
              </div>
              <div id="actualCalendarPicker">
                <Calendar 
                  month={time.month}
                  year={time.year}
                  visibility={showCalendar}
                  calendarSetter={setShowCalendar}
                  dateYsetter={yearSetter}
                  dateMsetter={monthSetter}
                  barUpdater={askBackendForWater}
                  />
              </div>
            </div>
            
          </div/*closes off month and text*/>
          
          <div id="chartDiv">
            <div id = "barChartContainer">
              <Bar data={userData} options={options} />
            </div>
          </div>
          
        </div>)
    } else {
      return <div></div>;
    }
  }
}

export default App;





// <img src="https://cdn.theatlantic.com/thumbor/HYdYHLTb9lHl5ds-IB0URvpSut0=/900x583/media/img/photo/2014/09/dramatic-photos-of-californias-historic-drought/c01_53834006/original.jpg
// "/>
// Lake Oroville in the 2012-2014 drought. Image credit Justin Sullivan, from The Atlatic article Dramatic Photos of California's Historic Drought.