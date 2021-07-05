import PropTypes from "prop-types";
import React from "react";

import TextButton from "../TextButton/TextButton";

import styles from "./TextOverlay.module.css";

class TextOverlay extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.closeButton}>
          <TextButton onClick={this.props.toggleOverlay} styling={"dark"} extraStyling={{ fontSize: "1.5vw" }}>
            x
          </TextButton>
        </div>
        <div className={styles.textContainer}>
          <div className={styles.header}>{this.props.text["header"]}</div>
          <div className={styles.intro}>{this.props.text["intro"]}</div>
          <div className={styles.body}>
            {this.props.text["body"]}
          </div>
        </div>
      </div>
    );
  }
}

TextOverlay.propTypes = {
  toggleOverlay: PropTypes.func.isRequired,
};

export default TextOverlay;
