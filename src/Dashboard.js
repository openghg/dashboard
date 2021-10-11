import React from "react";
import { BrowserRouter as Router, Switch, Route, Link, HashRouter } from "react-router-dom";
import { schemeTableau10, schemeSet3, schemeDark2 } from "d3-scale-chromatic";
import { cloneDeep, set } from "lodash";

import ControlPanel from "./components/ControlPanel/ControlPanel";
import OverlayContainer from "./components/OverlayContainer/OverlayContainer";

import TextButton from "./components/TextButton/TextButton";
import Overlay from "./components/Overlay/Overlay";
import FAQ from "./components/FAQ/FAQ";
import LiveData from "./components/LiveData/LiveData";
import Explainer from "./components/Explainer/Explainer";

import { importSiteImages } from "./util/helpers";
import styles from "./Dashboard.module.css";

// The actual timeseries data
import measurementData from "./data/measurement_data.json";
// Metadata such as lat/long etc
import siteMetadata from "./data/site_metadata.json";
// Site description information
import siteInfoJSON from "./data/siteInfo.json";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

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

    // By default we'll just pick a species from a single site to show
    // const defaultSpecies = Object.keys(measurementData).sort()[0];
    const defaultNetwork = Object.keys(measurementData)[0];
    const defaultSpecies = Object.keys(measurementData[defaultNetwork]).sort()[0];
    const defaultSite = Object.keys(measurementData[defaultNetwork][defaultSpecies]).sort()[0];

    this.state.defaultSpecies = defaultSpecies;
    this.state.defaultSite = defaultSite;
    this.state.selectedSites = new Set([defaultSite]);
    this.state.selectedSpecies = defaultSpecies;

    // Only expecting three networks so use these for now
    const colourMaps = [schemeTableau10, schemeSet3, schemeDark2];

    // Assign some colours for the sites
    let siteIndex = 0;
    let networkIndex = 0;

    let siteColours = {};
    for (const [network, localSiteData] of Object.entries(siteMetadata)) {
      for (const site of Object.keys(localSiteData)) {
        const colourCode = colourMaps[networkIndex][siteIndex];
        set(siteColours, `${network}.${site}`, colourCode);
        siteIndex++;
      }
      networkIndex++;
    }

    // Give each site a colour
    this.state.colours = siteColours;
    // The locations of the sites for the selection map
    this.state.sites = siteMetadata;
    // Process the Python outputted measurement data we have from JSON
    this.processData(measurementData);
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

    for (const [species, speciesData] of Object.entries(selectedKeys)) {
      for (const [network, networkData] of Object.entries(speciesData)) {
        for (const [site, sectorData] of Object.entries(networkData)) {
          const value = selectedSites.has(site);
          for (const dataVar of Object.keys(sectorData)) {
            selectedKeys[species][network][site][dataVar] = value;
          }
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
      for (const [network, networkData] of Object.entries(rawData)) {
        for (const [species, speciesData] of Object.entries(networkData)) {
          for (const [site, gasData] of Object.entries(speciesData)) {
            // We want all values from this site to be true
            const defaultValue = site === defaultSite;

            for (const [dataVar, data] of Object.entries(gasData)) {
              // Save metadata separately
              if (dataVar === "data") {
                // TODO - this feels a bit complicated but means we can bring in
                // error data at a later stage
                const speciesUpper = species.toUpperCase();
                // dataKeys[network][species][site][speciesUpper] = defaultValue;

                set(dataKeys, `${species}.${network}.${site}.${speciesUpper}`, defaultValue);

                // We need to use speciesUpper here as we've exported the variables
                // from a pandas Dataframe and may want errors etc in the future
                const timeseriesData = data[speciesUpper];
                const x_timestamps = Object.keys(timeseriesData);
                const x_values = x_timestamps.map((d) => new Date(parseInt(d)));
                // Measurement values
                const y_values = Object.values(timeseriesData);

                const graphData = {
                  x_values: x_values,
                  y_values: y_values,
                };

                // Here use lodash set to create the nested structure
                set(processedData, `${species}.${network}.${site}.${speciesUpper}`, graphData);

                // Create a structure that plotly expects
                // processedData[network][species][site][speciesUpper]
              } else if (dataVar === "metadata") {
                // metadata[network][species][site] = data;
                set(metadata, `${species}.${network}.${site}`, data);
              }
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
    this.state.selectedKeys = dataKeys;
    this.state.metadata = metadata;
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
        <HashRouter>
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
        </HashRouter>
      );
    }
  }
}

export default Dashboard;
