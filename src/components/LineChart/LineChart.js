import React from "react";
import "./LineChart.css";
import draw from "./d3LineChart.js";
import * as d3 from "d3";

function getDivWidth(divName) {
  const width = window.innerWidth; // d3.select(divName).node().getBoundingClientRect().width;
  const height = window.innerHeight; //d3.select(divName).node().getBoundingClientRect().height;

  return [width, height];
}

class LineChart extends React.Component {
  constructor(props) {
    super(props);
    // Find the initial width and height of the div we're going to
    // create the SVG inside and set those to state
    const [width, height] = getDivWidth(this.props.divID);
    this.state = { width: width, height: height };
  }

  componentDidMount() {
    draw(this.props, this.state.width, this.state.height);
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentDidUpdate() {
    console.log("Update wooo");
    draw(this.props, this.state.width, this.state.height);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  updateDimensions() {
    const [width, height] = getDivWidth(this.props.divID);

    this.setState({ width: width, height: height });
  }

  render() {
    return (
      <div>
        <div className={this.props.divID} />
      </div>
    );
  }
}

export default LineChart;
