import PropTypes from "prop-types";
import React from "react";

import styles from "./BetterButton.module.css";

class BetterButton extends React.Component {
  render() {
    return (
      <button className={styles.betterButton} onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

BetterButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default BetterButton;
