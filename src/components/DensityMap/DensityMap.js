// import PropTypes from "prop-types";
import React from "react";
import Plot from "react-plotly.js";
import { extend } from "lodash";

import styles from "./DensityMap.module.css";

import ch4MobileGlasgow from "../../data/ch4_mobile_glasgow.json";

class DensityMap extends React.Component {
  render() {
    const hovertemplate =
      "<b>Latitude</b>: %{lat:.5f}<br>" +
      "<b>Longitude</b>: %{lon:.5f}<br><br>" +
      "<b>Concentration: </b>: %{z:.2f} ppb <br>" +
      "(enhancement over background)" +
      "<extra></extra>";

    let plotObj = { type: "densitymapbox", coloraxis: "coloraxis", hovertemplate: hovertemplate };
    // Now add in the extra lat, lon, z keys from the exported data
    const ch4Data = ch4MobileGlasgow["ch4"]["data"];
    plotObj = extend(plotObj, ch4Data);
    // Plotly expects an array of objects
    const plotData = [plotObj];
    const layout = {
      mapbox: { center: { lon: -4.252836, lat: 55.863658 }, style: "open-street-map", zoom: 8 },
      coloraxis: {
        colorscale: "Viridis",
        colorbar: { title: { side: "right", text: "Methane (ppb)", font: { size: 16 } } },
      },
      autosize: true,
      margin: { t: 30, b: 30 },
    };

    const style = { width: "100%", height: "120%" };

    return (
      <div className={styles.content}>
        <Plot data={plotData} layout={layout} useResizeHandler={true} style={style} />
      </div>
    );
  }
}

export default DensityMap;
