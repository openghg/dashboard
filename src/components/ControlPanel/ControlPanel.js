import React from "react";

import DataSelector from "../DataSelector/DataSelector";
import styles from "./ControlPanel.module.css";

class ControlPanel extends React.Component {
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
          <div className={styles.mainHeader}>Sites</div>
          <DataSelector
            dataKeys={this.props.dataKeys}
            dataSelector={this.props.dataSelector}
          />
        </div>
        <div className={styles.footer}>LondonGHG</div>
      </div>
    );
  }
}

export default ControlPanel;
