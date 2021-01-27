import React from "react";
import VisUnit from "../VisUnit/VisUnit";

import "./VisLayout.css";

class VisLayout extends React.Component {
  render() {
    let visualisations;
    if (Array.isArray(this.props.children)) {
      visualisations = this.props.children.map((child, index) => {
        return <VisUnit key={child.id} vis={child} />;
      });
    } else {
      visualisations = <VisUnit vis={this.props.children} />;
    }

    return (
      <div className="vis-main">{visualisations}</div>
    );
  }
}

export default VisLayout;
