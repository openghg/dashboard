// import PropTypes from "prop-types";
import React from "react";
import LeafletMap from "../LeafletMap/LeafletMap";

import styles from "./SelectorMap.module.css";

class SelectorMap extends React.Component {
  render() {
    const width = this.props.width ? this.props.width : "30vw";

    return (
      <div className={styles.container}>
        <LeafletMap
          siteSelector={this.props.siteSelector}
          sites={this.props.sites}
          centre={[51.5, -0.0782]}
          zoom={10}
          width={width}
        />
      </div>
    );
  }
}

export default SelectorMap;
