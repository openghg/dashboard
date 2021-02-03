import React from "react";
import "./LineChart.css";
// import draw from "./d3LineChart.js";

import Plot from "react-plotly.js";

class LineChart extends React.Component {
  render() {
    const data = this.props.data;

    // We want to conver UNIX ms timestamps to Dates
    const x_timestamps = Object.keys(data);
    const x_values = x_timestamps.map((d) => new Date(parseInt(d)));
    // Extract the count values
    const y_values = Object.values(data);

    const layout = {
      title: {
        text: this.props.title ? this.props.title : null,
        font: {
          size: 16,
        },
        xanchor: "center",
        y: 0.97,
        yanchor: "top",
      },
      xaxis: {
        title: this.props.xLabel,
        range: this.props.xRange ? this.props.xRange : null,
        showgrid: false,
      },
      yaxis: {
        title: this.props.yLabel,
        range: this.props.yRange ? this.props.yRange : null,
        showgrid: false,
      },
      width: this.props.width,
      height: this.props.height,
      margin: {
        l: 60,
        r: 40,
        b: 30,
        t: 20,
        pad: 5,
      },
    };

    const plot_data = [
      {
        x: x_values,
        y: y_values,
        mode: "lines",
        line: {
          color: this.props.colour,
          width: 1,
        },
      },
    ];

    return <Plot data={plot_data} layout={layout} />;
  }
}

export default LineChart;
