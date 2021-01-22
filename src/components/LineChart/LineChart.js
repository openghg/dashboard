import React from "react";
import "./LineChart.css";
import draw from "./d3LineChart.js";
import * as d3 from "d3";

class LineChart extends React.Component {
  constructor(props) {
    super(props);
    // Set the initial size of the plot
    this.state = { width: 1000, height: 250 };
    this.lineRef = React.createRef();
  }

  updateDimensions() {
    const node = this.lineRef.current;
    const height = node.parentNode.clientHeight;
    const width = node.parentNode.clientWidth;

    this.setState({ height: height, width: width });
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
    draw(this.props, this.state.width, this.state.height);
  }

  componentDidUpdate() {
    draw(this.props, this.state.width, this.state.height);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  render() {
    return (
      <div ref={this.lineRef}>
        <div className={this.props.divID} />
      </div>
    );
  }
}

export default LineChart;
