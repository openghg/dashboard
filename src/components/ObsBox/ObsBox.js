import PropTypes from "prop-types";
import React from "react";

import GraphContainer from "../GraphContainer/GraphContainer";
import LineChart from "../LineChart/LineChart";
import DataSelector from "../DataSelector/DataSelector";

import colours from "../../data/colours.json";
import { isEmpty, getVisID } from "../../util/helpers";

import styles from "./ObsBox.module.css";

class ObsBox extends React.Component {
  createEmissionsGraphs() {
    let visualisations = [];

    const selectedKeys = this.props.selectedKeys;
    const processedData = this.props.processedData;
    const selectedSites = this.props.selectedSites;

    let siteEmissions = {};

    if (selectedKeys) {
      for (const [site, subObj] of Object.entries(selectedKeys)) {
        for (const [species, value] of Object.entries(subObj)) {
          if (value) {
            // Create a visualisation and add it to the list
            const data = processedData[site][species];

            if (!siteEmissions.hasOwnProperty(site)) {
              siteEmissions[site] = {};
            }

            siteEmissions[site][species] = data;
          }
        }
      }

      let totalSites = 0;

      const tableau10 = colours["tableau10"];

      if (!isEmpty(siteEmissions)) {
        for (const [site, emissionsData] of Object.entries(siteEmissions)) {
          // Create a graph for each site
          const title = String(site).toUpperCase();
          const key = title.concat("-", Object.keys(emissionsData).join("-"));
          const containerKey = `container-${key}`;

          const nTypes = Object.keys(emissionsData).length;

          const selectedColours = tableau10.slice(totalSites, totalSites + nTypes);

          //   for (let i = 0; i < nTypes; i++) {
          //     tableau10.push(tableau10.shift());
          //   }

          const widthScale = 0.9;
          const heightScale = 0.9;

          const vis = (
            <GraphContainer heightScale={heightScale} widthScale={widthScale} key={containerKey}>
              <LineChart
                divID={getVisID()}
                data={emissionsData}
                colours={selectedColours}
                title={title}
                xLabel="Date"
                yLabel="Concentration"
                key={key}
                selectedDate={this.props.selectedDate}
              />
            </GraphContainer>
          );

          visualisations.push(vis);

          totalSites += nTypes;
        }
      }
    }
    return visualisations;
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.select}>
          <DataSelector
            dataKeys={this.props.selectedKeys}
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
