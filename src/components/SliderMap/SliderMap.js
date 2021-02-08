import React from "react";
import { MapContainer, Circle, TileLayer, Popup } from "react-leaflet";
import { Slider } from "@material-ui/core";

import styles from "./SliderMap.module.css";

class SliderMap extends React.Component {
  constructor(props) {
    super(props);

    const siteData = this.props.sites;
    const firstSite = Object.keys(siteData)[0];
    const firstSiteData = siteData[firstSite]["measurements"];
    const dates = Object.keys(firstSiteData).sort();

    this.state = { currentDate: parseInt(dates[0]) };
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleDateChange(event, timestamp) {
    this.setState({ currentTime: parseInt(timestamp) });
  }

  createMarkers() {
    // Dictionary of sites
    const sites = this.props.sites;

    let markers = [];
    for (const [site, siteData] of Object.entries(sites)) {
      const siteName = String(site).toUpperCase();
      const lat = siteData["latitude"];
      const long = siteData["longitude"];
      const longName = siteData["long_name"];
      const locationStr = `${siteName}, ${lat}, ${long}`;

      const measurement = siteData["measurements"][this.state.currentDate];

      // Should use some correct binning here
      let colour = "black";
      if (measurement > 0 && measurement < 30) {
        colour = "green";
      } else if (measurement < 60) {
        colour = "orange";
      } else if (measurement < 150) {
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

  createSlider() {
    const siteData = this.props.sites;

    const firstSite = Object.keys(siteData)[0];

    const firstSiteData = siteData[firstSite]["measurements"];
    const dates = Object.keys(firstSiteData).sort();

    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[dates.length - 1]);

    // We'll have to ensure that each of the sites has data for every date
    // just add in NaNs for missing data - this can be done by the serverless fn
    let marks = [];
    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of Object.entries(firstSiteData)) {
      const UNIXDate = parseInt(key);
      const date = new Date(UNIXDate);

      marks.push({ value: date.getTime(), label: date.toLocaleDateString() });
    }

    const slider = (
      <Slider
        defaultValue={0}
        onChange={this.handleDateChange}
        getAriaValueText={""}
        aria-labelledby="continuous-slider"
        marks={marks}
        step={null}
        max={endDate.getTime()}
        min={startDate.getTime()}
      />
    );

    return slider;
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
        <div className={styles.sliderBox}>{this.createSlider()}</div>
      </div>
    );
  }
}

export default SliderMap;
