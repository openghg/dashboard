import React from "react";


import LineChart from "./components/LineChart/LineChart";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import GraphContainer from "./components/GraphContainer/GraphContainer";
import ObsBox from "./components/ObsBox/ObsBox";
import DateSlider from "./components/DateSlider/DateSlider";
import EmissionsBox from "./components/EmissionsBox/EmissionsBox";
import ModelBox from "./components/ModelBox/ModelBox";

// import siteData from "./mock/LGHGSitesRandomData.json";
import colours from "./data/colours.json";
import mockEmissionsData from "./mock/randomSiteData.json";

import { isEmpty, getVisID, importMockEmissions } from "./util/helpers";

import styles from "./Dashboard.module.css";

// import TMBData from "./data/TMB_data_LGHG.json";
// import NPLData from "./data/NPL_data_LGHG.json";
import BTTData from "./data/BTT_data_LGHG.json";
import OverlayContainer from "./components/OverlayContainer/OverlayContainer";
import londonGHGSites from "./data/siteMetadata.json";

// const measurementData = {
//   ...TMBData,
//   ...NPLData,
//   ...BTTData,
// };

let measurementData = {
  ...BTTData,
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    // TOOD - update this
    // This only works on the assumption that all data has the same dates
    // which the current mocked data does.
    const allDates = Object.keys(measurementData["BTT"]["CO2"]);
    // We don't want to use every timestamp for the slider so just take every nth
    let dates = [];
    // Take every nth
    const nSkip = 70;
    for (let i = 0; i < allDates.length; i += nSkip) {
      dates.push(allDates[i]);
    }

    // For now just use the same data for each site
    measurementData["NPL"] = measurementData["BTT"];
    measurementData["TMB"] = measurementData["BTT"];
    // Now add in the mocked up sectors for each site
    for (const key of Object.keys(mockEmissionsData)) {
      if (measurementData.hasOwnProperty(key)) {
        measurementData[key] = { ...measurementData[key], ...mockEmissionsData[key] };
      }
    }

    this.state = {
      error: null,
      isLoaded: false,
      sidePanel: false,
      selectedDate: 0,
      availableDates: dates,
      processedData: {},
      dataKeys: {},
      selectedKeys: {},
      footprintView: true,
      emptySelection: true,
      overlayOpen: false,
      overlay: null,
      plotType: "footprint",
      selectedSite: null,
    };

    // For the moment create some fake sites
    this.state.sites = londonGHGSites;
    // Set the selected data to be the first date
    this.state.selectedDate = parseInt(dates[0]);
    // Import the emissions PNG paths so we can select the image we want using the slider
    this.state.mockEmissionsPNGs = importMockEmissions();
    // Process data we have from JSON
    this.processData(measurementData);

    // Select the data
    this.dataSelector = this.dataSelector.bind(this);
    // Selects the dates
    this.dateSelector = this.dateSelector.bind(this);
    this.selectPlotType = this.selectPlotType.bind(this);
    this.siteSelector = this.siteSelector.bind(this);
    this.toggleOverlay = this.toggleOverlay.bind(this);
    this.setOverlay = this.setOverlay.bind(this);
  }

  dateSelector(date) {
    // Here date is a ms-based UNIX timestamp
    this.setState({ selectedDate: parseInt(date) });
  }

  siteSelector(site) {
    this.setState({ selectedSite: site });
  }

  toggleOverlay() {
    this.setState({ overlayOpen: !this.state.overlayOpen });
  }

  setOverlay(overlay) {
    this.setState({ overlayOpen: true, overlay: overlay });
  }

  processData(data) {
    // Process the data and create the correct Javascript time objects
    let dataKeys = {};
    let processedData = {};

    const defaultSite = Object.keys(data).sort()[0];

    try {
      for (const site of Object.keys(data)) {
        dataKeys[site] = {};
        processedData[site] = {};

        for (const species of Object.keys(data[site])) {
          if (site === defaultSite) {
            dataKeys[site][species] = true;
          } else {
            dataKeys[site][species] = false;
          }

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
    this.state.selectedSite = defaultSite;
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

  // Lets use the selections from the panel as different emissions values

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

  selectPlotType(event) {
    const value = event.target.value;
    this.setState({ plotType: value });
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

  createEmissionsBox() {
    const emissionsHeader = "Emissions";
    const emissionsText = `Emissions from the National Atmospheric Emissions Inventory (LINK: NAEI). Learn more about how
       countries estimate and report there emissions here (LINK: PAGE EXPLAINING INVENTORY)`;
    return (
      <div className={styles.emissions}>
        <EmissionsBox
          altText={"Example emissions"}
          headerText={emissionsHeader}
          bodyText={emissionsText}
          selectedDate={this.state.selectedDate}
        />
      </div>
    );
  }

  createModelBox() {
    const modelHeader = "Model";
    const modelText = `Atmospheric models use meteorological data to simulate the dispersion of 
    greenhouse gases through the atmosphere. Learn more about simulating atmospheric gas transport here (LINK: PAGE ON MODELS)​`;
    const imagePath = this.state.mockEmissionsPNGs[this.state.selectedDate];

    return (
      <div className={styles.model}>
        <ModelBox
          altText={"Example model"}
          headerText={modelHeader}
          bodyText={modelText}
          selectedDate={this.state.selectedDate}
          imagePath={imagePath}
        />
      </div>
    );
  }

  createObsBox() {
    const obsHeader = "Observations";
    const obsText = `By comparing model simulations to observed concentrations, we can evaluate the emissions inventory. 
      Learn more about evaluating GHG emissions inventories using atmospheric data (LINK: PAGE ON INVERSIONS)​`;

    return (
      <div className={styles.observations}>
        <ObsBox
          headerText={obsHeader}
          bodyText={obsText}
          selectedKeys={this.state.selectedKeys}
          processedData={this.state.processedData}
          dataSelector={this.dataSelector}
          selectedDate={this.state.selectedDate}
          selectedSite={this.state.selectedSite}
          setSelectedSite={this.siteSelector}
        ></ObsBox>
      </div>
    );
  }

  createDateSlider() {
    return (
      <div className={styles.dateSlider}>
        <DateSlider
          dates={this.state.availableDates}
          selectedDate={this.state.selectedDate}
          dateSelector={this.dateSelector}
        />
      </div>
    );
  }

  render() {
    let { error, isLoaded } = this.state;

    let overlay = null;
    if (this.state.overlayOpen) {
      overlay = <OverlayContainer toggleOverlay={this.toggleOverlay}>{this.state.overlay}</OverlayContainer>;
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className={styles.gridContainer}>
          <div className={styles.header}>OpenGHG Dashboard</div>
          <div className={styles.sidebar}>
            <ControlPanel setOverlay={this.setOverlay} toggleOverlay={this.toggleOverlay} />
          </div>
          <div className={styles.content} id="graphContent">
            {this.createEmissionsBox()}
            {this.createModelBox()}
            {this.createDateSlider()}
            {this.createObsBox()}
          </div>
          {overlay}
        </div>
      );
    }
  }
}

export default Dashboard;
