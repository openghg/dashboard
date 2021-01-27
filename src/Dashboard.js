import "./Dashboard.css";
import React from "react";
import random_data from "./random.json";
import { v4 as uuidv4 } from "uuid";
import { createSites } from "./mock/randomSites.js";

import LineChart from "./components/LineChart/LineChart";
import LeafletMap from "./components/LeafletMap/LeafletMap";

import Header from "./components/Header/Header";
import Summary from "./components/Summary/Summary";
import Overview from "./components/Overview/Overview";
import VisLayout from "./components/VisLayout/VisLayout";
import SidePanel from "./components/Sidepanel/SidePanel";

import GraphContainer from "./components/GraphContainer/GraphContainer";

const apiAddress =
  "https://hcn2wtdvd6.execute-api.us-east-2.amazonaws.com/default/random";

function apiFetch(apiURL) {
  fetch(apiURL)
    .then((res) => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          apiData: result,
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      }
    );
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      sidePanel: false,
      apiData: [],
    };

    this.toggleSidePanel = this.toggleSidePanel.bind(this);
  }

  apiFetch(apiURL) {
    fetch(apiURL)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            weatherData: result,
            // or apiData
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  componentDidMount() {
    const weatherAPIURL =
      "http://api.openweathermap.org/data/2.5/weather?q=Glasgow,uk&APPID=e871a23f71fa0764cda7446f7888b2f7";
    const weatherData = apiFetch(weatherAPIURL);

    this.setState({ weatherData: weatherData });

    console.log(this.state.weatherData);
  }

  getID() {
    // Create a unique ID for each visualisation
    return "vis-id-" + uuidv4();
  }

  toggleSidePanel() {
    this.setState({ sidePanel: !this.state.sidePanel });
  }

  render() {
    let { error, isLoaded, apiData } = this.state;

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
              sites={createSites()}
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
                <LineChart divID={this.getID()} data={gas_data_a} />
              </GraphContainer>
              <GraphContainer>
                <LineChart divID={this.getID()} data={gas_data_b} />
              </GraphContainer>
              <GraphContainer>
                <LineChart divID={this.getID()} data={gas_data_c} />
              </GraphContainer>
            </VisLayout>
          </div>
        </div>
      );
    }
  }
}

export default Dashboard;
