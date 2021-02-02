import React from "react";
// import "./Checkbox.css";

class Checkbox extends React.Component {
  render() {
    return (
      <label>
        {this.props.label}
        <input
          name={this.props.name}
          site={this.props.site}
          species={this.props.species}
          type="checkbox"
          onChange={this.props.onChange}
        />
      </label>
    );
  }
}

export default Checkbox;
