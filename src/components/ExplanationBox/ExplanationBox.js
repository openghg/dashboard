import PropTypes from "prop-types";
import React from "react";

import styles from "./ExplanationBox.module.css";

class ExplanationBox extends React.Component {
  render() {
    const style = this.props.nogap ? styles.containerNoGap : styles.container;

    let explainerText = this.props.explain;
    
    if (explainerText) {
      const splitText = explainerText.split("\n").map((i) => {
        return <p>{i}</p>;
      });

      explainerText = splitText;
    }

    return (
      <div className={style}>
        <div className={styles.header}>{this.props.header}</div>
        <div className={styles.intro}>{this.props.intro}</div>
        <div className={styles.explain}>{explainerText}</div>
      </div>
    );
  }
}

ExplanationBox.propTypes = {
  explain: PropTypes.string,
  header: PropTypes.string,
  intro: PropTypes.string,
};

export default ExplanationBox;
