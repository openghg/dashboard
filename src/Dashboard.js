import "./Dashboard.css";
import React from "react";
import random_data from "./random.json";
import { v4 as uuidv4 } from "uuid";
import { createSites } from "./mock/randomSites.js";

import LineChart from "./components/LineChart/LineChart";
import LeafletMap from "./components/LeafletMap/LeafletMap";

// import Header from "./components/Header/Header";
import Summary from "./components/Summary/Summary";
import Overview from "./components/Overview/Overview";
import VisLayout from "./components/VisLayout/VisLayout";
import SidePanel from "./components/Sidepanel/SidePanel";

import GraphContainer from "./components/GraphContainer/GraphContainer";


class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      sidePanel: false,
      apiData: [],
    };

    this.state.sites = createSites();

    this.toggleSidePanel = this.toggleSidePanel.bind(this);
  }

  apiFetch(apiURL) {}

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

  getID() {
    // Create a unique ID for each visualisation
    return "vis-id-" + uuidv4();
  }

  toggleSidePanel() {
    this.setState({ sidePanel: !this.state.sidePanel });
  }

  render() {
    let { error, isLoaded } = this.state;

    const colours = ["#013a63", "#2a6f97", "#014f86"]

    // Just set this as true for now as we're not pulling anything
    // from an API
    isLoaded = true;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      const gas_data_a = random_data["gas_a"];
      const gas_data_b = random_data["gas_b"];
      const gas_data_c = random_data["gas_c"];

      // Break the header into a component?
      // Break the cards into components?
      // How will visualisations scale?
      // Have a VisLayout component that takes

      return (
        <div className="grid-container">
          <div className="header">
            <div onClick={this.toggleSidePanel} class="nav-icon">
              <div></div>
            </div>
            OpenGHG Dashboard
          </div>
          <div className="main">
            <SidePanel
              isOpen={this.state.sidePanel}
              togglePanel={this.toggleSidePanel}
            />
            <LeafletMap
              divID={this.getID()}
              sites={this.state.sites}
              centre={[51.458377, -2.603017]}
              zoom={5}
              width={"75vw"}
              height={"65vh"}
            />
            <Summary>
              <div>
                Glasgow is the third most populous city in the United Kingdom,
                with an estimated city population of 612,040 in 2016.
              </div>
            </Summary>

            <Overview />

            <VisLayout>
              <GraphContainer>
                <LineChart divID={this.getID()} data={gas_data_a} colour={colours[2]} />
              </GraphContainer>
              <GraphContainer>
                <LineChart divID={this.getID()} data={gas_data_b} colour={colours[1]}/>
              </GraphContainer>
              <GraphContainer>
                <LineChart divID={this.getID()} data={gas_data_c} colour={colours[0]}/>
              </GraphContainer>
            </VisLayout>
          </div>
        </div>
      );
    }
  }
}

export default Dashboard;
