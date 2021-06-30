import PropTypes from "prop-types";
import React from "react";
import DataSelector from "../DataSelector/DataSelector";
import styles from "./ControlPanel.module.css";

import GitHubLogo from "../../images/github.svg";

class ControlPanel extends React.Component {
  plottingInterface() {
    if (this.props.plotType === "timeseries") {
      return (
        <div>
          <div className={styles.mainHeader}>Sites</div>
          <DataSelector dataKeys={this.props.dataKeys} dataSelector={this.props.dataSelector} />
        </div>
      );
    }
  }

  logMe() {
    console.log("Clicked yah");
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerText}>OpenGHG</div>
          <div className={styles.headerTag}>A COP26 dashboard</div>
        </div>
        <div className={styles.content}>
          <button type="button" className={styles.linkButton} onClick={this.logMe}>
            Emissions
          </button>
          <button type="button" className={styles.linkButton} onClick={this.logMe}>
            Model
          </button>
          <button type="button" className={styles.linkButton} onClick={this.logMe}>
            Obervations
          </button>
          <button type="button" className={styles.linkButton} onClick={this.logMe}>
            About OpenGHG
          </button>
        </div>
        <div className={styles.footer}>
          <a href="https://github.com/openghg/dashboard" rel="noreferrer" target="_blank">
            <img src={GitHubLogo} alt="GitHub logo" />
          </a>
        </div>
      </div>
    );
  }
}

ControlPanel.propTypes = {
  dataKeys: PropTypes.object.isRequired,
  dataSelector: PropTypes.func.isRequired,
  plotType: PropTypes.string.isRequired,
  selectPlotType: PropTypes.func.isRequired,
};

export default ControlPanel;
