import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./LeafletMap.css";

class LeafletMap extends React.Component {
  processSites() {
    const sites = this.props.sites;

    let markers = [];
    for (const [key, value] of Object.entries(sites)) {
      const latitude = value["latitude"];
      const longitude = value["longitude"];

      const location = [latitude, longitude];

      const marker = (
        <Marker position={location}>
          <Popup>{key.toUpperCase()}</Popup>
        </Marker>
      );

      markers.push(marker);
    }

    return markers;
  }

  render() {
    // Here we can pass an array of tuples (x, y, title) for position markers?
    // const position = [51.458377, -2.603017];

    const markers = this.processSites();
    const zoom = this.props.zoom ? this.props.zoom : 5;

    const width = this.props.width ? this.props.width : "60vw";
    const height = this.props.height ? this.props.height : "40vh";

    const style = { width: width, height: height };

    return (
      <div className="map-container">
        <div id={this.props.divID} className="mapid">
          <div>
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
              {markers}
            </MapContainer>
          </div>
        </div>
      </div>
    );
  }
}

export default LeafletMap;
