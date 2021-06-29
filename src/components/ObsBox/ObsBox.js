import PropTypes from "prop-types";
import React from "react";

import GraphContainer from "../GraphContainer/GraphContainer";
import LineChart from "../LineChart/LineChart";
import VisLayout from "../VisLayout/VisLayout";

import colours from "../../data/colours.json";
import { isEmpty, getVisID } from "../../util/helpers";

import styles from "./ObsBox.module.css";

class ObsBox extends React.Component {
  createEmissionsGraphs() {
    let visualisations = [];

    const selectedKeys = this.props.selectedKeys;
    const processedData = this.props.processedData;

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
          //   console.log(site, emissionsData);
          // Create a graph for each site
          const title = String(site).toUpperCase();
          const key = title.concat("-", Object.keys(emissionsData).join("-"));
          const containerKey = `container-${key}`;

          const nTypes = Object.keys(emissionsData).length;

          const selectedColours = tableau10.slice(totalSites, totalSites + nTypes);

          //   for (let i = 0; i < nTypes; i++) {
          //     tableau10.push(tableau10.shift());
          //   }

          const vis = (
            <GraphContainer key={containerKey}>
              <LineChart
                divID={getVisID()}
                data={emissionsData}
                colours={selectedColours}
                title={title}
                xLabel="Date"
                yLabel="Concentration"
                key={key}
              />
            </GraphContainer>
          );

          visualisations.push(vis);

          totalSites += nTypes;
        }
      }
    }
    return <VisLayout>{visualisations}</VisLayout>;
  }

  createDropDown() {
    //   Iterate over the sites so we can select the data we want to plot, only select by site for now
    const data = this.props.processedData;
    let choices = [];

    for (const site of Object.keys(data)) {
      const label = String(site).toUpperCase();
      const testID = "test-id-" + label;

      const choice = (
        <option data-testid={testID} value={label}>
          {label}
        </option>
      );

      choices.push(choice);
    }

    return (
      <div className={styles.plotSelector}>
        Select site:
        <div>
          <form>
            <select data-testid="select-form" value={this.props.plotType} onChange={this.props.selectPlotType}>
              {choices}
            </select>
          </form>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>{this.props.headerText}</div>
        <div className={styles.body}>{this.props.bodyText}</div>
        <div className={styles.select}></div>

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
};

export default ObsBox;
