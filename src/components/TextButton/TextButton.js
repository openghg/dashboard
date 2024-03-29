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
    } else if (styling === "speciesSelected") {
      style = styles.speciesSelected;
    }

    // Shoehorn another way of doing this in
    if(this.props.selected) {
      style = styles.dark;
    }

    const extraStyling = this.props.extraStyling ? this.props.extraStyling : {};
    const onClickParam = this.props.onClickParam;

    return (
      <button
        type="button"
        data-onclickparam={onClickParam}
        className={style}
        style={extraStyling}
        onClick={this.props.onClick}
      >
        {this.props.children}
      </button>
    );
  }
}

TextButton.propTypes = {
  children: PropTypes.string.isRequired,
  extraStyling: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  onClickParam: PropTypes.string,
  selected: PropTypes.bool,
  styling: PropTypes.string
};

export default TextButton;
