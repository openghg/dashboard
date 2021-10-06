import PropTypes from "prop-types";
import React from "react";

import styles from "./NiceButton.module.css";

class NiceButton extends React.Component {
  render() {
    const style = styles.niceButton;
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

NiceButton.propTypes = {
  children: PropTypes.object,
  extraStyling: PropTypes.object,
  onClick: PropTypes.func,
  onClickParam: PropTypes.string,
};

export default NiceButton;
