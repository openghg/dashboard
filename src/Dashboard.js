import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import ControlPanel from "./components/ControlPanel/ControlPanel";
import OverlayContainer from "./components/OverlayContainer/OverlayContainer";

import TextButton from "./components/TextButton/TextButton";
import Overlay from "./components/Overlay/Overlay";
import FAQ from "./components/FAQ/FAQ";

import { importMockEmissions, importSiteImages } from "./util/helpers";
import styles from "./Dashboard.module.css";

import { cloneDeep } from "lodash";

import glasgowSiteData from "./data/glasgow_nodes_parsed.json";
import glasgowData from "./data/glasgow_data.json";

// Site description information
import siteInfoJSON from "./data/siteInfo.json";

// Model improvement videos
import colourData from "./data/colours.json";
import LiveData from "./components/LiveData/LiveData";
import Explainer from "./components/Explainer/Explainer";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    const completeData = glasgowData;

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
      layoutMode: "dashboard",
      colours: {},
    };

    const defaultSpecies = Object.keys(completeData).sort()[0];
    const defaultSite = Object.keys(completeData[defaultSpecies]).sort()[0];

    this.state.selectedSites = new Set([defaultSite]);
    this.state.defaultSpecies = defaultSpecies;
    this.state.selectedSpecies = defaultSpecies;
    this.state.defaultSite = defaultSite;

    const sites = glasgowSiteData;
    // Assign some colours for the sites
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

  siteSelector(selectedSite) {
    const siteLower = String(selectedSite).toLowerCase();

    // Here we change all the sites and select all species / sectors at that site
    let selectedSites = cloneDeep(this.state.selectedSites);

    if (selectedSites.has(siteLower)) {
      selectedSites.delete(siteLower);
    } else {
      selectedSites.add(siteLower);
    }

    // Now update the selectedKeys so each selected site has all its
    // keys set to true
    let selectedKeys = cloneDeep(this.state.selectedKeys);

    for (const [species, siteData] of Object.entries(selectedKeys)) {
      for (const [site, sectorData] of Object.entries(siteData)) {
        const value = selectedSites.has(site);
        for (const dataVar of Object.keys(sectorData)) {
          selectedKeys[species][site][dataVar] = value;
        }
      }
    }

    this.setState({ selectedKeys: selectedKeys, selectedSites: selectedSites });
  }

  clearSites() {
      console.log("Clickedsdsf")
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

  toggleSidebar() {
    this.setState({ showSidebar: !this.state.showSidebar });
  }

  processData(rawData) {
    // Process the data and create the correct Javascript time objects
    // expected by plotly
    let dataKeys = {};
    let processedData = {};
    let metadata = {};

    let iter = this.state.selectedSites.values();
    const defaultSite = iter.next().value;

    try {
      for (const [species, siteData] of Object.entries(rawData)) {
        dataKeys[species] = {};
        processedData[species] = {};
        metadata[species] = {};

        for (const [site, gasData] of Object.entries(siteData)) {
          const defaultValue = site === defaultSite;
          dataKeys[species][site] = {};
          processedData[species][site] = {};
          metadata[species][site] = {};

          for (const [dataVar, data] of Object.entries(gasData)) {
            // Save metadata separately
            if (dataVar === "data") {
              // TODO - this feels a bit complicated but means we can bring in
              // error data at a later stage
              const speciesUpper = species.toUpperCase();
              dataKeys[species][site][speciesUpper] = defaultValue;

              const timeseriesData = data[speciesUpper];
              const x_timestamps = Object.keys(timeseriesData);
              const x_values = x_timestamps.map((d) => new Date(parseInt(d)));
              // Extract the count values
              const y_values = Object.values(timeseriesData);

              // Create a structure that plotly expects
              processedData[species][site][speciesUpper] = {
                x_values: x_values,
                y_values: y_values,
              };
            } else if (dataVar === "metadata") {
              metadata[species][site] = data;
            }
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
    this.state.metadata = metadata;
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

  //   createModelExplainer() {
  //     const header = "Simulating travel of greenhouse gases";
  //     const body = `When greenhouse gases are emitted, where they travel is dependant
  //     on many different factors including wind direction, speed and turbulence.
  //     When we measure greenhouse gases in the atmosphere, if we want to start to understand
  //     where they came from, first we need to use a model that can simulate this.
  //     Once we have done this we can then compare inventories, as described above, to atmospheric
  //     observations and see how well our predictions match reality.`;
  //     // In order to compare inventories to atmospheric observations, we need to use a model that can simulate how greenhouse gases are dispersed in the atmosphere.
  //     // Here, we show a simulation in which XXXXXX.`;
  //     return <ExplanationBox header={header} intro={body} />;
  //   }

  // <<<<<<< HEAD
  //   createComparisonExplainer() {
  //     const header = "Improving emissions estimates";
  //     const body = `When we compare inventory emissions to atmospheric measurements,
  //     we can see how well this initial “best guess” compares. From this starting point,
  //     we can run simulations where, by making small changes to the possible emissions,
  //     we can continually improve to better match the measurements made at each site.`;
  //     return <ExplanationBox header={header} intro={body} />;
  //   }

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

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <Router>
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
                setOverlay={this.setOverlay}
                toggleOverlay={this.toggleOverlay}
                closePanel={this.toggleSidebar}
              >
                <Link to="/" className={styles.navLink}>
                  Live Data
                </Link>
                <Link to="/explainer" className={styles.navLink}>
                  Explainer
                </Link>
                <Link to="/FAQ" className={styles.navLink}>
                  FAQ
                </Link>
              </ControlPanel>
            </aside>
            <div>
              <div>
                <Switch>
                  <Route path="/explainer">
                    <Explainer />
                  </Route>
                  <Route path="/FAQ">
                    <FAQ />
                  </Route>
                  <Route path="/">
                    <LiveData
                      dataSelector={this.dataSelector}
                      clearSites={this.clearSites}
                      speciesSelector={this.speciesSelector}
                      siteSelector={this.siteSelector}
                      selectedKeys={this.state.selectedKeys}
                      processedData={this.state.processedData}
                      selectedSites={this.state.selectedSites}
                      selectedSpecies={this.state.selectedSpecies}
                      defaultSpecies={this.state.defaultSpecies}
                      colours={this.state.colours}
                      setSiteOverlay={this.state.setSiteOverlay}
                      sites={this.state.sites}
                      metadata={this.state.metadata}
                    />
                  </Route>
                </Switch>
              </div>
            </div>
            {overlay}
          </div>
        </Router>
      );
    }
  }
}

export default Dashboard;
