import "./Dashboard.css";
import React from "react";
import { Layout } from "antd";
import random_data from "./random.json"
import { v4 as uuidv4 } from "uuid";
import {createSites} from "./mock/randomSites.js"

import "antd/dist/antd.css";

import LineChart from "./components/LineChart/lineChart";
import LeafletMap from "./components/LeafletMap/map"

const { Sider, Content, Footer } = Layout;

function getID() {
  // Create a unique ID for each visualisation
  return "vis-id-" + uuidv4();
}

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

  render() {
    let { error, isLoaded, apiData } = this.state;

    console.log(createSites())

    isLoaded = true;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {

      const gas_data_a = random_data["gas_a"];
      const gas_data_b = random_data["gas_b"];
      const gas_data_c = random_data["gas_c"];

      return (
        <div>
          <Layout>
            <Content style={{ height: 300 }}>
              <LineChart
                data={gas_data_a}
                width="1100"
                height="250"
                divID={getID()}
              />
            </Content>
            <Content style={{ height: 300 }}>
              <LineChart
                data={gas_data_b}
                width="1100"
                height="250"
                divID={getID()}
              />
            </Content>
            <Content style={{ height: 300 }}>
              <LineChart
                data={gas_data_c}
                width="1100"
                height="250"
                divID={getID()}
              />
            </Content>
            <Content style={{ height: 300 }}>
              <LeafletMap sites={createSites()} divID={getID()} centre={[51.458377, -2.603017]} zoom={3}/>
            </Content>
          </Layout>
          
          {/* <Layout>
                <Footer style={{ height: 20 }}>
                  <div style={{ marginTop: -10 }}>
                    Source Code{" "}
                    <a href="https://github.com/openghg/dashboard">
                      https://github.com/openghg/dashboard
                    </a>
                    Author <a href="OpenGHG">OpenGHG</a>;
                  </div>
                </Footer>
              </Layout> */}
        </div>
      );
    }
  }
}

export default Dashboard;
