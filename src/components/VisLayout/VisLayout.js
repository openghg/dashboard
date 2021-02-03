import React from "react";
import VisUnit from "../VisUnit/VisUnit";

import styles from "./VisLayout.module.css";

class VisLayout extends React.Component {
  render() {
    let visualisations;
    if (Array.isArray(this.props.children)) {
      visualisations = this.props.children.map((child) => {
        return <VisUnit key={child.id} vis={child} />;
      });
    } else {
      visualisations = <VisUnit key={this.props.children.id} vis={this.props.children} />;
    }

    return (
      <div className={styles.main}>{visualisations}</div>
    );
  }
}

export default VisLayout;
