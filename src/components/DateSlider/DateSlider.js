import PropTypes from "prop-types";
import React from "react";
import { Slider } from "@material-ui/core";

import styles from "./DateSlider.module.css";
import "./SliderLabel.css";

class DateSlider extends React.Component {
  constructor(props) {
    super(props);

    const startDate = parseInt(this.props.dates[0]);

    this.state = { selectedDate: startDate };

    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleDateChange(event, timestamp) {
    this.props.dateSelector(timestamp);
    this.setState({ selectedDate: timestamp });
  }

  render() {
    const dates = this.props.dates;

    const startDate = parseInt(dates[0]);
    const endDate = parseInt(dates[dates.length - 1]);

    // We'll have to ensure that each of the sites has data for every date
    // just add in NaNs for missing data - this can be done by the serverless fn
    const nDates = dates.length;

    let marks = [];
    for (const date of dates) {
      const dateInt = parseInt(date);
      let dateString = null;
      if (nDates < 36) {
        dateString = new Date(dateInt).toISOString();
      }

      marks.push({ value: dateInt, label: dateString });
    }

    return (
      <div className={styles.container}>
        <div className={styles.sliderContainer}>
          <Slider
            defaultValue={0}
            onChange={this.handleDateChange}
            aria-labelledby="continuous-slider"
            marks={marks}
            step={null}
            max={endDate}
            min={startDate}
          />
        </div>
        <div className={styles.dateContainer}>Date: {new Date(this.state.selectedDate).toLocaleString()}</div>
      </div>
    );
  }
}

DateSlider.propTypes = {
  dateSelector: PropTypes.func,
  dates: PropTypes.shape({
    length: PropTypes.number,
  }),
};

export default DateSlider;
