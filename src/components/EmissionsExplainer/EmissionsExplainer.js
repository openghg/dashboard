import PropTypes from "prop-types";
import React from "react";

// Copied ObsExplainer.module.css
import styles from "./EmissionsExplainer.module.css";

// Would this line be better - to use generic ExplanationBox style?
// import styles from "../ExplanationBox/ExplanationBox.module.css";

class EmissionsExplainer extends React.Component {
  render() {
    const style = this.props.nogap ? styles.containerNoGap : styles.container;

    return (
        <div className={style}>
            <div className={styles.header}>Emissions</div>
            <div className={styles.explain}>
               On the live dashboard page we showed measured concentrations of carbon dioxide and 
               methane gases in the atmosphere for each location. What we would really like
               to know is where these greenhouse gases are being emitted.<br/>
               There are two primary methods for estimating greenhouse gas emissions:
                <ol type="a">
                  <li><b>Inventory methods</b>, in which emissions are estimated using socioeconomic data (e.g., the amount of fuel sold and used in the UK).</li>
                  <li><b>Atmospheric data-based methods</b>, in which concentration data and atmospheric models are compared to determine whether the inventory is accurate.</li>
                </ol>
                A map showing the location of the UK's carbon dioxide and methane emissions, according to the inventory, 
                is shown here split by sector.
            </div>
        </div>
    );
  }
}

EmissionsExplainer.propTypes = {
    explain: PropTypes.string,
    header: PropTypes.string,
    intro: PropTypes.string,
  };

export default EmissionsExplainer;