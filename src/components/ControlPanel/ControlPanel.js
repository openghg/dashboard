import PropTypes from "prop-types";
import React from "react";
import styles from "./ControlPanel.module.css";

import textData from "../../data/overlayText.json";

import GitHubLogo from "../../images/github.svg";
import TextOverlay from "../TextOverlay/TextOverlay";
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
    this.props.setOverlay(<TextOverlay text={text} toggleOverlay={this.props.toggleOverlay} />);
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerText}>OpenGHG</div>
          <div className={styles.headerTag}>A COP26 dashboard</div>
        </div>
        <div className={styles.content}>
          <TextButton onClick={this.createOverlay} onClickParam="emissions">
            Emissions
          </TextButton>
          <TextButton onClick={this.createOverlay} onClickParam="model">
            Model
          </TextButton>
          <TextButton onClick={this.createOverlay} onClickParam="observations">
            Observations
          </TextButton>
          <TextButton onClick={this.createOverlay} onClickParam="about">
            About OpenGHG
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
  toggleOverlay: PropTypes.func.isRequired,
};

export default ControlPanel;
