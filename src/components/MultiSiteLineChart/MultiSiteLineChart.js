import PropTypes from "prop-types";
import React from "react";
import Plot from "react-plotly.js";
import styles from "./MultiSiteLineChart.module.css";

class MultiSiteLineChart extends React.Component {
  render() {
    let plotData = [];
    let maxY = 0;
    let minY = Infinity;

    const data = this.props.data;
    const metadata = this.props.siteMetadata;

    for (const [network, networkData] of Object.entries(data)) {
      for (const [site, siteData] of Object.entries(networkData)) {
        for (const sectorData of Object.values(siteData)) {
          const xValues = sectorData["x_values"];
          const yValues = sectorData["y_values"];

          const siteUpper = site.toUpperCase();
          const siteMetadata = metadata[siteUpper];

          const max = Math.max(...yValues);
          const min = Math.min(...yValues);

          if (max > maxY) {
            maxY = max;
          }

          if (min < minY) {
            minY = min;
          }

          // Set the name for the legend
          let name = null;
          try {
            name = siteMetadata["long_name"];
          } catch (error) {
            console.error(`Error reading name for legend - ${error}`);
          }

          const colour = this.props.colours[siteUpper];
          const units = this.props.units;

          const trace = {
            x: xValues,
            y: yValues,
            units: this.props.units,
            mode: "lines",
            line: {
              width: 1,
              color: colour,
            },
            name: name,
            hovertemplate: `<b>Date</b>: %{x} <br><b>Concentration: </b>: %{y:.2f} ${units}<br>`,
          };

          plotData.push(trace);
        }
      }
    }

    let dateMarkObject = null;
    const selectedDate = this.props.selectedDate;

    if (selectedDate) {
      const date = new Date(parseInt(selectedDate));

      dateMarkObject = {
        type: "line",
        x0: date,
        y0: minY,
        x1: date,
        y1: maxY,
        line: {
          color: "black",
          width: 1,
        },
      };
    }

    const widthScaleFactor = 0.925;

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
        range: this.props.xRange ? this.props.xRange : null,
        showgrid: false,
        linecolor: "black",
        autotick: true,
        ticks: "outside",
      },
      yaxis: {
        automargin: true,
        title: {
          text: this.props.yLabel,
          standoff: 1,
        },
        range: this.props.yRange ? this.props.yRange : null,
        showgrid: false,
        linecolor: "black",
        autotick: true,
        ticks: "outside",
        zeroline: false,
      },
      width: widthScaleFactor * this.props.width,
      height: this.props.height,
      margin: {
        l: 60,
        r: 40,
        b: 30,
        t: 20,
        pad: 5,
      },
      shapes: [dateMarkObject],
    };

    return (
      <div data-testid={"linePlot"} className={styles.container}>
        <Plot data={plotData} layout={layout} />
      </div>
    );
  }
}

MultiSiteLineChart.propTypes = {
  data: PropTypes.object.isRequired,
  selectedDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  xRange: PropTypes.string,
  yLabel: PropTypes.string,
  yRange: PropTypes.string,
};

export default MultiSiteLineChart;
