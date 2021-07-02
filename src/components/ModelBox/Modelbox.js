import PropTypes from "prop-types";
import React from "react";

import styles from "./Modelbox.module.css";

class Modelbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>{this.props.headerText}</div>
        <div className={styles.date}>Date: {new Date(this.props.selectedDate).toLocaleString()}</div>
        <div className={styles.body}>{this.props.bodyText}</div>
        <div className={styles.plot}></div>
        <div className={styles.buttons}></div>
      </div>
    );
  }
}

Modelbox.propTypes = {
  altText: PropTypes.string,
  bodyText: PropTypes.string,
  headerText: PropTypes.string,
  imagePath: PropTypes.string,
  selectedDate: PropTypes.number,
};

export default Modelbox;
