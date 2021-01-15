import "./Dashboard.css";
import React from "react";
import { Layout } from "antd";
import data from "./data";
import { v4 as uuidv4 } from "uuid";
import "antd/dist/antd.css";

import LineChart from "./components/LineChart/lineChart";

const { Sider, Content, Footer } = Layout;

function getID() {
  // Create a unique ID for each visualisation
  return "vis-id-" + uuidv4();
}

const apiAddress = "https://hcn2wtdvd6.execute-api.us-east-2.amazonaws.com/default/random"

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = { something: "useful" };
  }

  retrieveAPIData() {
    return fetch(apiAddress)
      .then((response) => response.json())
      .then((json) => {
        return json;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentDidMount() {
    this.retrieveAPIData().then((result) => this.setState({ apiData: result }));
  }

  render() {
    console.log(this.state.apiData);
    return (
      <div>
        <Layout>
          <Content style={{ height: 300 }}>
            <LineChart
              data={data[0]}
              width="1100"
              height="250"
              divID={getID()}
            />
          </Content>
          <Content style={{ height: 300 }}>
            <LineChart
              data={data[1]}
              width="1100"
              height="250"
              divID={getID()}
            />
          </Content>
          <Content style={{ height: 300 }}>
            <LineChart
              data={data[2]}
              width="1100"
              height="250"
              divID={getID()}
            />
          </Content>
        </Layout>
        <Layout>
          <Footer style={{ height: 20 }}>
            <div style={{ marginTop: -10 }}>
              Source Code{" "}
              <a href="https://github.com/openghg/dashboard">
                https://github.com/openghg/dashboard
              </a>
              Author <a href="OpenGHG">OpenGHG</a>;
            </div>
          </Footer>
        </Layout>
      </div>
    );
  }
}

export default Dashboard;
