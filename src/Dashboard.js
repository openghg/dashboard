import "./Dashboard.css";
import React from "react";
import { Layout } from "antd";
import random_data from "./random.json";
import { v4 as uuidv4 } from "uuid";
import { createSites } from "./mock/randomSites.js";

import "antd/dist/antd.css";

import LineChart from "./components/LineChart/lineChart";
import LeafletMap from "./components/LeafletMap/map";

const { Header, Footer, Sider, Content } = Layout;

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

      return (
        <div>
          <Layout style={{ height: "100vh" }}>
            <Sider style={{ background: "#eee" }}>
              <Content style={{ height: 200 }}>Some sweet text</Content>
              <Content style={{ height: 300 }}>Menu 1</Content>
            </Sider>
            <Layout>
              <Header style={{ background: "#fa8fab" }}>Header</Header>
              <Layout style={{overflowY: "scroll"}}>
              <Content style={{ height: "20vh" }}>
                <LineChart
                  data={gas_data_a}
                  width="1100"
                  height="250"
                  divID={getID()}
                />
              </Content>
              <Content style={{ height: "20vh" }}>
                <LineChart
                  data={gas_data_a}
                  width="1100"
                  height="250"
                  divID={getID()}
                />
              </Content>
              <Content style={{ height: "20vh" }}>
                <LineChart
                  data={gas_data_a}
                  width="1100"
                  height="250"
                  divID={getID()}
                />
              </Content>
              <Content style={{ height: "20vh" }}>
                <LineChart
                  data={gas_data_a}
                  width="1100"
                  height="250"
                  divID={getID()}
                />
              </Content>
              </Layout>
              <Footer>Footer</Footer>
            </Layout>
          </Layout>
        </div>
      );
    }
  }
}

export default Dashboard;
