import PropTypes from "prop-types";
import React from "react";

import styles from "./EstimatesExplainer.module.css";

class EstimatesExplainer extends React.Component {
  render() {
    const style = this.props.nogap ? styles.containerNoGap : styles.container;

    return (
      <div className={style}>
        <div className={styles.header}>Case study: Improved national emission estimates</div>
        <div className={styles.intro}>
          One way this has been used is to improve UK national methane estimates – by adjusting emissions to better
          match to the atmospheric data from the{" "}
          <a
            href="https://www.bristol.ac.uk/chemistry/research/acrg/current/decc.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            UK DECC network
          </a>
          , we can help to evaluate the inventory.
        </div>
        <div className={styles.explain}>
          This study suggested that methane emissions from the inventory were consistent with atmospheric data in recent
          years. However, in the 1990s and early 2000s, the two methods disagreed. This information is now allowing the
          inventory teams to examine assumptions in the earlier record, and, hopefully, improve our understand of the
          UK's methane emissions.
        </div>
      </div>
    );
  }
}

EstimatesExplainer.propTypes = {
  explain: PropTypes.string,
  header: PropTypes.string,
  intro: PropTypes.string,
};

export default EstimatesExplainer;
