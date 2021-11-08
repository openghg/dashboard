import PropTypes from "prop-types";
import React from "react";

import { set } from "lodash";

import GraphContainer from "../GraphContainer/GraphContainer";
import MultiSiteLineChart from "../MultiSiteLineChart/MultiSiteLineChart";

import { isEmpty, getVisID } from "../../util/helpers";

import styles from "./ObsBox.module.css";
import RadioButtons from "../RadioButtons/RadioButtons";
import NiceButton from "../NiceButton/NiceButton";

class ObsBox extends React.Component {
  createEmissionsGraphs() {
    const selectedKeys = this.props.selectedKeys;
    const processedData = this.props.processedData;
    const selectedSites = this.props.selectedSites;
    const selectedSpecies = this.props.selectedSpecies;
    const metadata = this.props.metadata;

    const noSiteSelected = selectedSites.size === 0;

    if (noSiteSelected) {
      return <div className={styles.emptyMessage}>Please select a site</div>;
    }

    let speciesEmissions = {};
    let multiUnits = [];

    if (selectedKeys) {
      const speciesData = selectedKeys[selectedSpecies];

      for (const [network, networkData] of Object.entries(speciesData)) {
        for (const [site, sectorData] of Object.entries(networkData)) {
          for (const [sector, value] of Object.entries(sectorData)) {
            if (value) {
              const data = processedData[selectedSpecies][network][site][sector];
              set(speciesEmissions, `${network}.${site}.${sector}`, data);

              try {
                multiUnits.push(metadata[selectedSpecies][network][site]["units"]);
              } catch (error) {
                console.error(`Error reading units - ${error}`);
              }
            }
          }
        }
      }

      if (!isEmpty(speciesEmissions)) {
        // Do a quick check to make sure all the units are the same
        let units = "";
        if (new Set(multiUnits).size === 1) {
          units = ` (${multiUnits[0]})`;
        } else {
          console.error(`Multiple units for same species - ${multiUnits}`);
        }

        const key = Object.keys(speciesEmissions).join("-");

        const widthScale = 0.9;
        const heightScale = 0.9;

        // We only set the title of the graph if there's one site selected
        let title = null;
        // if (this.props.selectedSites.size === 1) {
        //   let iter = this.props.selectedSites.values();
        //   const siteName = iter.next().value;
        //   title = metadata[selectedSpecies][network][siteName]["long_name"];
        // }

        const xLabel = "Date";
        const yLabel = `Concentration${units}`;

        const vis = (
          <GraphContainer heightScale={heightScale} widthScale={widthScale} key={key} divName="graphContent">
            <MultiSiteLineChart
              title={title}
              divID={getVisID()}
              data={speciesEmissions}
              xLabel={xLabel}
              yLabel={yLabel}
              key={key}
              colours={this.props.colours}
              units={units}
              siteMetadata={this.props.metadata}
              selectedSpecies={this.props.selectedSpecies}
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
    const siteSelected = this.props.selectedSites.size > 0;

    let clearButton = null;
    if (siteSelected) {
      clearButton = <NiceButton onClick={this.props.clearSelectedSites}>Clear</NiceButton>;
    }

    return (
      <div className={styles.container}>
        <div className={styles.select}>
          <RadioButtons
            onChange={this.props.speciesSelector}
            options={this.props.selectedKeys}
            selected={this.props.selectedSpecies}
          />
          <div className={styles.clearButton}>{clearButton}</div>
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
