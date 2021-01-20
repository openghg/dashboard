import React from "react";
import "./VisUnit.css";

class VisUnit extends React.Component {
  render() {
    return <div className="vis-unit">{this.props.vis}</div>;
  }
}

export default VisUnit;
