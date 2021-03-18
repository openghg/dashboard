import PropTypes from "prop-types";
import React from "react";
import VisUnit from "../VisUnit/VisUnit";

import styles from "./VisLayout.module.css";

class VisLayout extends React.Component {
  render() {
    let visualisations;
    if (Array.isArray(this.props.children)) {
      visualisations = this.props.children.map((child) => {
        const key = "vis-unit-".concat(child.key);
        return <VisUnit testid={key} key={key} vis={child} />;
      });
    } else {
      const key = "vis-unit-".concat(this.props.children.key);
      visualisations = <VisUnit testid={key} key={key} vis={this.props.children} />;
    }

    let plotStyle = styles.main;
    if (this.props.slimPlot) {
      plotStyle = styles.mainSlim;
    }

    return (
      <div className={styles.content}>
        <div className={plotStyle}>{visualisations}</div>
      </div>
    );
  }
}

VisLayout.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  slimPlot: PropTypes.bool,
};

export default VisLayout;
