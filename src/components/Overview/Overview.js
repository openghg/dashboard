import React from "react";
import "./Overview.css";

class Overview extends React.Component {
  render() {
    return (
      <div className="overview">
        <div className="overview-card">
          <b>London</b>
          <br />
          Temperature: 13°C
        </div>
        <div className="overview-card">
          <b>Air quality</b>
          <br />
          AQI: 55
        </div>
        <div className="overview-card">
          <b>CO2</b>
          <br />
          409.8 ppm
        </div>
      </div>
    );
  }
}

export default Overview;
