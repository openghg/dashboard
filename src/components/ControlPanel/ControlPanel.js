import React from "react";
import styles from "./ControlPanel.module.css";

import DataSelector from "../DataSelector/DataSelector";

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
          <div>
            <DataSelector
              dataKeys={this.props.dataKeys}
              dataSelector={this.props.dataSelector}
            />
          </div>
        </div>
        <div className={styles.footer}>Source</div>
      </div>
    );
  }
}

export default ControlPanel;
