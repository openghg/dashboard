import PropTypes from "prop-types";
import React from "react";

import styles from "./ExplanationBox.module.css";

class ExplanationBox extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>{this.props.header}</div>
        <div className={styles.intro}>{this.props.intro}</div>
        <div className={styles.explain}>{this.props.explain}</div>
      </div>
    );
  }
}

ExplanationBox.propTypes = {
  explain: PropTypes.any,
  header: PropTypes.any,
  intro: PropTypes.any,
};

export default ExplanationBox;
