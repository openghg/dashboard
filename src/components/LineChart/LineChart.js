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
        <div style={{ overflowX: "scroll", overflowY: "hidden" }}>
          <div className={this.props.divID} style={{height: 300, width: 1200}}/>
        </div>
      </div>
    );
  }
}

export default LineChart;
