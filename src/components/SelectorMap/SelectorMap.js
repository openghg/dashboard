// import PropTypes from "prop-types";
import React from "react";
import LeafletMap from "../LeafletMap/LeafletMap";

import styles from "./SelectorMap.module.css";

class SelectorMap extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <LeafletMap sites={this.props.sites} centre={[51.5, -0.0782]} zoom={10} width={"40vw"} />
      </div>
    );
  }
}

export default SelectorMap;
