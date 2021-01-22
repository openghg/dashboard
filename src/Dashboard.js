import "./Dashboard.css";
import React from "react";
import random_data from "./random.json";
import { v4 as uuidv4 } from "uuid";
import { createSites } from "./mock/randomSites.js";

import LineChart from "./components/LineChart/LineChart";
import LeafletMap from "./components/LeafletMap/Map";

import Header from "./components/Header/Header";
import Summary from "./components/Summary/Summary";
import Overview from "./components/Overview/Overview";
import VisLayout from "./components/VisLayout/VisLayout";

const apiAddress =
  "https://hcn2wtdvd6.execute-api.us-east-2.amazonaws.com/default/random";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = { error: null, isLoaded: false, apiData: [] };
  }

  componentDidMount() {
    // fetch(apiAddress)
    //   .then((res) => res.json())
    //   .then(
    //     (result) => {
    //       this.setState({
    //         isLoaded: true,
    //         apiData: result,
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

  render() {
    let { error, isLoaded, apiData } = this.state;

    console.log(createSites());

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
          <div className="header">OpenGHG Dashboard</div>
          <div className="main">
            <Summary>
              <div>
                Glasgow is the third most populous city in the United Kingdom,
                with an estimated city population of 612,040 in 2016.
                Historically, but now no longer, part of Lanarkshire, the city
                now forms the Glasgow City council area, one of the 32 council
                areas of Scotland; the local authority is Glasgow City Council.
                Glasgow is situated on the River Clyde in the country's West
                Central Lowlands.
              </div>
            </Summary>

            <Overview />

            <VisLayout>
              <LineChart
                divID={this.getID()}
                data={gas_data_a}
              />
              <LineChart
                divID={this.getID()}
                data={gas_data_b}
              />
              <LineChart
                divID={this.getID()}
                data={gas_data_c}
              />
            </VisLayout>
          </div>
        </div>
      );
    }
  }
}

export default Dashboard;
