import PropTypes from "prop-types";
import React from "react";
import ExplanationBox from "../ExplanationBox/ExplanationBox";
import LeafletMap from "../LeafletMap/LeafletMap";

import styles from "../../Dashboard.module.css";
import ObsBox from "../ObsBox/ObsBox";

class LiveData extends React.Component {
  createMapExplainer() {
    const header = "Observations";
    const explainer = `• Greenhouse gas concentrations are monitored from a network of sites across the city.\n
    • Measurements are made of carbon dioxide and methane, the most important greenhouse gases.\n
    • Scientists are using these observations to learn more about the UK's methane emissions.\n
    Start exploring the measurements by selecting a site from the map`;
    return <ExplanationBox header={header} explain={explainer} split={true} />;
  }

  createIntro() {
    const explanation = `Welcome to the OpenGHG dashboard, where you can view greenhouse gas concentration data from our network sensors across London.`;
    return <ExplanationBox nogap={true} explain={explanation} />;
  }

  createObsBox() {
    return (
      <ObsBox
        dataSelector={this.props.dataSelector}
        clearSelectedSites={this.props.clearSites}
        speciesSelector={this.props.speciesSelector}
        selectedKeys={this.props.selectedKeys}
        processedData={this.props.processedData}
        selectedSites={this.props.selectedSites}
        selectedSpecies={this.props.selectedSpecies}
        defaultSpecies={this.props.defaultSpecies}
        colours={this.props.colours}
        metadata={this.props.metadata}
      />
    );
  }

  render() {
    return (
      <div className={styles.content}>
        <div className={styles.intro}>{this.createIntro()}</div>
        <div className={styles.timeseries} id="graphContent">
          {this.createObsBox()}
        </div>
        <div className={styles.mapExplainer}>{this.createMapExplainer()}</div>
        <div className={styles.siteMap}>
          <LeafletMap
            siteSelector={this.props.siteSelector}
            sites={this.props.sites}
            centre={[51.5, -0.0782]}
            zoom={10}
            colours={this.props.colours}
            siteData={this.props.siteData}
            siteInfoOverlay={this.props.setSiteOverlay}
          />
        </div>
      </div>
    );
  }
}

LiveData.propTypes = {
  clearSites: PropTypes.func,
  colours: PropTypes.object,
  dataSelector: PropTypes.func,
  defaultSpecies: PropTypes.string,
  processedData: PropTypes.object,
  selectedKeys: PropTypes.object,
  selectedSites: PropTypes.object,
  selectedSpecies: PropTypes.string,
  setSiteOverlay: PropTypes.func,
  siteData: PropTypes.object,
  siteSelector: PropTypes.func,
  sites: PropTypes.object,
  speciesSelector: PropTypes.func,
};

export default LiveData;
