import PropTypes from "prop-types";
import React from "react";
import styles from "./ControlPanel.module.css";

import GitHubLogo from "../../images/github.svg";
import TextOverlay from "../TextOverlay/TextOverlay";

class ControlPanel extends React.Component {
  constructor(props) {
    super(props);

    this.createOverlay = this.createOverlay.bind(this);
  }

  createOverlay() {
    this.props.toggleOverlay();
    this.props.setOverlay(<TextOverlay />);
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerText}>OpenGHG</div>
          <div className={styles.headerTag}>A COP26 dashboard</div>
        </div>
        <div className={styles.content}>
          <button type="button" className={styles.linkButton} onClick={this.createOverlay}>
            Emissions
          </button>
          <button type="button" className={styles.linkButton} onClick={this.createOverlay}>
            Model
          </button>
          <button type="button" className={styles.linkButton} onClick={this.createOverlay}>
            Obervations
          </button>
          <button type="button" className={styles.linkButton} onClick={this.createOverlay}>
            About OpenGHG
          </button>
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
