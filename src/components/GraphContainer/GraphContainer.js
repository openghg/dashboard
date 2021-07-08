import PropTypes from "prop-types";
import React from "react";

class GraphContainer extends React.Component {
  constructor(props) {
    super(props);
    // Set the initial size of the plot
    this.state = { width: 1600, height: 300 };
    this.contRef = React.createRef();
  }

  updateDimensions() {
    const node = this.contRef.current;
    const dbcontent = document.getElementById("graphContent");
    const widthScale = this.props.widthScale ? this.props.widthScale : 1.0;
    const heightScale = this.props.heightScale ? this.props.heightScale : 1.0;

    if (node) {
      const height = heightScale * node.parentNode.clientHeight;
      const width = widthScale * dbcontent.clientWidth;
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

GraphContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GraphContainer;
