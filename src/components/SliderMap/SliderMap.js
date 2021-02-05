import React from "react";
import { MapContainer, Circle, TileLayer, Popup } from "react-leaflet";
import { Slider } from "@material-ui/core";

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

      const measurement = siteData["measurements"][this.state.currentDate];

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

  createSlider() {
    const siteData = this.props.sites;

    const firstSite = Object.keys(siteData)[0];

    const firstSiteData = siteData[firstSite]["measurements"];
    const dates = Object.keys(firstSiteData).sort();

    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[dates.length - 1]);

    let marks = [];

    console.log(firstSiteData)

    for (const [key, value] in Object.entries(firstSiteData)) {
        
    //     console.log(key)
    //   const date = new Date(key);
    //   console.log(date)
    //   const m = { value: date.getTime(), label: date.toLocaleDateString() };
    //   marks.push(m);
    }

    // const marks = [
    //   {
    //     value: startDate.getTime(),
    //     label: startDate.toLocaleDateString(),
    //   },
    //   {
    //     value: endDate.getTime(),
    //     label: endDate.toLocaleDateString(),
    //   },
    // ];

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
