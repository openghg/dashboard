import React from "react";
// import "./Checkbox.css";

class Checkbox extends React.Component {
  render() {
    return (
      <label>
        <span>{this.props.label}</span>
        <input
          name={this.props.name}
          site={this.props.site}
          species={this.props.species}
          type="checkbox"
          checked={this.props.checked}
          onChange={this.props.onChange}
          style={{ marginLeft: "0.5vw" }}
        />
      </label>
    );
  }
}

export default Checkbox;
