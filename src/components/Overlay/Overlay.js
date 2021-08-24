import PropTypes from "prop-types";
import React from "react";

import TextButton from "../TextButton/TextButton";

import styles from "./Overlay.module.css";

class Overlay extends React.Component {
  render() {
    let image = null;
    if (this.props.image) {
      image = <img src={this.props.image} alt={this.props.alt} />;
    }

    return (
      <div className={styles.container}>
        <div className={styles.closeButton}>
          <TextButton onClick={this.props.toggleOverlay} styling={"dark"} extraStyling={{ fontSize: "1.5vw" }}>
            x
          </TextButton>
        </div>
        <div className={styles.textContainer}>
          <div className={styles.header}>{this.props.header}</div>
          <div className={styles.body}>{this.props.text}</div>
        </div>
        <div className={styles.image}>{image}</div>
      </div>
    );
  }
}

Overlay.propTypes = {
  alt: PropTypes.string,
  image: PropTypes.object,
  text: PropTypes.string,
  toggleOverlay: PropTypes.func.isRequired,
};

export default Overlay;
