import PropTypes from "prop-types";
import React from "react";

class DynamicDimensions extends React.Component {
  constructor(props) {
    super(props);
    // Set the initial size of the plot
    this.state = { width: 300, height: 300 };
    this.contRef = React.createRef();
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  updateDimensions() {
    const dbcontent = document.getElementById(this.props.divID);
    const widthScale = this.props.widthScale ? this.props.widthScale : 1.0;
    const heightScale = this.props.heightScale ? this.props.heightScale : 1.0;

    const node = this.contRef.current;
    if (node) {
      const height = heightScale * node.parentNode.clientHeight;
      const width = widthScale * dbcontent.clientWidth;
      this.setState({ height: height, width: width });
    } else {
      console.error(`Cannot find dimensions of div with ID ${this.props.divID}`);
    }
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
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

DynamicDimensions.propTypes = {
  children: PropTypes.node.isRequired,
  divID: PropTypes.string.isRequired,
  heightScale: PropTypes.string,
  widthScale: PropTypes.string
}

export default DynamicDimensions;
