import React from "react";
import styles from "./ControlPanel.module.css";

import DataSelector from "../DataSelector/DataSelector";

class ControlPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = { this: 1 };
  }

  createButtons() {
    const keys = this.props.dataKeys;

    let selectButtons = [];
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerText}>LondonGHG</div>
          <div className={styles.headerTag}>
            A new system for estimating London's emissions
          </div>
        </div>
        <div className={styles.main}>
          <div className={styles.mainHeader}>Plotting</div>
          <div>
            <DataSelector dataKeys={this.props.dataKeys} dataSelector={this.props.dataSelector} />
          </div>
        </div>
        <div className={styles.footer}>Source</div>
      </div>
    );
  }
}

export default ControlPanel;
