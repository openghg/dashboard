import React from "react";
import { MapContainer, Circle, TileLayer, Popup } from "react-leaflet";
import DateSlider from "../DateSlider/DateSlider";

import styles from "./SliderMap.module.css";

class SliderMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = { currentDate: "2021-01-01" };

    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleDateChange() {
    console.log("Date date date");
  }

  createMarkers() {
    // Dictionary of sites
    const sites = this.props.sites;

    // Could bin the data? Check d3.bin

    let markers = [];
    for (const [site, siteData] of Object.entries(sites)) {
      const siteName = String(site).toUpperCase();
      const lat = siteData["latitude"];
      const long = siteData["longitude"];
      const longName = siteData["long_name"];
      const locationStr = `${siteName}, ${lat}, ${long}`;

      const measurement = siteData[this.state.currentDate];

      let colour = "green";
      if (measurement > 50) {
        colour = "red";
      }

      const circle = (
        <Circle
          key={locationStr}
          center={[lat, long]}
          radius={750}
          fillOpacity={0.5}
          fillColor={colour}
          stroke={false}
        >
          <Popup>
            <div className={styles.marker}>
              <div className={styles.markerHeader}>{siteName}</div>
              <div className={styles.markerBody}>{longName}</div>
              <div className={styles.markerLocation}>
                Location: {locationStr}
              </div>
            </div>
          </Popup>
        </Circle>
      );

      markers.push(circle);
    }

    return markers;
  }

  render() {
    const zoom = this.props.zoom ? this.props.zoom : 5;
    const width = this.props.width ? this.props.width : "60vw";
    const height = this.props.height ? this.props.height : "40vh";

    const style = { width: width, height: height };

    return (
      <div className={styles.container}>
        <div className={styles.mapBox}>
          <MapContainer
            center={this.props.centre}
            zoom={zoom}
            scrollWheelZoom={true}
            style={style}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {this.createMarkers()}
          </MapContainer>
        </div>
        <div className={styles.sliderBox}>
          <DateSlider handleDateChange={this.handleDateChange} />
        </div>
      </div>
    );
  }
}

export default SliderMap;
