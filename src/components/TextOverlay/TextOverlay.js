import PropTypes from "prop-types";
import React from "react";

import TextButton from "../TextButton/TextButton";

import styles from "./TextOverlay.module.css";

class TextOverlay extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.closeButton}>
          <TextButton onClick={this.props.toggleOverlay} styling={"dark"} extraStyling={{fontSize: "1.5vw"}}>x</TextButton>
        </div>
        <div className={styles.textContainer}>
          <div className={styles.header}>Atmospheric Modelling</div>
          <div className={styles.intro}>Atmospheric Modelling introduction</div>
          <div className={styles.body}>
            It is important to quantify the size of sources and sinks of greenhouse gases and ozone depleting substances
            to understand our changing climate and inform policy makers. It is impossible to measure all global sources
            and sinks directly and so we have to use measurements of atmospheric concentrations combined with models to
            inform us instead. One approach to this is solving an ‘inverse problem’ where we track a gas backwards from
            the measurement site to a location to quantify its emissions. Another is simulating the global flow of gases
            and observing how well this matches measurements. As no model or measurement is perfect, we robustly
            quantify the uncertainty using a variety of statistical methods.
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
