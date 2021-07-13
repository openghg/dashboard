import PropTypes from "prop-types";
import React from "react";

import GraphContainer from "../GraphContainer/GraphContainer";
import DataSelector from "../DataSelector/DataSelector";
import MultiSiteLineChart from "../MultiSiteLineChart/MultiSiteLineChart";

import { isEmpty, getVisID } from "../../util/helpers";

import styles from "./ObsBox.module.css";

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

        const vis = (
          <GraphContainer heightScale={heightScale} widthScale={widthScale} key={key}>
            <MultiSiteLineChart
              divID={getVisID()}
              data={speciesEmissions}
              xLabel="Date"
              yLabel="Concentration"
              key={key}
              selectedDate={this.props.selectedDate}
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
          <DataSelector
            selectedKeys={this.props.selectedKeys}
            selectedSpecies={this.props.selectedSpecies}
            dataSelector={this.props.dataSelector}
            selectedSites={this.props.selectedSites}
            clearSelectedSites={this.props.clearSelectedSites}
            autoUpdate={true}
          />
        </div>
        <div className={styles.plot}>{this.createEmissionsGraphs()}</div>
      </div>
    );
  }
}

ObsBox.propTypes = {
  bodyText: PropTypes.any,
  headerText: PropTypes.any,
  processedData: PropTypes.object,
  selectedKeys: PropTypes.object,
  dataSelector: PropTypes.func,
};

export default ObsBox;
