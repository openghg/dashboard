import PropTypes from "prop-types";
import React from "react";
import DataSelector from "../DataSelector/DataSelector";
import styles from "./ControlPanel.module.css";

import GitHubLogo from "../../images/github.svg";

class ControlPanel extends React.Component {
  plottingInterface() {
    console.log(this.props.dataKeys);
    if (this.props.plotType === "timeseries") {
      return (
        <div>
          <div className={styles.mainHeader}>Sites</div>
          <DataSelector dataKeys={this.props.dataKeys} dataSelector={this.props.dataSelector} />
        </div>
      );
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerText}>LondonGHG</div>
          <div className={styles.headerTag}>A new system for estimating London's emissions</div>
        </div>
        <div className={styles.main}>
          <div className={styles.plotSelector}>
            Select visualisation type:
            <div>
              <form>
                <select data-testid="select-form" value={this.props.plotType} onChange={this.props.selectPlotType}>
                  <option data-testid="sel-footprint" value="footprint">
                    Footprint
                  </option>
                  <option data-testid="sel-timeseries" value="timeseries">
                    Timeseries
                  </option>
                </select>
              </form>
            </div>
          </div>
          {this.plottingInterface()}
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

export default ControlPanel;
