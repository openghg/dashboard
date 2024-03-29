import PropTypes from "prop-types";
import React from "react";

import styles from "./ObsExplainer.module.css";

class ObsExplainer extends React.Component {
  render() {
    const style = this.props.nogap ? styles.containerNoGap : styles.container;

    return (
      <div className={style}>
        <div className={styles.header}>Observations</div>
        <div className={styles.explain}>
          <li>Greenhouse gas concentrations are monitored from a network of sites across the city.</li>
          <li>Measurements are made of carbon dioxide and methane, the most important greenhouse gases.</li>
          <li>Scientists are using these observations to learn more about the UK's greenhouse gas emissions.</li>

          <li>
            Partners on this project are the&nbsp;
            <a
              href="https://www.bristol.ac.uk/chemistry/research/acrg/current/decc.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              UK DECC network
            </a>
            ,&nbsp;
            <a href="https://www.bristol.ac.uk/chemistry/research/acrg/" target="_blank" rel="noopener noreferrer">
              University of Bristol
            </a>
            ,&nbsp;
            <a href="https://www.npl.co.uk/emissions-atmospheric-metrology" target="_blank" rel="noopener noreferrer">
              National Physical Laboratory
            </a>
            ,&nbsp;
            <a href="http://beacon.berkeley.edu/about/" target="_blank" rel="noopener noreferrer">
              BEACO2N
            </a>
            ,&nbsp;
            <a
              href="https://www.royalholloway.ac.uk/research-and-teaching/departments-and-schools/earth-sciences/research/research-laboratories/greenhouse-gas-laboratory/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Royal Holloway University of London
            </a>
            ,&nbsp;
            <a href="https://www.ch.cam.ac.uk/group/atm/" target="_blank" rel="noopener noreferrer">
              University of Cambridge
            </a>
            ,&nbsp;and&nbsp;
            <a
              href="https://www.strath.ac.uk/workwithus/globalenvironmentalmeasurementmonitoring/"
              target="_blank"
              rel="noopener noreferrer"
            >
              University of Strathclyde.
            </a>
          </li>
          <li>Start exploring the measurements by selecting a site from the map</li>
        </div>
      </div>
    );
  }
}

ObsExplainer.propTypes = {
  explain: PropTypes.string,
  header: PropTypes.string,
  intro: PropTypes.string,
};

export default ObsExplainer;
