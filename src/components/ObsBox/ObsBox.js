import PropTypes from "prop-types";
import React from "react";

import GraphContainer from "../GraphContainer/GraphContainer";
import LineChart from "../LineChart/LineChart";
import DataSelector from "../DataSelector/DataSelector";

import { isEmpty, getVisID } from "../../util/helpers";

import styles from "./ObsBox.module.css";
import MultiSiteLineChart from "../MultiSiteLineChart/MultiSiteLineChart";

class ObsBox extends React.Component {
  createEmissionsGraphs() {
    const selectedKeys = this.props.selectedKeys;
    const processedData = this.props.processedData;
    const selectedSites = this.props.selectedSites;

    if (selectedSites.size === 0) {
      return <div className={styles.emptyMessage}>Please select a site</div>;
    }

    let siteEmissions = {};

    if (selectedKeys) {
      for (const [site, subObj] of Object.entries(selectedKeys)) {
        for (const [species, value] of Object.entries(subObj)) {
          if (value) {
            if (!siteEmissions.hasOwnProperty(site)) {
              siteEmissions[site] = {};
            }

            const data = processedData[site][species];
            siteEmissions[site][species] = data;
          }
        }
      }

      if (!isEmpty(siteEmissions)) {
        const key = Object.keys(siteEmissions).join("-");

        const widthScale = 0.9;
        const heightScale = 0.9;

        const vis = (
          <GraphContainer heightScale={heightScale} widthScale={widthScale} key={key}>
            <MultiSiteLineChart
              divID={getVisID()}
              data={siteEmissions}
              xLabel="Date"
              yLabel="Concentration"
              key={key}
              selectedDate={this.props.selectedDate}
            />
          </GraphContainer>
        );

        return vis;
      }
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.select}>
          <DataSelector
            selectedKeys={this.props.selectedKeys}
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
