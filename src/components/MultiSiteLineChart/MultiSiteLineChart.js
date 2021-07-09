import PropTypes from "prop-types";
import React from "react";
import Plot from "react-plotly.js";
import colours from "../../data/colours.json";
import styles from "./MultiSiteLineChart.module.css";

class MultiSiteLineChart extends React.Component {
  render() {
    const data = this.props.data;

    // Data keyed by species
    let plotData = [];
    let plotNumber = 0;
    let maxY = 0;
    let minY = Infinity;

    const tab10 = colours["tab20"];

    for (const [site, siteData] of Object.entries(data)) {
      for (const [species, speciesData] of Object.entries(siteData)) {
        const xValues = speciesData["x_values"];
        const yValues = speciesData["y_values"];

        const max = Math.max(...yValues);
        const min = Math.min(...yValues);

        if (max > maxY) {
          maxY = max;
        }

        if (min < minY) {
          minY = min;
        }

        const name = site + " - " + String(species).toUpperCase();

        const selectedColour = tab10[plotNumber];
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
        plotNumber++;
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
