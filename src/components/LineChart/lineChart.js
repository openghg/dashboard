import React from "react";
import "./lineChart.css";
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
      <div className="pane">
        <div className="header">Time series plot</div>
        <div style={{ overflowX: "scroll", overflowY: "hidden" }}>
          <div className={this.props.divID} />
        </div>
      </div>
    );
  }
}

export default LineChart;
