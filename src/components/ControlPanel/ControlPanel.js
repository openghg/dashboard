import PropTypes from "prop-types";
import React from "react";
import styles from "./ControlPanel.module.css";

import textData from "../../data/overlayText.json";

import GitHubLogo from "../../images/github.svg";
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
    return (
      <div className={styles.container}>
        <div className={styles.closeButton}>
          <TextButton styling="light" extraStyling={{ fontSize: "2em" }} onClick={this.props.closePanel}>
            x
          </TextButton>
        </div>
        <div className={styles.header}>
          <div className={styles.headerText}>OpenGHG</div>
          <div className={styles.headerTag}>Data dashboard</div>
        </div>
        <div className={styles.content}>
          <TextButton onClickParam={true} onClick={this.props.setMode} selected={this.props.dashboardMode}>
            Live Data
          </TextButton>
          <TextButton onClickParam={false} onClick={this.props.setMode} selected={!this.props.dashboardMode}>
            Explainer
          </TextButton>
        </div>
        <div className={styles.footer}>
          <a href="https://github.com/openghg/dashboard" rel="noreferrer" target="_blank">
            <img src={GitHubLogo} alt="GitHub logo" />
          </a>
        </div>
      </div>
    );
  }
}

ControlPanel.propTypes = {
  closePanel: PropTypes.func.isRequired,
  dashboardMode: PropTypes.bool.isRequired,
  setMode: PropTypes.func.isRequired,
  setOverlay: PropTypes.func.isRequired,
  toggleOverlay: PropTypes.func.isRequired,
};

export default ControlPanel;
