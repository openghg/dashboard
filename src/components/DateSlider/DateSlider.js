import React from "react";
import { Slider } from "@material-ui/core";

// First date w/ data CSSE dataset
const date_of_first_case = new Date("01/22/2020");

class DateSlider extends React.Component {
  render() {
    const date_today = new Date();

    // To calculate the time difference of two dates
    const difference_in_time =
      date_today.getTime() - date_of_first_case.getTime();

    // To calculate the no. of days between two dates (subtract 1 since data is only updated at 23:59 UTC)
    const difference_in_days =
      Math.floor(difference_in_time / (1000 * 3600 * 24)) - 1;

    const marks = [
      {
        value: 0,
        label: "Day 0",
      },
      {
        value: difference_in_days,
        label: "Yesterday",
      },
    ];
    return (
      <Slider
        defaultValue={0}
        onChange={this.props.handleDateChange}
        getAriaValueText={""}
        aria-labelledby="continuous-slider"
        valueLabelDisplay="on"
        marks={marks}
        max={difference_in_days}
      />
    );
  }
}

export default DateSlider;
