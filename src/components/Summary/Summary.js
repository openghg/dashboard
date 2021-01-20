import React from "react";
import "./Summary.css";

class Summary extends React.Component {
  render() {
    return <div className="summary">{this.props.children}</div>;
  }
}

export default Summary;
