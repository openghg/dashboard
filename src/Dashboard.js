import "./Dashboard.css";
import React from "react";

import londonGHGSites from "./data/siteMetadata.json";

import LineChart from "./components/LineChart/LineChart";
// import Summary from "./components/Summary/Summary";
import Overview from "./components/Overview/Overview";
import VisLayout from "./components/VisLayout/VisLayout";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import GraphContainer from "./components/GraphContainer/GraphContainer";
import FootprintAnalysis from "./components/FootprintAnalysis/FootprintAnalysis";

import siteData from "./mock/LGHGSitesRandomData.json";
import colours from "./data/colours.json";

import { isEmpty, getVisID } from "./util/helpers";

import TMBData from "./data/TMB_data_LGHG.json";
import NPLData from "./data/NPL_data_LGHG.json";
import BTTData from "./data/BTT_data_LGHG.json";

const measurementData = {
  ...TMBData,
  ...NPLData,
  ...BTTData,
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      sidePanel: false,
      //   apiData: [],
      selectedDate: 0,
      processedData: {},
      dataKeys: {},
      selectedKeys: {},
      footprintView: true,
      emptySelection: true,
      plotType: "footprint",
    };

    // For the moment create some fake sites
    this.state.sites = londonGHGSites;
    // This data will come from a function but for now just read it in
    this.state.apiData = this.processData();

    this.toggleSidePanel = this.toggleSidePanel.bind(this);
    this.dataSelector = this.dataSelector.bind(this);
    this.processData = this.processData.bind(this);
    this.dateSelector = this.dateSelector.bind(this);
    this.selectPlotType = this.selectPlotType.bind(this);
  }

  dateSelector(date) {
    // Here date is a ms-based UNIX timestamp
    this.setState({ selectedDate: parseInt(date) });
  }

  // Need a function to process the data that's keyed
  processData() {
    // const data = this.state.apiData;
    const data = measurementData;

    // Process the data and create the correct Javascript time objects
    let dataKeys = {};
    let processedData = {};

    try {
      for (const site of Object.keys(data)) {
        dataKeys[site] = {};
        processedData[site] = {};

        for (const species of Object.keys(data[site])) {
          dataKeys[site][species] = false;

          const gas_data = data[site][species];

          const x_timestamps = Object.keys(gas_data);
          const x_values = x_timestamps.map((d) => new Date(parseInt(d)));
          // Extract the count values
          const y_values = Object.values(gas_data);

          // Create a structure that plotly expects
          processedData[site][species] = {
            x_values: x_values,
            y_values: y_values,
          };
        }
      }
    } catch (error) {
      console.error("Error reading data: ", error);
    }

    // Disabled the no direct mutation rule here as this only gets called from the ctor
    /* eslint-disable react/no-direct-mutation-state */
    this.state.processedData = processedData;
    this.state.dataKeys = dataKeys;
    this.state.selectedKeys = dataKeys;
    this.state.isLoaded = true;
    /* eslint-enable react/no-direct-mutation-state */
  }

  dataSelector(dataKeys) {
    this.setState({ selectedKeys: dataKeys });
  }

  createGraphs() {
    let visualisations = [];

    const selectedKeys = this.state.selectedKeys;
    const processedData = this.state.processedData;

    let speciesData = {};

    if (selectedKeys) {
      for (const [site, subObj] of Object.entries(selectedKeys)) {
        for (const [species, value] of Object.entries(subObj)) {
          if (value) {
            // Create a visualisation and add it to the list
            const data = processedData[site][species];

            if (!speciesData.hasOwnProperty(species)) {
              speciesData[species] = {};
            }

            speciesData[species][site] = data;
          }
        }
      }

      let totalSites = 0;

      const tableau10 = colours["tableau10"];

      if (!isEmpty(speciesData)) {
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
                divID={getVisID()}
                data={siteData}
                colours={selectedColours}
                title={title}
                xLabel="Date"
                yLabel="Concentration"
                key={key}
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

  componentDidMount() {
    // const apiURL = "";
    // fetch(apiURL)
    //   .then((res) => res.json())
    //   .then(
    //     (result) => {
    //       this.setState({
    //         isLoaded: true,
    //         weatherData: result,
    //         // or apiData
    //       });
    //     },
    //     (error) => {
    //       this.setState({
    //         isLoaded: true,
    //         error,
    //       });
    //     }
    //   );
  }

  toggleSidePanel() {
    this.setState({ sidePanel: !this.state.sidePanel });
  }

  //   togglePlots() {
  //     this.setState({ footprintView: !this.state.footprintView });
  //   }

  selectPlotType(event) {
    const value = event.target.value;
    this.setState({ plotType: value });
  }

  createPlots() {
    if (this.state.plotType === "footprint") {
      return (
        <FootprintAnalysis
          sites={siteData}
          centre={[51.5, -0.0482]}
          zoom={9}
          width={"75vw"}
          height={"40vh"}
          measurementData={this.state.processedData}
          siteData={siteData}
        />
      );
    } else {
      return <VisLayout>{this.createGraphs()}</VisLayout>;
    }
  }

  anySelected() {
    for (const subdict of Object.values(this.state.selectedKeys)) {
      for (const value of Object.values(subdict)) {
        if (value === true) {
          return true;
        }
      }
    }

    return false;
  }

  plotHeader() {
    if (this.state.plotType === "footprint") {
      return <div className={"plot-header"}>Footprint Analysis</div>;
    } else {
      return <div className={"plot-header"}>Timeseries Comparison</div>;
    }
  }

  plotAdvice() {
    if (this.state.plotType === "timeseries") {
      if (!this.state.selectedKeys || !this.anySelected()) {
        return <div className="plot-advice">Please select species to plot.</div>;
      }
    }
  }

  render() {
    let { error, isLoaded } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="grid-container">
          <div className="header">
            <div>
              <div></div>
            </div>
            LondonGHG Dashboard
          </div>
          <div className="main">
            <div className="main-side">
              <ControlPanel
                selectPlotType={this.selectPlotType}
                plotType={this.state.plotType}
                dataKeys={this.state.selectedKeys}
                dataSelector={this.dataSelector}
              />
            </div>
            <div className="main-panel">
              <Overview />
              <div className="main-plots">
                {this.plotHeader()}
                {this.createPlots()}
                {this.plotAdvice()}
              </div>
              {/* <Summary>
                <div>
                  To tackle climate change, we need to measure and reduce carbon emissions. London GHG is installing a
                  new network of atmospheric measurements across the capital, and developing a new modelling framework
                  to provide emission estimates of carbon dioxide and methane.
                </div>
              </Summary> */}
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Dashboard;
