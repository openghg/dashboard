import PropTypes from "prop-types";
import React from "react";
import LeafletMap from "../LeafletMap/LeafletMap";

import styles from "./ModelBox.module.css";

class ModelBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const overlayBounds = [
      [51.759372, -0.554322],
      [51.21702, 0.304529],
    ];

    return (
      <div className={styles.container}>
        <div className={styles.header}>{this.props.headerText}</div>
        <div className={styles.date}>Date: {new Date(this.props.selectedDate).toLocaleString()}</div>
        <div className={styles.body}>{this.props.bodyText}</div>
        <div className={styles.plot}>
          <LeafletMap
            centre={[51.5, -0.0482]}
            zoom={9}
            width={"30vw"}
            overlayBounds={overlayBounds}
            overlayImg={this.props.imagePath}
          />
        </div>
        <div className={styles.buttons}></div>
      </div>
    );
  }
}

ModelBox.propTypes = {
  altText: PropTypes.string,
  bodyText: PropTypes.string,
  headerText: PropTypes.string,
  imagePath: PropTypes.string,
  selectedDate: PropTypes.number,
};

export default ModelBox;
