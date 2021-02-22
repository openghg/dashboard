import PropTypes from "prop-types";
import React from "react";
import { LayerGroup, MapContainer, ImageOverlay, CircleMarker, TileLayer, Popup } from "react-leaflet";
import { Slider } from "@material-ui/core";
import { nanoid } from "nanoid";

import styles from "./SliderMap.module.css";
import "./SliderLabel.css";

class SliderMap extends React.Component {
  constructor(props) {
    super(props);

    this.handleDateChange = this.handleDateChange.bind(this);
    this.layerRef = React.createRef();
  }

  handleDateChange(event, timestamp) {
    this.props.dateSelector(timestamp);
  }

  //   createMarkerLayer() {
  //     const sites = this.props.sites;

  //     if (!sites) {
  //       return null;
  //     }

  //     let markers = [];
  //     for (const [site, siteData] of Object.entries(sites)) {
  //       const siteName = String(site).toUpperCase();
  //       const lat = siteData["latitude"];
  //       const long = siteData["longitude"];
  //       const longName = siteData["long_name"];
  //       const locationStr = `${siteName}, ${lat}, ${long}`;

  //       const measurement = siteData["measurements"][this.props.selectedDate];

  //       // Should use some correct binning here
  //       let colour = "black";
  //       if (measurement > 0 && measurement < 30) {
  //         colour = "green";
  //       } else if (measurement < 60) {
  //         colour = "orange";
  //       } else if (measurement < 150) {
  //         colour = "red";
  //       }

  //       // This is usually bad practice but here we want to force new CircleMarkers
  //       // to be created on the map
  //       const circleKey = nanoid();

  //       const circle = (
  //         <CircleMarker
  //           key={circleKey}
  //           center={[lat, long]}
  //           radius={15}
  //           fillOpacity={0.9}
  //           fillColor={colour}
  //           stroke={false}
  //         >
  //           <Popup>
  //             <div className={styles.marker}>
  //               <div className={styles.markerHeader}>{siteName}</div>
  //               <div className={styles.markerBody}>
  //                 Name: {longName}
  //                 <br />
  //                 <br />
  //                 {new Date(this.state.currentDate).toLocaleDateString()}: {measurement}
  //               </div>
  //               <div className={styles.markerLocation}>Location: {locationStr}</div>
  //             </div>
  //           </Popup>
  //         </CircleMarker>
  //       );

  //       markers.push(circle);
  //     }

  //     return markers;
  //   }

  createSlider() {
    const dates = this.props.dates;

    const startDate = parseInt(dates[0]);
    const endDate = parseInt(dates[dates.length - 1]);

    // We'll have to ensure that each of the sites has data for every date
    // just add in NaNs for missing data - this can be done by the serverless fn
    let marks = [];
    for (const date of dates) {
      const dateInt = parseInt(date);
      const dateObj = new Date(dateInt);
      marks.push({ value: dateInt, label: dateObj.toISOString()});
    }

    const slider = (
      <Slider
        defaultValue={0}
        onChange={this.handleDateChange}
        aria-labelledby="continuous-slider"
        marks={marks}
        step={null}
        max={endDate}
        min={startDate}
      />
    );

    return slider;
  }

  render() {
    const zoom = this.props.zoom ? this.props.zoom : 5;
    const width = this.props.width ? this.props.width : "60vw";
    const height = this.props.height ? this.props.height : "40vh";

    const style = { width: width, height: height };

    let imgOverlay = null;
    if (this.props.overlayImg && this.props.overlayBounds) {
      const imgPath = this.props.overlayImg;
      const bounds = this.props.overlayBounds;

      imgOverlay = <ImageOverlay url={imgPath} bounds={bounds} opacity={0.7} zIndex={10} />;
    }

    return (
      <div className={styles.container}>
        <div className={styles.mapBox}>
          <MapContainer center={this.props.centre} zoom={zoom} scrollWheelZoom={true} style={style}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* <LayerGroup ref={this.layerRef}>{this.createMarkerLayer()}</LayerGroup> */}
            <LayerGroup>{imgOverlay}</LayerGroup>
          </MapContainer>
        </div>
        <div className={styles.sliderBox}>{this.createSlider()}</div>
      </div>
    );
  }
}

SliderMap.propTypes = {
  centre: PropTypes.array,
  dateSelector: PropTypes.func,
  height: PropTypes.string,
  sites: PropTypes.object,
  width: PropTypes.string,
  zoom: PropTypes.number,
};

export default SliderMap;
