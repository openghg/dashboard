import React from "react";

class GraphContainer extends React.Component {
  constructor(props) {
    super(props);
    // Set the initial size of the plot
    this.state = { width: 1000, height: 250 };
    this.contRef = React.createRef();
  }

  updateDimensions() {
    const node = this.contRef.current;
    if (node) {
      const height = node.parentNode.clientHeight;
      const width = node.parentNode.clientWidth;
      this.setState({ height: height, width: width });
    }
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  render() {
    return (
      <div ref={this.contRef}>
        {React.cloneElement(this.props.children, {
          height: this.state.height,
          width: this.state.width,
        })}
      </div>
    );
  }
}

export default GraphContainer;
