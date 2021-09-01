import PropTypes from "prop-types";
import React from "react";
import styles from "./ControlPanel.module.css";

import textData from "../../data/overlayText.json";

import OpenGHGLogo from "../../images/OpenGHG_Logo_Portrait.svg";
import Overlay from "../Overlay/Overlay";
import TextButton from "../TextButton/TextButton";

class ControlPanel extends React.Component {
  constructor(props) {
    super(props);

    this.createOverlay = this.createOverlay.bind(this);
  }

  createOverlay(e) {
    const area = e.target.dataset.onclickparam;

    if (!textData.hasOwnProperty(area)) {
      console.error(`No data for $(area) in overlayText`);
      return;
    }

    const text = textData[area];
    this.props.toggleOverlay();
    this.props.setOverlay(<Overlay text={text} toggleOverlay={this.props.toggleOverlay} />);
  }

  render() {
    const mode = this.props.layoutMode;

    return (
      <div className={styles.container}>
        <div className={styles.closeButton}>
          <TextButton styling="light" extraStyling={{ fontSize: "2em" }} onClick={this.props.closePanel}>
            x
          </TextButton>
        </div>
        <div className={styles.header}>
          <div className={styles.headerText}>Data Dashboard</div>
          <div className={styles.headerTag}>by OpenGHG</div>
        </div>
        <div className={styles.content}>
          <TextButton onClickParam="dashboard" onClick={this.props.setMode} selected={mode === "dashboard"}>
            Live Data
          </TextButton>
          <TextButton onClickParam="explainer" onClick={this.props.setMode} selected={mode === "explainer"}>
            Explainer
          </TextButton>
          <TextButton onClickParam="faq" onClick={this.props.setMode} selected={mode === "faq"}>
            FAQ
          </TextButton>
        </div>
        <div className={styles.footer}>
        <a href="https://github.com/openghg/dashboard" rel="noreferrer" target="_blank">
          <img src={OpenGHGLogo} alt="OpenGHG Logo" />
          </a>
        </div>
      </div>
    );
  }
}

ControlPanel.propTypes = {
  closePanel: PropTypes.func.isRequired,
  layoutMode: PropTypes.string.isRequired,
  setMode: PropTypes.func.isRequired,
  setOverlay: PropTypes.func.isRequired,
  toggleOverlay: PropTypes.func.isRequired,
};

export default ControlPanel;
