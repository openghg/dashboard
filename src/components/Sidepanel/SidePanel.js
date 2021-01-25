import React from "react";
import { CSSTransition } from "react-transition-group";

import styles from "./SidePanel.css";

import SlideFromLeft from "./transitions/SlideFromLeft.css";

class SidePanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      position: "right",
      defaultSize: "40%",
      minSize: "300px",
      maxSize: null,
    };
  }

  render() {
    console.log(SlideFromLeft);

    let container = styles.leftContainer;
    let transition = SlideFromLeft;

    let style = { width: "15vw", height: "100vh", minSize: this.state.minSize };
    console.log(container, transition);

    return (
      <CSSTransition
        in={this.props.isOpen}
        timeout={200}
        classNames={transition}
        unmountOnExit
      >
        <div className={styles.container} style={style}>
          <li>This</li>
          <li>That</li>
          <li>Other</li>
        </div>
      </CSSTransition>
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
