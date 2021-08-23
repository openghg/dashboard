import React from "react";

import ControlPanel from "./components/ControlPanel/ControlPanel";
import ObsBox from "./components/ObsBox/ObsBox";
import EmissionsBox from "./components/EmissionsBox/EmissionsBox";
import OverlayContainer from "./components/OverlayContainer/OverlayContainer";
import londonGHGSites from "./data/siteMetadata.json";
import SelectorMap from "./components/SelectorMap/SelectorMap";
import ExplanationBox from "./components/ExplanationBox/ExplanationBox";

import { importMockEmissions } from "./util/helpers";
import styles from "./Dashboard.module.css";

import { cloneDeep } from "lodash";

import co2Data from "./data/co2_oct19.json";
import ch4Data from "./data/ch4_oct19.json";

// Model improvement videos
import measComparison from "./images/modelVideos/meas_comparison_optim.gif";
import mapUpdate from "./images/modelVideos/map_update_optim.gif";
import inventoryComparison from "./images/Inventory_InverseModelling_comparison.jpg";
import colourData from "./data/colours.json";

// import infographic from "./images/infographic_mock.png";

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

    // // Now add in the mocked up sectors for each site
    // for (const key of Object.keys(co2Data)) {
    //   if (co2Data.hasOwnProperty(key)) {
    //     co2Data[key] = { ...co2Data[key], ...mockEmissionsDataCO2[key] };
    //   }
    // }

    // for (const key of Object.keys(ch4Data)) {
    //   if (ch4Data.hasOwnProperty(key)) {
    //     ch4Data[key] = { ...ch4Data[key], ...mockEmissionsDataCH4[key] };
    //   }
    // }

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
      defaultSpecies: "CO2",
      dashboardMode: true,
      colours: {},
    };

    const defaultSite = Object.keys(co2Data).sort()[0];
    this.state.selectedSites = new Set([defaultSite]);

    // Just take these sites out for now
    const sites = {};
    sites["TMB"] = londonGHGSites["TMB"];
    sites["BTT"] = londonGHGSites["BTT"];
    sites["NPL"] = londonGHGSites["NPL"];

    let index = 0;
    let siteColours = {};
    const tab10 = colourData["tab10"];
    for (const site of Object.keys(sites)) {
      siteColours[site] = tab10[index];
      index++;
    }

    // Give each site a colour
    this.state.colours = siteColours;
    // The locations of the sites for the selection map
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
    this.siteSelector = this.siteSelector.bind(this);
    this.toggleOverlay = this.toggleOverlay.bind(this);
    this.setOverlay = this.setOverlay.bind(this);
    this.speciesSelector = this.speciesSelector.bind(this);
    this.clearSites = this.clearSites.bind(this);
    this.setMode = this.setMode.bind(this);
  }

  siteSelector(site) {
    // Here we change all the sites and select all species / sectors at that site
    let selectedSites = cloneDeep(this.state.selectedSites);

    if (selectedSites.has(site)) {
      selectedSites.delete(site);
    } else {
      selectedSites.add(site);
    }

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

  setMode(e) {
    const dashboardMode = e.target.dataset.onclickparam === "true" ? true : false;
    this.setState({ dashboardMode: dashboardMode });
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
        speciesSelector={this.speciesSelector}
        defaultSpecies={this.state.defaultSpecies}
        colours={this.state.colours}
      ></ObsBox>
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
    const intro = `On the live dashboard page we showed the amount of carbon dioxide we measure at each location, but what we really want to know is where these greenhouse gases came from.`;
    const body = `This is one way we can make sure we’re hitting planned targets.
    We can build a map of expected emissions (an inventory) by adding together different sources.`;
    return <ExplanationBox header={header} intro={intro} explain={body} />;
  }

  createIntro() {
    const explanation = `Welcome to the OpenGHG dashboard where you can view live observation data from 
                        our network of gas sensors across London.`;
    return <ExplanationBox nogap={true} explain={explanation} />;
  }

  createComparisonExplainer() {
    const header = "Comparing model with observations";
    const body = `We can compare these emissions to the measurements we made to see how well they compare. 
    From this initial “best guess”, we can run simulations where, by making small changes to the possible emissions, 
    we can continually improve to better match the measurements made at each site.`;
    return <ExplanationBox header={header} intro={body} />;
  }

  createEstimatesExplainer() {
    const header = "Improve national estimates";
    const body = `One way this has been used is to improve UK national methane estimates – by looking at what emissions would better 
    match to the data, the inventory itself could be improved over time and sources of these greenhouse gases better understood. `;
    const explain = `In this way we can use measurements to help learn where greenhouse gases came from and are coming from and to see where they can be reduced.`;

    return <ExplanationBox nogap={false} header={header} intro={body} explain={explain} />;
  }

  render() {
    let { error, isLoaded } = this.state;

    let overlay = null;
    if (this.state.overlayOpen) {
      overlay = <OverlayContainer toggleOverlay={this.toggleOverlay}>{this.state.overlay}</OverlayContainer>;
    }

    let pageContent = (
      <div className={styles.content}>
      <div className={styles.intro}>
          {this.createIntro()}
      </div>
        <div className={styles.timeseries} id="graphContent">
          {this.createObsBox()}
        </div>
        <div className={styles.contentCards}>
          <div className={styles.card}>{this.createMapExplainer()}</div>
          <div className={styles.card}>
            <SelectorMap
              width="40vw"
              siteSelector={this.siteSelector}
              sites={this.state.sites}
              colours={this.state.colours}
            />
          </div>
        </div>
      </div>
    );

    if (!this.state.dashboardMode) {
      pageContent = (
        <div className={styles.explainerContent}>
          <div className={styles.emissionsMap}>{this.createEmissionsBox()}</div>
          <div className={styles.emissionsExplainer}>{this.createEmissionsExplainer()}</div>
          <div className={styles.comparisonExplainer}>{this.createComparisonExplainer()}</div>
          <div className={styles.modelImprovement}>
            <img src={measComparison} alt="Improvement of model estimates" />
          </div>
          <div className={styles.modelImage}>
            <img src={mapUpdate} alt="Improvement of emissions map" />
          </div>
          <div className={styles.estimatesExplainer}>{this.createEstimatesExplainer()}</div>
          <div className={styles.estimatesImage}>
            <img src={inventoryComparison} alt="Inventory improvement" />
            <div>
              O'Doherty et al. 2018, "Annual report on long-term atmospheric measurement and interpretation", BEIS, 2018
            </div>
          </div>
        </div>
      );
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
            <ControlPanel
              dashboardMode={this.state.dashboardMode}
              setMode={this.setMode}
              setOverlay={this.setOverlay}
              toggleOverlay={this.toggleOverlay}
            />
          </div>
          <div>{pageContent}</div>
          {overlay}
        </div>
      );
    }
  }
}

export default Dashboard;
