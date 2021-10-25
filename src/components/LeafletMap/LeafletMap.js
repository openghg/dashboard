import PropTypes from "prop-types";
import React from "react";
import { LayerGroup, MapContainer, ImageOverlay, TileLayer, CircleMarker, Popup } from "react-leaflet";
// import TextButton from "../TextButton/TextButton";
// import "./LeafletMapResponsive.css";

import styles from "./LeafletMap.module.css";

class LeafletMap extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.siteSelector(e.target.options.data);
  }

  processSites() {
    const metadata = this.props.metadata;

    if (!metadata) {
      return null;
    }

    let markers = [];

    let seenSites = new Set();
    //
    for (const speciesData of Object.values(metadata)) {
      for (const [network, networkData] of Object.entries(speciesData)) {
        for (const [site, value] of Object.entries(networkData)) {
          if (seenSites.has(site)) {
            continue;
          }

          const latitude = value["latitude"];
          const longitude = value["longitude"];

          const locationStr = `${latitude}, ${longitude}`;
          const location = [latitude, longitude];

          const colourHex = this.props.colours[network][site];

          const marker = (
            <CircleMarker
              key={locationStr}
              center={location}
              data={site}
              eventHandlers={{
                click: this.handleClick,
              }}
              fillColor={colourHex}
              color={colourHex}
              fill={true}
              fillOpacity={1.0}
              radius={10}
            >
              <Popup>
                <div className={styles.marker}>
                  <div className={styles.markerBody}>
                    {value["long_name"]}
                    <br />
                    <br />
                    Height: {value["magl"]}
                    <br />
                    <br />
                    For more information please visit the network website - {`${network}`}
                    {/* <TextButton
                          styling="dark"
                          onClickParam={key}
                          extraStyling={{ fontSize: "1.0em" }}
                          onClick={this.props.siteInfoOverlay}
                        >
                          Read site information
                        </TextButton> */}
                  </div>
                  <div className={styles.markerLocation}>Location: {locationStr}</div>
                </div>
              </Popup>
            </CircleMarker>
          );

          markers.push(marker);
          seenSites.add(site);
        }
      }
    }

    return markers;
  }

  render() {
    let imgOverlay = null;
    if (this.props.overlayImg && this.props.overlayBounds) {
      const imgPath = this.props.overlayImg;
      const bounds = this.props.overlayBounds;

      imgOverlay = <ImageOverlay url={imgPath} bounds={bounds} opacity={0.7} zIndex={10} />;
    }

    let url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    let attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
    if (this.props.mapstyle && this.props.mapstyle === "proton") {
      url = "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png";
      const extraAttr = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
      const attrTiles = '&copy; <a href="http://osm.org/copyright">Map tiles by Carto, under CC BY 3.0.</a> ';
      attribution = extraAttr + attrTiles;
    }

    const markers = this.processSites();
    const zoom = this.props.zoom ? this.props.zoom : 5;

    const style = { width: "90%" };

    return (
      <div className={styles.container}>
        <MapContainer center={this.props.centre} zoom={zoom} scrollWheelZoom={true} style={style} tap={false}>
          <TileLayer attribution={attribution} url={url} />
          <LayerGroup>{markers}</LayerGroup>
          <LayerGroup>{imgOverlay}</LayerGroup>
        </MapContainer>
      </div>
    );
  }
}

LeafletMap.propTypes = {
  centre: PropTypes.arrayOf(PropTypes.number).isRequired,
  colours: PropTypes.object,
  height: PropTypes.string,
  mapstyle: PropTypes.string,
  overlayBounds: PropTypes.arrayOf(PropTypes.array),
  overlayImg: PropTypes.string,
  setOverlay: PropTypes.func,
  siteSelector: PropTypes.func,
  sites: PropTypes.object,
  width: PropTypes.string,
  zoom: PropTypes.number.isRequired,
};

export default LeafletMap;
