import React from "react";
import styles from "./VisUnit.module.css";

class VisUnit extends React.Component {
  render() {
    return (
      <div data-testid={this.props.testid} className={styles.unit}>
        {this.props.vis}
      </div>
    );
  }
}

export default VisUnit;
