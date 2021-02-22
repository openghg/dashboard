import React from "react";

import SliderMap from "../SliderMap/SliderMap";
import VisLayout from "../VisLayout/VisLayout";
import GraphContainer from "../GraphContainer/GraphContainer";
import LineChart from "./../LineChart/LineChart";
import colours from "../../data/colours.json";

import styles from "./FootprintAnalysis.module.css";

// Import all the data we need - so all the SVGs
// Have all the site data available
// Have a list of the sites available
// Then we can select the plots we want to create
// Maybe instead of Linechart directly we could use VisLayout

class FootprintAnalysis extends React.Component {
  constructor(props) {
    super(props);

    let dates = [];

    const footprints = {};
    try {
      const requiredSVGs = require.context("../../images/londonFootprints/TMB", false, /\.svg$/);
      const paths = requiredSVGs.keys();

      // This is quite a bit of work but it means we can have human-readable filenames
      // and pass a list of dates to the SliderMap component
      for (const path of paths) {
        // Here we need to read the filename and convert it to a UNIX timestamp
        const filename = String(path).split("_")[1];
        const timestampStr = String(filename).split(".")[0];

        const timestamp = new Date(timestampStr).getTime();

        footprints[timestamp] = requiredSVGs(path)["default"];

        dates = Object.keys(footprints);
        dates.sort();
      }
    } catch (e) {
      console.error(
        "Could not import images. We expect image filenames of the form londonHighResFootprint-2020-08-01T11:00:00.svg"
      );
    }

    this.state = { selectedDate: dates[0], footprints: footprints, dates: dates };
    this.dateSelector = this.dateSelector.bind(this);
  }

  createGraphs() {
    return null;
    const measurementData = this.props.measurementData;

    let visualisations = [];

    // For now just fix this to be TMB
    // const selectedKeys = this.state.selectedKeys;
    const selectedKeys = { TMB: { CO2: true, CH4: true } };

    let speciesData = {};

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

    return <VisLayout>{visualisations}</VisLayout>;
  }

  dateSelector(date) {
    // Here date is a ms-based UNIX timestamp
    this.setState({ selectedDate: parseInt(date) });
    console.log(date);
  }

  dataSelector() {
    // Select the data we want to plot on the linechart based on the date range we have the footprint for.
  }

  render() {
    const footprints = this.state.footprints;
    const footprintImg = footprints[this.state.selectedDate];

    const overlayBounds = [
      [50.87063, -1.26],
      [52.0193672, 0.46799811],
    ];

    return (
      <div className={styles.container}>
        <div className={styles.map}>
          <SliderMap
            dateSelector={this.dateSelector}
            selectedDate={this.state.selectedDate}
            dates={this.state.dates}
            sites={this.props.siteData}
            centre={[51.5, -0.0482]}
            zoom={10}
            width={"75vw"}
            height={"65vh"}
            overlayImg={footprintImg}
            overlayBounds={overlayBounds}
          />
        </div>
        <div className={styles.plots}>{this.createGraphs()}</div>
      </div>
    );
  }
}

export default FootprintAnalysis;
