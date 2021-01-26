import React from "react";
import "./LineChart.css";
import draw from "./d3LineChart.js";

class LineChart extends React.Component {
  componentDidMount() {
    draw(this.props);
  }

  componentDidUpdate() {
    draw(this.props);
  }

  render() {
    return (
      <div>
        <div className={this.props.divID} />
      </div>
    );
  }
}

export default LineChart;
