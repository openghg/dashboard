import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import ControlPanel from "./components/ControlPanel/ControlPanel";
import OverlayContainer from "./components/OverlayContainer/OverlayContainer";
import londonGHGSites from "./data/siteMetadata.json";
import ExplanationBox from "./components/ExplanationBox/ExplanationBox";
import TextButton from "./components/TextButton/TextButton";
import Overlay from "./components/Overlay/Overlay";
import FAQ from "./components/FAQ/FAQ";

import { importMockEmissions, importSiteImages } from "./util/helpers";
import styles from "./Dashboard.module.css";

import { cloneDeep } from "lodash";

import co2Data from "./data/co2_jun20.json";
import ch4Data from "./data/ch4_jun20.json";

// Site description information
import siteInfoJSON from "./data/siteInfo.json";

// Model improvement videos
import colourData from "./data/colours.json";
import LiveData from "./components/LiveData/LiveData";
import Explainer from "./components/Explainer/Explainer";

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

  createModelExplainer() {
    const header = "Simulating greenhouse gas concentrations";
    const body = `In order to compare inventories to atmospheric observations, we need to use a model that can simulate how greenhouse gases are dispersed in the atmosphere.
    Here, we show a simulation in which XXXXXX.`;
    return <ExplanationBox header={header} intro={body} />;
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
                setMode={this.setMode}
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
                      clearSelectedSites={this.clearSites}
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
