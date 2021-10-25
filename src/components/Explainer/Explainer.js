import PropTypes from "prop-types";
import React from "react";
import ExplanationBox from "../ExplanationBox/ExplanationBox";
import EstimatesExplainer from "../EstimatesExplainer/EstimatesExplainer";
import EmissionsBox from "../EmissionsBox/EmissionsBox";
import EmissionsExplainer from "../EmissionsExplainer/EmissionsExplainer"

import styles from "../../Dashboard.module.css";

import inversionDemo from "../../images/modelVideos/inversion_demo_UK_optim.gif";
import inventoryComparison from "../../images/methane_BEIS_2019.png";

// Model demonstration image
import gasDispersionImage from "../../images/modelImage/emissions_measurements_image.png";

class Explainer extends React.Component {
  createEmissionsBox() {
    const emissionsHeader = "Emissions";
    const emissionsText = `Emissions from the National Atmospheric Emissions Inventory (NAEI).`;
    return (
      <EmissionsBox
        altText={"Example emissions"}
        headerText={emissionsHeader}
        bodyText={emissionsText}
      />
    );
  }

  // createEmissionsExplainer() {
  //   const header = "Emissions";
  //   const intro = `On the live dashboard page we showed the amount of carbon dioxide and methane we measure in the atmosphere. These measurements can be used to infer emissions.`;
  //   const body = `There are two primary methods for estimating greenhouse gas emissions:
  //           a) Inventory methods, in which emissions are estimated using socioeconomic data (e.g., the amount of fuel sold and used in the UK). A map showing the location of the UK's carbon dioxide and methane emissions, according to the inventory, is shown here.\n
  //           b) Atmospheric data-based methods, in which concentration data and atmospheric models are compared to determine whether the inventory may need to be adjusted.`;
  //   return <ExplanationBox nogap={true} header={header} intro={intro} explain={body} />;
  // }

  createModelExplainer() {
    const header = "Simulating travel of greenhouse gases";
    const body = `When greenhouse gases are emitted, where they travel is dependant
    on many different factors including wind direction, speed and turbulence.
    Greenhouse gases are often measured from high places, including the top of buildings
    and tall masts, like BT towers (as illustrated here).
    If we want to start to understand where these greenhouse gases
    came from, first we need to use a model that can simulate this.
    We can then compare emissions inventories, as described above, to atmospheric
    observations and see how well our predictions match reality.`;
    // In order to compare inventories to atmospheric observations, we need to use a model that can simulate how greenhouse gases are dispersed in the atmosphere.
    // Here, we show a simulation in which XXXXXX.`;
    return <ExplanationBox header={header} intro={body} />;
  }

  createComparisonExplainer() {
    const header = "Comparing models with observations";
    const body = `To start with we can use our inventory emissions as our initial “best guess”
    and compare this to real atmospheric measurements. We can then run simulations to make 
    small changes to the possible emissions and continuously improve to better match the measurements made at each site.
    The animation below illustrates this process, using a site in Tacolneston, Norfolk which is part of
    the UK DECC network as an example.`;
    return <ExplanationBox header={header} intro={body} />;
  }

  render() {
    return (
      <div className={styles.explainerContent}>
        <div className={styles.emissionsMap}>{this.createEmissionsBox()}</div>
        <div className={styles.emissionsExplainer}>
          <EmissionsExplainer />
        </div>
        <div className={styles.dispersionExplainer}>{this.createModelExplainer()}</div>
        <div className={styles.dispersionImage}>
          <img src={gasDispersionImage} alt="How source gases disperse in the atmopshere" />
        </div>
        <div className={styles.comparisonExplainer}>{this.createComparisonExplainer()}</div>
        <div className={styles.modelImprovement}>
          <img src={inversionDemo} alt="Improvement of model estimates" />
        </div>
        <div className={styles.estimatesExplainer}>
          <EstimatesExplainer />
        </div>
        <div className={styles.estimatesImage}>
          <img src={inventoryComparison} alt="Inventory improvement" />
          <div className={styles.linkType}>
            O'Doherty et al. 2019, &nbsp;
            <a
              href="https://www.gov.uk/government/publications/uk-greenhouse-gas-emissions-monitoring-and-verification"
              target="_blank"
              rel="noopener noreferrer"
            >
              Annual report on long-term atmospheric measurement and interpretation
            </a>
            , BEIS, 2019
          </div>
        </div>
      </div>
    );
  }
}

Explainer.propTypes = {
  explain: PropTypes.string,
  header: PropTypes.string,
  intro: PropTypes.string,
};

export default Explainer;
