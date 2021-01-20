import React from "react";
import "./Header.css";

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = { this: 1 };
  }

  render() {
    return (
      <div className="header">
        <div>{this.props.text}</div>
      </div>
    );
  }
}

export default Header;