import PropTypes from "prop-types";
import React from "react";

import styles from "./ObsBox.module.css";

class ObsBox extends React.Component {
  constructor(props) {
    super(props);

    this.something = 2;
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>{this.props.headerText}</div>
        <div className={styles.body}>{this.props.bodyText}</div>
        <div className={styles.plot}>{this.props.children}</div>
      </div>
    );
  }
}

ObsBox.propTypes = {
  altText: PropTypes.string,
  bodyText: PropTypes.string,
  headerText: PropTypes.string,
  imagePath: PropTypes.string,
  layoutTwo: PropTypes.bool,
};

export default ObsBox;
