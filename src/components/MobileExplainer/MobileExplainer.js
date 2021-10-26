import PropTypes from "prop-types";
import React from "react";

import styles from "./MobileExplainer.module.css";

class MobileExplainer extends React.Component {
  render() {
    const style = this.props.nogap ? styles.containerNoGap : styles.container;

    return (
      <div className={style}>
        <div className={styles.header}>Mobile methane measurements around Glasgow</div>
        <div className={styles.intro}>
          This map shows the results of measurements of methane taken whilst driving 350 km around Glasgow.
          <br />
          <br />
          <a
            href="https://www.royalholloway.ac.uk/research-and-teaching/departments-and-schools/earth-sciences/research/research-laboratories/greenhouse-gas-laboratory/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Study performed by the Greenhouse Gas Research Group, Royal Holloway University of London.
          </a>
        </div>
        <div className={styles.explain}>Measurements shown here are those above background values.</div>
      </div>
    );
  }
}

MobileExplainer.propTypes = {
  explain: PropTypes.string,
  header: PropTypes.string,
  intro: PropTypes.string,
};

export default MobileExplainer;
