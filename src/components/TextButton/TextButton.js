import PropTypes from "prop-types";
import React from "react";

import styles from "./TextButton.module.css";

class TextButton extends React.Component {
  render() {
    let style = styles.light;
    const styling = this.props.styling;
    if (styling === "dark") {
      style = styles.dark;
    } else if (styling === "selected") {
      style = styles.selected;
    }

    const extraStyling = this.props.extraStyling ? this.props.extraStyling : {};

    return (
      <button type="button" className={style} style={extraStyling} onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

TextButton.propTypes = {
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TextButton;
