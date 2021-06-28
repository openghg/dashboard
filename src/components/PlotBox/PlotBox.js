import PropTypes from "prop-types";
import React from "react";

import styles from "./PlotBox.module.css";

class PlotBox extends React.Component {
  constructor(props) {
    super(props);

    this.something = 2;
  }

  render() {
    let containerStyle = styles.containerLeft;
    let plotStyle = styles.plotLeft;
    if (this.props.rhs) {
      containerStyle = styles.containerRight;
      plotStyle = styles.plotRight;
    }

    return (
      <div className={containerStyle}>
        <div className={styles.header}>{this.props.headerText}</div>
        <div className={styles.body}>{this.props.bodyText}</div>
        <div className={plotStyle}>
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
  rhs: PropTypes.bool,
};

export default PlotBox;
