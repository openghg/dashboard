import React from "react";
import "./VisLayout.css";

class VisLayout extends React.Component {
  render() {
    const children = this.props.children;
    const visualisations = children.map((child) => {
      return <div className="vis-unit">{child}</div>;
    });

    return <div className="vis-main">{visualisations}</div>;
  }
}

export default VisLayout;
