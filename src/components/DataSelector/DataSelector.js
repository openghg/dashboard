import React from "react";
// import styles from "./ControlPanel.module.css";
import { cloneDeep } from "lodash";
import SelectionBlock from "../SelectionBlock/SelectionBlock";

import styles from "./DataSelector.module.css";

class DataSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = { selected: cloneDeep(this.props.dataKeys) };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.callSelector = this.callSelector.bind(this);
  }

  callSelector() {
    this.props.dataSelector(this.state.selected);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;

    const site = target.attributes["site"].value;
    const species = target.attributes["species"].value;

    // Update the state to have the new
    let oldSelected = cloneDeep(this.state.selected);

    oldSelected[site][species] = value;

    this.setState({ selected: oldSelected });
  }

  render() {
    let blocks = [];
    const dataKeys = this.props.dataKeys;

    for (const site of Object.keys(dataKeys)) {
      const siteName = String(site).toUpperCase();
      const siteData = dataKeys[site];

      const block = (
        <SelectionBlock
          dataKeys={siteData}
          siteName={siteName}
          onChange={this.handleInputChange}
          key={siteName}
        ></SelectionBlock>
      );

      blocks.push(block);
    }

    return (
      <div className={styles.container}>
        <div className={styles.blocks}>{blocks}</div>
        <div className={styles.plotButton}>
          <button onClick={this.callSelector}>Plot</button>
        </div>
      </div>
    );
  }
}

export default DataSelector;
