import PropTypes from "prop-types";
import React from "react";

import styles from "./PlotBox.module.css";

class PlotBox extends React.Component {
  render() {
    const date = parseInt(this.props.selectedDate);
    const bodyString = this.props.bodyText + ` Date: ${date}`;

    return (
      <div className={styles.container}>
        <div className={styles.header}>{this.props.headerText}</div>
        <div className={styles.body}>{bodyString}</div>
        <div className={styles.plot}>
          <img src={this.props.imagePath} alt={this.props.altText} />
        </div>
      </div>
    );
  }
}

PlotBox.propTypes = {
  altText: PropTypes.string,
  bodyText: PropTypes.string,
  headerText: PropTypes.string,
  imagePath: PropTypes.string,
  selectedDate: PropTypes.number,
};

export default PlotBox;
