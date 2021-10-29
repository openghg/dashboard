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
    const divName = this.props.divName;
    const dbcontent = document.getElementById(divName);
    const widthScale = this.props.widthScale ? this.props.widthScale : 1.0;
    const heightScale = this.props.heightScale ? this.props.heightScale : 1.0;

    if (node && dbcontent) {
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
  widthScale: PropTypes.number,
  heightScale: PropTypes.number,
  divName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default GraphContainer;
