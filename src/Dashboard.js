import React from "react";

import ControlPanel from "./components/ControlPanel/ControlPanel";
import ObsBox from "./components/ObsBox/ObsBox";
import EmissionsBox from "./components/EmissionsBox/EmissionsBox";
import OverlayContainer from "./components/OverlayContainer/OverlayContainer";
import londonGHGSites from "./data/siteMetadata.json";
import ExplanationBox from "./components/ExplanationBox/ExplanationBox";
import LeafletMap from "./components/LeafletMap/LeafletMap";

import { importMockEmissions, importSiteImages } from "./util/helpers";
import styles from "./Dashboard.module.css";

import { cloneDeep } from "lodash";

import co2Data from "./data/co2_jun20.json";
import ch4Data from "./data/ch4_jun20.json";

// Site description information
import siteInfoJSON from "./data/siteInfo.json";

// Model improvement videos
import measComparison from "./images/modelVideos/meas_comparison_optim.gif";
import mapUpdate from "./images/modelVideos/map_update_optim.gif";
import inventoryComparison from "./images/Inventory_InverseModelling_comparison.jpg";
import colourData from "./data/colours.json";
import TextButton from "./components/TextButton/TextButton";
import Overlay from "./components/Overlay/Overlay";
import FAQ from "./components/FAQ/FAQ";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    const completeData = { CO2: co2Data, CH4: ch4Data };

    this.state = {
      error: null,
      isLoaded: false,
      showSidebar: false,
      selectedDate: 0,
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
      layoutMode: "dashboard",
      colours: {},
      validModes: ["dashboard", "explainer", "faq"],
    };

    const defaultSite = Object.keys(co2Data).sort()[0];
    this.state.selectedSites = new Set([defaultSite]);

    // Just take these sites out for now
    const sites = {};
    sites["TMB"] = londonGHGSites["TMB"];
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
    // Import the emissions PNG paths so we can select the image we want using the slider
    this.state.mockEmissionsPNGs = importMockEmissions();
    // Process data we have from JSON
    this.processData(completeData);
    // Build the site info for the overlays
    this.buildSiteInfo();

    // Select the data
    this.dataSelector = this.dataSelector.bind(this);
    // Selects the dates
    this.siteSelector = this.siteSelector.bind(this);
    this.toggleOverlay = this.toggleOverlay.bind(this);
    this.setOverlay = this.setOverlay.bind(this);
    this.speciesSelector = this.speciesSelector.bind(this);
    this.clearSites = this.clearSites.bind(this);
    this.setMode = this.setMode.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.setSiteOverlay = this.setSiteOverlay.bind(this);
  }

  buildSiteInfo() {
    const siteImages = importSiteImages();

    let siteData = {};
    for (const site of Object.keys(siteInfoJSON)) {
      try {
        siteData[site] = {};
        siteData[site]["image"] = siteImages[site];
        siteData[site]["description"] = siteInfoJSON[site]["description"];
      } catch (error) {
        console.log(error);
      }
    }

    // Disabled the no direct mutation rule here as this only gets called from the constructor
    /* eslint-disable react/no-direct-mutation-state */
    this.state.siteInfo = siteData;
    /* eslint-enable react/no-direct-mutation-state */
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
    const layoutMode = e.target.dataset.onclickparam;
    const validModes = this.state.validModes;

    if (validModes.includes(layoutMode)) {
      this.setState({ layoutMode: layoutMode });
    } else {
      console.error(`Invalid mode ${layoutMode}, should be one of ${validModes}`);
    }
  }

  setOverlay(overlay) {
    this.setState({ overlayOpen: true, overlay: overlay });
  }

  toggleSidebar() {
    this.setState({ showSidebar: !this.state.showSidebar });
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

  setSiteOverlay(e) {
    const siteCode = String(e.target.dataset.onclickparam).toUpperCase();
    const siteInfo = this.state.siteInfo[siteCode];

    const siteText = siteInfo["description"];
    const image = siteInfo["image"];
    const alt = `Image of ${siteCode}`;

    const overlay = (
      <Overlay header={siteCode} text={siteText} alt={alt} image={image} toggleOverlay={this.toggleOverlay} />
    );

    this.toggleOverlay();
    this.setOverlay(overlay);
  }

  // Component creation functions

  createEmissionsBox() {
    const emissionsHeader = "Emissions";
    const emissionsText = `Emissions from the National Atmospheric Emissions Inventory (NAEI).`;
    return (
      <EmissionsBox
        speciesSelector={this.speciesSelector}
        altText={"Example emissions"}
        headerText={emissionsHeader}
        bodyText={emissionsText}
      />
    );
  }

  createObsBox() {
    return (
      <ObsBox
        selectedKeys={this.state.selectedKeys}
        processedData={this.state.processedData}
        dataSelector={this.dataSelector}
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
    const body = `Greenhouse gas concentrations are monitored from a network of sites across the city.
    Measurements are made of carbon dioxide and methane, the most important greenhouse gases.
    Scientists are using these observations to learn more about the UK's methane emissions.`;
    const explanation = `Start exploring the measurements by selecting a site from the map`;
    return <ExplanationBox header={header} intro={body} explain={explanation} />;
  }

  createEmissionsExplainer() {
    const header = "Emissions";
    const intro = `On the live dashboard page we showed the amount of carbon dioxide and methane we measure in the atmosphere.
                  We make these measurements in order to infer emissions.`;
    const body = `There are two primary methods for estimating greenhouse gas emissions:
        a) Inventory methods, in which emissions are estimated using socioeconomic data (e.g., the amount of fuel sold and used in the UK).
        A map showing the location of the UK's carbon dioxide and methane emissions, according to the inventory, is shown here.
        b) Atmospheric data-based methods, in which concentration data and atmospheric models are compared to determine whether the inventory may need to be adjusted.`;
    return <ExplanationBox header={header} intro={intro} explain={body} />;
  }

  createIntro() {
    const explanation = `Welcome to the OpenGHG dashboard, where you can view greenhouse gas concentration data from 
                        our network sensors across London.`;
    return <ExplanationBox nogap={true} explain={explanation} />;
  }

  createModelExplainer() {
    const header = "Simulating greenhouse gas concentrations";
    const body = `In order to compare inventories to atmospheric observations, we need to use a model that can simulate how greenhouse gases are dispersed in the atmosphere.
    Here, we show a simulation in which XXXXXX.`;
    return <ExplanationBox header={header} intro={body} />;
  }

  createComparisonExplainer() {
    const header = "Comparing model with observations";
    const body = `We can compare the inventory emissions to the atmospheric measurements to see how well they compare. 
    From this initial “best guess”, we can run simulations where, by making small changes to the possible emissions, 
    we can continually improve to better match the measurements made at each site.`;
    return <ExplanationBox header={header} intro={body} />;
  }

  createEstimatesExplainer() {
    const header = "Case study: Improved national emission estimates";
    const body = `One way this has been used is to improve UK national methane estimates – by adjusting emissions to better 
    match to the atmospheric data from the UK DECC network[LINK], we can help to evaluate the inventory. `;
    const explain = `This study suggested that methane emissions from the inventory were consistent with atmospheric data in recent years. 
    However, in the 1990s and early 2000s, the two methods disagreed. This information is now allowing the inventory teams to examine assumptions in the earlier record, 
    and, hopefully, improve our understand of the UK's methane emissions.`;

    return <ExplanationBox nogap={false} header={header} intro={body} explain={explain} />;
  }

  render() {
    let { error, isLoaded } = this.state;

    let overlay = null;
    if (this.state.overlayOpen) {
      overlay = <OverlayContainer toggleOverlay={this.toggleOverlay}>{this.state.overlay}</OverlayContainer>;
    }

    let extraSidebarStyle = {};
    if (this.state.showSidebar) {
      extraSidebarStyle = { transform: "translateX(0px)" };
    }

    const layoutMode = this.state.layoutMode;

    let pageContent = "Select mode";
    if (layoutMode === "dashboard") {
      pageContent = (
        <div className={styles.content}>
          <div className={styles.intro}>{this.createIntro()}</div>
          <div className={styles.timeseries} id="graphContent">
            {this.createObsBox()}
          </div>
          <div className={styles.mapExplainer}>{this.createMapExplainer()}</div>
          <div className={styles.siteMap}>
            <LeafletMap
              siteSelector={this.siteSelector}
              sites={this.state.sites}
              centre={[51.5, -0.0782]}
              zoom={10}
              colours={this.state.colours}
              siteData={this.state.siteData}
              siteInfoOverlay={this.setSiteOverlay}
            />
          </div>
        </div>
      );
    } else if (layoutMode === "explainer") {
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
    } else if (layoutMode === "faq") {
      pageContent = (
        <div className={styles.faqContent}>
          <FAQ />
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
          <div className={styles.header}>
            <div className={styles.menuIcon}>
              <TextButton styling="light" extraStyling={{ fontSize: "1.6em" }} onClick={this.toggleSidebar}>
                &#9776;
              </TextButton>
            </div>
          </div>
          <aside className={styles.sidebar} style={extraSidebarStyle}>
            <ControlPanel
              layoutMode={this.state.layoutMode}
              setMode={this.setMode}
              setOverlay={this.setOverlay}
              toggleOverlay={this.toggleOverlay}
              closePanel={this.toggleSidebar}
            />
          </aside>
          <div>{pageContent}</div>
          {overlay}
        </div>
      );
    }
  }
}

export default Dashboard;
