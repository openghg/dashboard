import PropTypes from "prop-types";
import React from "react";
import { Slider } from "@material-ui/core";

import styles from "./DateSlider.module.css";

class DateSlider extends React.Component {
  constructor(props) {
    super(props);

    this.state = { selectedDate: parseInt(this.props.dates[0]) };
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleDateChange(event, timestamp) {
    this.setState({ selectedDate: timestamp });
    this.props.dateSelector(timestamp);
  }

  render() {
    const dates = this.props.dates;

    const startDate = parseInt(dates[0]);
    const endDate = parseInt(dates[dates.length - 1]);

    let marks = [];
    for (const date of dates) {
      marks.push({ value: parseInt(date) });
    }

    return (
      <div className={styles.container}>
        <div className={styles.sliderContainer}>
          <Slider
            defaultValue={startDate}
            onChange={this.handleDateChange}
            aria-labelledby="continuous-slider"
            marks={marks}
            step={null}
            max={endDate}
            min={startDate}
          />
        </div>
        {/* <div className={styles.dateContainer}>Date: {new Date(this.state.selectedDate).toLocaleString()}</div> */}
      </div>
    );
  }
}

DateSlider.propTypes = {
  dateSelector: PropTypes.func,
  dates: PropTypes.array,
  selectedDate: PropTypes.number,
};

export default DateSlider;
