import React from "react";
import styles from "./VisUnit.module.css";

class VisUnit extends React.Component {
  render() {
      console.log("\n\nCreating VisUnit\n\n")
    return <div className={styles.unit}>{this.props.vis}</div>;
  }
}

export default VisUnit;
