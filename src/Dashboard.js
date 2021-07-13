import React from "react";

import LineChart from "./components/LineChart/LineChart";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import GraphContainer from "./components/GraphContainer/GraphContainer";
import ObsBox from "./components/ObsBox/ObsBox";
import DateSlider from "./components/DateSlider/DateSlider";
import EmissionsBox from "./components/EmissionsBox/EmissionsBox";
import ModelBox from "./components/ModelBox/ModelBox";
import OverlayContainer from "./components/OverlayContainer/OverlayContainer";
import londonGHGSites from "./data/siteMetadata.json";
import SelectorMap from "./components/SelectorMap/SelectorMap";
import ExplanationBox from "./components/ExplanationBox/ExplanationBox";

import { isEmpty, getVisID, importMockEmissions } from "./util/helpers";
import styles from "./Dashboard.module.css";

import { cloneDeep } from "lodash";

import co2Data from "./data/co2_oct19.json";
import ch4Data from "./data/ch4_oct19.json";
import mockEmissionsDataCO2 from "./mock/randomSiteDataCO2.json";
import mockEmissionsDataCH4 from "./mock/randomSiteDataCH4.json";
import colours from "./data/colours.json";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    // TOOD - update this
    // This only works on the assumption that all data has the same dates
    // which the current mocked data does.
    const allDates = Object.keys(co2Data["TMB"]["CO2"]);
    // We don't want to use every timestamp for the slider so just take every nth
    let dates = [];
    // Take every nth
    const nSkip = 70;
    for (let i = 0; i < allDates.length; i += nSkip) {
      dates.push(allDates[i]);
    }

    // Now add in the mocked up sectors for each site
    for (const key of Object.keys(co2Data)) {
      if (co2Data.hasOwnProperty(key)) {
        co2Data[key] = { ...co2Data[key], ...mockEmissionsDataCO2[key] };
      }
    }

    for (const key of Object.keys(ch4Data)) {
      if (ch4Data.hasOwnProperty(key)) {
        ch4Data[key] = { ...ch4Data[key], ...mockEmissionsDataCH4[key] };
      }
    }

    const completeData = { CO2: co2Data, CH4: ch4Data };

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
      selectedSpecies: "CO2",
    };

    const defaultSite = Object.keys(co2Data).sort()[0];
    this.state.selectedSites = new Set([defaultSite]);

    // Just take these sites out for now
    const sites = {};
    sites["TMB"] = londonGHGSites["TMB"];
    sites["BTT"] = londonGHGSites["BTT"];
    sites["NPL"] = londonGHGSites["NPL"];

    this.state.sites = sites;
    // Set the selected data to be the first date
    this.state.selectedDate = parseInt(dates[0]);
    // Import the emissions PNG paths so we can select the image we want using the slider
    this.state.mockEmissionsPNGs = importMockEmissions();
    // Process data we have from JSON
    this.processData(completeData);

    // Select the data
    this.dataSelector = this.dataSelector.bind(this);
    // Selects the dates
    this.dateSelector = this.dateSelector.bind(this);
    this.siteSelector = this.siteSelector.bind(this);
    this.toggleOverlay = this.toggleOverlay.bind(this);
    this.setOverlay = this.setOverlay.bind(this);
    this.speciesSelector = this.speciesSelector.bind(this);
    this.clearSites = this.clearSites.bind(this);
  }

  dateSelector(date) {
    // Here date is a ms-based UNIX timestamp
    this.setState({ selectedDate: parseInt(date) });
  }

  siteSelector(site) {
    // Here we change all the sites and select all species / sectors at that site
    let selectedSites = cloneDeep(this.state.selectedSites);
    selectedSites.add(site);

    // Now update the selectedKeys so each selected site has all its
    // keys set to true
    let selectedKeys = cloneDeep(this.state.selectedKeys);

    for (const [species, siteData] of Object.entries(selectedKeys)) {
      for (const [site, sectorData] of Object.entries(siteData)) {
        const value = selectedSites.has(site);
        for (const sector of Object.keys(sectorData)) {
          selectedKeys[species][site][sector] = value;
        }
      }
    }

    this.setState({ selectedKeys: selectedKeys, selectedSites: selectedSites });
  }

  clearSites() {
    this.setState({ selectedSites: new Set() });
  }

  speciesSelector(species) {
    this.setState({ selectedSpecies: species });
  }

  toggleOverlay() {
    this.setState({ overlayOpen: !this.state.overlayOpen });
  }

  setOverlay(overlay) {
    this.setState({ overlayOpen: true, overlay: overlay });
  }

  processData(rawData) {
    // Process the data and create the correct Javascript time objects
    // expected by plotly
    let dataKeys = {};
    let processedData = {};

    let iter = this.state.selectedSites.values();
    const defaultSite = iter.next().value;

    try {
      for (const [species, siteData] of Object.entries(rawData)) {
        dataKeys[species] = {};
        processedData[species] = {};

        for (const [site, gasData] of Object.entries(siteData)) {
          const defaultValue = site === defaultSite;
          dataKeys[species][site] = {};
          processedData[species][site] = {};

          for (const [sector, data] of Object.entries(gasData)) {
            dataKeys[species][site][sector] = defaultValue;
            const x_timestamps = Object.keys(data);
            const x_values = x_timestamps.map((d) => new Date(parseInt(d)));
            // Extract the count values
            const y_values = Object.values(data);

            // Create a structure that plotly expects
            processedData[species][site][sector] = {
              x_values: x_values,
              y_values: y_values,
            };
          }
        }
      }
    } catch (error) {
      console.error("Error reading data: ", error);
    }

    // Disabled the no direct mutation rule here as this only gets called from the constructor
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

      const tab20 = colours["tab20"];

      if (!isEmpty(speciesData)) {
        for (const [species, siteData] of Object.entries(speciesData)) {
          // Create a graph for each species
          const title = String(species).toUpperCase();
          const key = title.concat("-", Object.keys(siteData).join("-"));
          const containerKey = `container-${key}`;

          const nSites = Object.keys(siteData).length;

          const selectedColours = tab20.slice(totalSites, totalSites + nSites);

          //   for (let i = 0; i < nSites; i++) {
          //     tab20.push(tab20.shift());
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
    const emissionsText = `Emissions from the National Atmospheric Emissions Inventory (NAEI).`;
    return (
      <EmissionsBox
        speciesSelector={this.speciesSelector}
        altText={"Example emissions"}
        headerText={emissionsHeader}
        bodyText={emissionsText}
        selectedDate={this.state.selectedDate}
      />
    );
  }

  createModelBox() {
    const modelHeader = "Model";
    const modelText = `Atmospheric models use meteorological data to simulate the dispersion of 
    greenhouse gases through the atmosphere. Learn more about simulating atmospheric gas transport here.​`;
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
    return (
      <ObsBox
        selectedKeys={this.state.selectedKeys}
        processedData={this.state.processedData}
        dataSelector={this.dataSelector}
        selectedDate={this.state.selectedDate}
        selectedSites={this.state.selectedSites}
        selectedSpecies={this.state.selectedSpecies}
        clearSelectedSites={this.clearSites}
      ></ObsBox>
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

  createMapExplainer() {
    const header = "Observations";
    const body = `By comparing model simulations to observed concentrations, we can evaluate the emissions inventory. 
    Learn more about evaluating GHG emissions inventories using atmospheric data.`;
    const explanation = `Select a site on the map to view observations taken by an instrument at that site.`;
    return <ExplanationBox header={header} intro={body} explain={explanation} />;
  }

  createEmissionsExplainer() {
    const header = "Emissions";
    const body = `By comparing model simulations to observed concentrations, we can evaluate the emissions inventory. 
    Learn more about evaluating GHG emissions inventories using atmospheric data.
    Select a site on the map to view observations taken by an instrument at that site.`;
    const explanation = `Above is the amount of carbon dioxide we measure at each location, 
    but what we really want to know is where these greenhouse gases came from. This is one way we can make sure we’re hitting planned targets.
    We can build a map of expected emissions (an inventory) by adding together different sources. 
    But how can we check these expected emissions match what we see? [sources infographic?]`;
    return <ExplanationBox header={header} intro={body} explain={explanation} />;
  }

  createModelExplainer() {
    const header = "Modelling emissions";
    const body = `Atmospheric models use meteorological data to simulate the dispersion of greenhouse gases through the atmosphere. 
    Learn more about simulating atmospheric gas transport here.​`;
    const explanation = `Using computational models it is possible to model the emissions we'd expect to have been created in specific
    places from observations we've previously observed. By comparing the model output with the observed emissions we can further improve
    our modelling capabilities.`;
    return <ExplanationBox header={header} intro={body} explain={explanation} />;
  }

  createIntro() {
    const explanation = `Welcome to the OpenGHG dashboard, view live observation data from our network of gas sensors across London.`;
    return <ExplanationBox nogap={true} explain={explanation} />;
  }

  createProcessExplainer() {
    const header = "Improving the model";
    const body = `To try and improve on this, we can run simulations where, by making small changes to the possible emissions, 
    we can continually improve to better match the measurements made at each site. `;
    const explanation = `One way this has been used is to improve UK national methane estimates [nice plot showing Alistair’s InTeM 
    estimates from the paper]. In this way, we can use measurements to help learn where these greenhouse gases came from.`;
    return <ExplanationBox header={header} intro={body} explain={explanation} />;
  }

  createObsExplainer() {
    const explanation = `If we plot the modelled emissions from each sector overlain on the actual measure observations we can
    visualise how the model is improving with the changes we make in the steps described above.`;
    return <ExplanationBox nogap={true} explain={explanation} />;
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
            <div className={styles.intro}>{this.createIntro()}</div>
            <div className={styles.observations}>{this.createObsBox()}</div>
            <div className={styles.mapExplainer}>{this.createMapExplainer()}</div>
            <div className={styles.sitemap}>
              <SelectorMap siteSelector={this.siteSelector} sites={this.state.sites} />
            </div>
            <div className={styles.emissionsMap}>{this.createEmissionsBox()}</div>
            <div className={styles.emissionsExplainer}>{this.createEmissionsExplainer()}</div>
            <div className={styles.processExplainer}>{this.createProcessExplainer()}</div>
            <div className={styles.processInfographic}>Infographic</div>
            <div className={styles.detailedObs}>{this.createObsBox()}</div>
            <div className={styles.detailedObsExplainer}>{this.createObsExplainer()}</div>
          </div>
          {overlay}
        </div>
      );
    }
  }
}

export default Dashboard;
