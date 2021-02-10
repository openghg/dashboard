import React from "react";
import VisUnit from "../VisUnit/VisUnit";

import styles from "./VisLayout.module.css";

class VisLayout extends React.Component {
  render() {
      console.log("\n\nCreating VisLayout\n\n")
    let visualisations;
    if (Array.isArray(this.props.children)) {
      visualisations = this.props.children.map((child) => {
        const key = "vis-unit-".concat(child.key);
        console.log(key);
        return <VisUnit data-testid={key} key={key} vis={child} />;
      });
    } else {
      const key = "vis-unit-".concat(this.props.children.key);
      console.log(key);
      visualisations = (
        <VisUnit data-testid={key} key={key} vis={this.props.children} />
      );
    }

    return <div className={styles.main}>{visualisations}</div>;
  }
}

export default VisLayout;
