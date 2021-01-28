import React from "react";
import "./LineChart.css";
// import draw from "./d3LineChart.js";

import Plot from "react-plotly.js";

class LineChart extends React.Component {
  //   componentDidMount() {
  //     draw(this.props);
  //   }

  //   componentDidUpdate() {
  //     draw(this.props);
  //   }
  //   convertData() {
  // Takes the pandas exported JSON data and converts timestamps
  //
  // Args:
  //    data (object): JSON output from pandas
  // Returns:
  //    Array: array of Objects with date and value keys
  //     const data = this.props.data;
  //     const x_values = Object.keys(data).forEach((d) => new Date(parseInt(d)));
  //     const y_values = Object.values(data);

  //     return [x_values, y_values];
  //   }

  render() {
    const data = this.props.data;

    // We want to conver UNIX ms timestamps to Dates
    const x_timestamps = Object.keys(data);
    const x_values = x_timestamps.map((d) => new Date(parseInt(d)));
    // Extract the count values
    const y_values = Object.values(data);

    console.log(this.props.xRange)

    const layout = {
      xaxis: {
        title: this.props.xLabel,
        range: this.props.xRange ? this.props.xRange: null,
        showgrid: false
      },
      yaxis: {
        title: this.props.yLabel,
        range: this.props.yRange ? this.props.yRange: null,
        showgrid: false
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

    console.log(this.props.colour);

    return <Plot data={plot_data} layout={layout} />;
  }
}

export default LineChart;
