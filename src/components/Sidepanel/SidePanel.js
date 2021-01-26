import React from "react";
import { CSSTransition } from "react-transition-group";
import "./SidePanel.css";

class SidePanel extends React.Component {
  render() {
    return (
      <div>
        <CSSTransition
          in={this.props.isOpen}
          timeout={300}
          classNames={"panel-transition"}
          unmountOnExit
        >
          <div className="panel-container">
            <div className="panel-header">
              <div onClick={this.props.togglePanel} class="panel-nav-icon">
                <div></div>
              </div>
            </div>
            <div className="panel-links">
              <li className="panel-list-item">
                <button className="panel-button">About</button>
              </li>
              <li className="panel-list-item">
                <button className="panel-button">Data</button>
              </li>
              <li className="panel-list-item">
                <button
                  onClick={() => {window.open('https://github.com/openghg/dashboard', "_blank")}}
                  className="panel-button"
                >
                  Source
                </button>
              </li>
              <li className="panel-list-item">
                <button
                  onClick={this.props.togglePanel}
                  className="panel-button"
                >
                  Close
                </button>
              </li>
            </div>
          </div>
        </CSSTransition>
      </div>
    );
  }
}

// SidePanel.propTypes = {
//   children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
//   isOpen: PropTypes.bool,
//   maxSize: PropTypes.string,
//   minSize: PropTypes.string,
//   position: PropTypes.string,
//   width: PropTypes.string,
//   height: PropTypes.string,
// };

export default SidePanel;
