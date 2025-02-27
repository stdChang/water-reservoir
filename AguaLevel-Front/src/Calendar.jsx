import React, {useState} from 'react';
import MonthYearPicker from 'react-month-year-picker';

function Calendar(props) {
  // pass month setter, this will be a function to keep year, change month
  // pass year setter, this will be a function to keep month, change year
  // pass date as two props: .month and .year
  // pass visibility: .visibility is boolean to turn calendar on/off
  // pass visibility setter, .calendarSetter() sets boolean of .visibility
   function changeMonth(chosenMonth){
    props.dateMsetter(chosenMonth);
    props.calendarSetter(false);
  }

  function changeYear(chosenYear){
    props.dateYsetter(chosenYear);
    // props.calendarSetter(false);
  }
  
  if(props.visibility == true){ //returns calendar picker if visibility is true
    return(
      <div>
        <MonthYearPicker
          selectedMonth = {props.month}
          selectedYear = {props.year}
          onChangeYear = {changeYear}
          onChangeMonth = {changeMonth}
          
          minYear = {2000}
          maxYear = {2022}
          caption = ""
          />
      </div>
    )
  } else {
    return (
      <div></div> //nothing if visibility is false
    )
  }
}

export default Calendar;