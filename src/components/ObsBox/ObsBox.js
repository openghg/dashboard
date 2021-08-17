import PropTypes from "prop-types";
import React from "react";

import GraphContainer from "../GraphContainer/GraphContainer";
import MultiSiteLineChart from "../MultiSiteLineChart/MultiSiteLineChart";

import { isEmpty, getVisID } from "../../util/helpers";

import styles from "./ObsBox.module.css";
import RadioButtons from "../RadioButtons/RadioButtons";

class ObsBox extends React.Component {
  createEmissionsGraphs() {
    const selectedKeys = this.props.selectedKeys;
    const processedData = this.props.processedData;
    const selectedSites = this.props.selectedSites;
    const selectedSpecies = this.props.selectedSpecies;

    if (selectedSites.size === 0) {
      return <div className={styles.emptyMessage}>Please select a site</div>;
    }

    let speciesEmissions = {};

    if (selectedKeys) {
      const siteData = selectedKeys[selectedSpecies];

      for (const [site, sectorData] of Object.entries(siteData)) {
        for (const [sector, value] of Object.entries(sectorData)) {
          if (value) {
            if (!speciesEmissions.hasOwnProperty(site)) {
              speciesEmissions[site] = {};
            }

            const data = processedData[selectedSpecies][site][sector];
            speciesEmissions[site][sector] = data;
          }
        }
      }

      if (!isEmpty(speciesEmissions)) {
        const key = Object.keys(speciesEmissions).join("-");

        const widthScale = 0.9;
        const heightScale = 0.9;

        let title = null;
        if (this.props.selectedSites.size === 1) {
          let iter = this.props.selectedSites.values();
          const selectedSite = iter.next().value;
          title = selectedSite;
        }

        // TODO - Could we move this into the data dictionary so it has a "units" key?
        let units = "";
        const species = this.props.selectedSpecies;
        if (species === "CH4") {
          units = " (ppb)";
        } else if (species === "CO2") {
          units = " (ppm)";
        }

        const yLabel = "Concentration " + units;

        const vis = (
          <GraphContainer heightScale={heightScale} widthScale={widthScale} key={key}>
            <MultiSiteLineChart
              title={title}
              divID={getVisID()}
              data={speciesEmissions}
              xLabel="Date"
              yLabel={yLabel}
              key={key}
              colours={this.props.colours}
              //   selectedDate={this.props.selectedDate}
            />
          </GraphContainer>
        );

        return vis;
      } else {
        console.error("No data to plot.");
        return null;
      }
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.select}>
          <RadioButtons
            onChange={this.props.speciesSelector}
            options={this.props.selectedKeys}
            selected={this.props.selectedSpecies}
          />
        </div>
        <div className={styles.plot}>{this.createEmissionsGraphs()}</div>
      </div>
    );
  }
}

ObsBox.propTypes = {
  bodyText: PropTypes.string,
  dataSelector: PropTypes.func,
  defaultSpecies: PropTypes.string,
  headerText: PropTypes.string,
  processedData: PropTypes.object,
  selectedKeys: PropTypes.object,
  selectedSites: PropTypes.object,
  selectedSpecies: PropTypes.string,
  speciesSelector: PropTypes.func,
  clearSelectedSites: PropTypes.func,
  colours: PropTypes.object.isRequired,
};

export default ObsBox;
