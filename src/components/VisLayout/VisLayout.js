import React from "react";
import VisUnit from "../VisUnit/VisUnit";

import "./VisLayout.css";

class VisLayout extends React.Component {
  render() {
    const visualisations = this.props.children.map((child) => {
      return <VisUnit vis={child} />;
    });

    return <div className="vis-main">{visualisations}</div>;
  }
}

export default VisLayout;
