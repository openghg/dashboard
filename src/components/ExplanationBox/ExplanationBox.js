import PropTypes from "prop-types";
import React from "react";

import styles from "./ExplanationBox.module.css";

class ExplanationBox extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>{this.props.header}</div>
        <div className={styles.body}>{this.props.body}</div>
      </div>
    );
  }
}

ExplanationBox.propTypes = {
  bodyText: PropTypes.string.isRequired,
  headerText: PropTypes.string.isRequired,
};

export default ExplanationBox;
