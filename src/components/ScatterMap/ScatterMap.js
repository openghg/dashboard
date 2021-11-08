import React from "react";
import Plot from "react-plotly.js";

import styles from "./ScatterMap.module.css";

import ch4MobileGlasgow from "../../data/ch4_mobile_glasgow.json";

class ScatterMap extends React.Component {
  constructor(props) {
    super(props);

    const ch4Data = ch4MobileGlasgow["ch4"]["data"];

    const measurements = ch4Data["z"];
    const latitude = ch4Data["lat"];
    const longitude = ch4Data["lon"];

    const hovertemplate =
      "<b>Latitude</b>: %{lat:.5f}<br>" +
      "<b>Longitude</b>: %{lon:.5f}<br><br>" +
      "<b>Concentration: </b>: %{text:.2f} ppb <br>" +
      "(enhancement over background)" +
      "<extra></extra>";

    const sizeVals = [];
    const divisor = 125;
    for (var i = 0; i < measurements.length; i++) {
      sizeVals.push(measurements[i] / divisor);
    }

    const dataObj = {
      type: "scattermapbox",
      mode: "markers",
      coloraxis: "coloraxis",
      hovertemplate: hovertemplate,
      text: measurements,
      lon: longitude,
      lat: latitude,
      marker: {
        color: measurements,
        colorscale: "Viridis",
        cmin: Math.min(measurements),
        cmax: Math.max(measurements),
        reversescale: false,
        size: sizeVals,
        colorbar: {
          thickness: 10,
          titleside: "right",
          outlinecolor: "rgba(68,68,68,0)",
          ticks: "outside",
          ticklen: 3,
          shoticksuffix: "last",
          title: { side: "right", text: "Methane (ppb)", font: { size: 16 } },
        },
      },
    };

    this.state = { plotData: [dataObj] };
  }

  render() {
    const height = 400;
    const width = this.props.width;
    const plotData = this.state.plotData;

    const layout = {
      mapbox: { center: { lon: -4.212836, lat: 55.843658 }, style: "open-street-map", zoom: 10 },
      coloraxis: {
        colorscale: "Viridis",
        colorbar: { title: { side: "right", text: "Methane (ppb)", font: { size: 16 } } },
      },
      margin: { t: 30, b: 30, l: 30, r: 30 },
      width: width,
      height: height,
    };
    return (
      <div className={styles.content}>
        <Plot data={plotData} layout={layout} />
      </div>
    );
  }
}

export default ScatterMap;
