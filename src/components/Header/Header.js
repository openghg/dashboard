import React from "react";
import "./Header.css";

class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <div>{this.props.text}</div>
      </div>
    );
  }
}

export default Header;
