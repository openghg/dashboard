import PropTypes from "prop-types";
import React from "react";
import { LayerGroup, MapContainer, ImageOverlay, Marker, CircleMarker, TileLayer, Popup } from "react-leaflet";
import { Slider } from "@material-ui/core";
import { nanoid } from "nanoid";

import styles from "./SliderMap.module.css";
import "./SliderLabel.css";

class SliderMap extends React.Component {
  constructor(props) {
    super(props);

    const startDate = parseInt(this.props.dates[0]);

    this.state = { selectedDate: startDate };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.layerRef = React.createRef();
  }

  handleDateChange(event, timestamp) {
    this.props.dateSelector(timestamp);
    this.setState({ selectedDate: timestamp });
  }

  createMarkerLayer() {
    const sites = this.props.sites;

    if (!this.props.showSites) {
      return null;
    }

    let markers = [];

    for (const [site, siteData] of Object.entries(sites)) {
      const siteName = String(site).toUpperCase();
      const lat = siteData["latitude"];
      const long = siteData["longitude"];
      const longName = siteData["long_name"];
      const locationStr = `${siteName}, ${lat}, ${long}`;

      let marker;
      if (this.props.measMarkers) {
        let measurement;
        try {
          measurement = siteData["measurements"][this.props.selectedDate];
        } catch (error) {
          console.error("Unable to read measurement data for this site.");
          break;
        }

        // Should use some correct binning here
        let colour = "black";
        if (measurement > 0 && measurement < 30) {
          colour = "green";
        } else if (measurement < 60) {
          colour = "orange";
        } else if (measurement < 150) {
          colour = "red";
        }

        // This is usually bad practice but here we want to force new CircleMarkers
        // to be created on the map
        const circleKey = nanoid();

        marker = (
          <CircleMarker
            key={circleKey}
            center={[lat, long]}
            radius={15}
            fillOpacity={0.9}
            fillColor={colour}
            stroke={false}
          >
            <Popup>
              <div className={styles.marker}>
                <div className={styles.markerHeader}>{siteName}</div>
                <div className={styles.markerBody}>
                  Name: {longName}
                  <br />
                  <br />
                  {new Date(this.state.currentDate).toLocaleDateString()}: {measurement}
                </div>
                <div className={styles.markerLocation}>Location: {locationStr}</div>
              </div>
            </Popup>
          </CircleMarker>
        );
      } else {
        marker = (
          <Marker position={[lat, long]}>
            <Popup>
              <div className={styles.marker}>
                <div className={styles.markerHeader}>{siteName}</div>
                <div className={styles.markerBody}>Name: {longName}</div>
                <div className={styles.markerLocation}>Location: {locationStr}</div>
              </div>
            </Popup>
          </Marker>
        );
      }

      markers.push(marker);
    }

    return markers;
  }

  createSlider() {
    const dates = this.props.dates;

    const startDate = parseInt(dates[0]);
    const endDate = parseInt(dates[dates.length - 1]);

    // We'll have to ensure that each of the sites has data for every date
    // just add in NaNs for missing data - this can be done by the serverless fn
    const nDates = dates.length;

    let marks = [];
    for (const date of dates) {
      const dateInt = parseInt(date);
      let dateString = null;
      if (nDates < 36) {
        dateString = new Date(dateInt).toISOString();
      }

      marks.push({ value: dateInt, label: dateString });
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
            <LayerGroup ref={this.layerRef}>{this.createMarkerLayer()}</LayerGroup>
            <LayerGroup>{imgOverlay}</LayerGroup>
          </MapContainer>
        </div>
        <div className={styles.sliderSection}>
          <div className={styles.sliderContainer}>{this.createSlider()}</div>
          <div className={styles.dateContainer}>Date: {new Date(this.state.selectedDate).toLocaleString()}</div>
        </div>
      </div>
    );
  }
}

SliderMap.propTypes = {
  centre: PropTypes.array,
  dateSelector: PropTypes.func.isRequired,
  dates: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  height: PropTypes.string,
  overlayBounds: PropTypes.array,
  overlayImg: PropTypes.string,
  selectedDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showSites: PropTypes.bool,
  sites: PropTypes.object,
  width: PropTypes.string.isRequired,
  zoom: PropTypes.number.isRequired,
  measMarkers: PropTypes.bool.isRequired,
};

export default SliderMap;
