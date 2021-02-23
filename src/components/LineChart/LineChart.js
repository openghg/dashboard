import React from "react";
import Plot from "react-plotly.js";

import styles from "./LineChart.module.css";

class LineChart extends React.Component {
  render() {
    const data = this.props.data;

    // Data keyed by site
    let plotData = [];
    let siteNumber = 0;
    let maxY = 0;
    let minY = Infinity;

    for (const [site, siteData] of Object.entries(data)) {
      // We want to conver UNIX ms timestamps to Dates
      const xTimestamps = Object.keys(siteData);
      const xValues = xTimestamps.map((d) => new Date(parseInt(d)));
      // Extract the count values
      const yValues = Object.values(siteData);

    //   const max = Math.max(yValues);
    //   const min = Math.min(yValues);

    //   if (max > maxY) {
    //     maxY = max;
    //   }

    //   if (min < minY) {
    //     minY = min;
    //   }

      const name = String(site).toUpperCase();

      const selectedColour = this.props.colours[siteNumber];
      const colour = selectedColour ? selectedColour : "black";

      const trace = {
        x: xValues,
        y: yValues,
        mode: "lines",
        line: {
          width: 1,
          color: colour,
        },
        name: name,
      };

      plotData.push(trace);
      siteNumber++;
    }

    let dateMarkObject = null;
    const selectedDate = this.props.selectedDate;

    if (selectedDate) {
      const date = new Date(selectedDate);

      dateMarkObject = {
        type: "line",
        x0: date,
        y0: minY,
        x1: date,
        y1: maxY,
        line: {
          color: "rgb(55, 128, 191)",
          width: 3,
        },
      };
    }

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
        linecolor: "black",
        autotick: true,
        ticks: "outside",
      },
      yaxis: {
        title: this.props.yLabel,
        range: this.props.yRange ? this.props.yRange : null,
        showgrid: false,
        linecolor: "black",
        autotick: true,
        ticks: "outside",
        zeroline: false,
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

    return (
      <div data-testid={"linePlot"} className={styles.container}>
        <Plot data={plotData} layout={layout} />
      </div>
    );
  }
}

export default LineChart;
