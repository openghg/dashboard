import React from "react";

import SliderMap from "../SliderMap/SliderMap";
import VisLayout from "../VisLayout/VisLayout";
import GraphContainer from "../GraphContainer/GraphContainer";
import LineChart from "./../LineChart/LineChart";
import colours from "../../data/colours.json"

import styles from "./FootprintAnalysis.module.css";

// Import all the data we need - so all the SVGs
// Have all the site data available
// Have a list of the sites available
// Then we can select the plots we want to create
// Maybe instead of Linechart directly we could use VisLayout

class FootprintAnalysis extends React.Component {
  constructor(props) {
    super(props);

    this.state = { dateSelected: 0 };

    this.dateSelector = this.dateSelector.bind(this);
  }

  importSVGs() {
    const requiredSVGs = require.context("../../images/londonFootprints", false, /\.svg$/);
    const svgs = requiredSVGs.keys().map((path) => ({ path, file: requiredSVGs(path) }));
    this.setState({ footprints: svgs });
  }

  createGraphs() {
    let visualisations = [];

    // For now just fix this to be TMB
    // const selectedKeys = this.state.selectedKeys;
    const selectedKeys = {"TMB": {"CO2": true, "CH4": true}}

    let speciesData = {};

    const measurementData = this.props.measurementData;

    if (selectedKeys) {
      for (const [site, subObj] of Object.entries(selectedKeys)) {
        for (const [species, value] of Object.entries(subObj)) {
          if (value) {
            // Create a visualisation and add it to the list
            const data = measurementData[site][species];

            if (!speciesData.hasOwnProperty(species)) {
              speciesData[species] = {};
            }

            speciesData[species][site] = data;
          }
        }
      }

      let totalSites = 0;

      const tableau10 = colours["tableau10"];

      if (!Object.keys(speciesData).length === 0) {
        for (const [species, siteData] of Object.entries(speciesData)) {
          // Create a graph for each species
          const title = String(species).toUpperCase();
          const key = title.concat("-", Object.keys(siteData).join("-"));
          const containerKey = `container-${key}`;

          const nSites = Object.keys(siteData).length;

          const selectedColours = tableau10.slice(totalSites, totalSites + nSites);

          //   for (let i = 0; i < nSites; i++) {
          //     tableau10.push(tableau10.shift());
          //   }

          const vis = (
            <GraphContainer key={containerKey}>
              <LineChart
                divID={this.getID()}
                data={siteData}
                colours={selectedColours}
                title={title}
                xLabel="Date"
                yLabel="Concentration"
                key={key}
                dateMarker={this.state.dateSelected}
              />
            </GraphContainer>
          );

          visualisations.push(vis);

          totalSites += nSites;
        }
      }
    }

    return visualisations;
  }

  dateSelector(date) {
    // Here date is a ms-based UNIX timestamp
    this.setState({ dateSelected: parseInt(date) });
  }

  dataSelector() {
    // Select the data we want to plot on the linechart based on the date range we have the footprint for.
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.map}>
          <SliderMap
            dateSelector={this.dateSelector}
            sites={this.props.siteData}
            centre={[51.5, -0.0482]}
            zoom={11}
            width={"75vw"}
            height={"65vh"}
          />
        </div>
        <div className={styles.plots}>
          <VisLayout>{this.createGraphs}</VisLayout>
        </div>
      </div>
    );
  }
}

export default FootprintAnalysis;
