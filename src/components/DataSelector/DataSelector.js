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
    this.clearSelection = this.clearSelection.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;

    const site = target.attributes["site"].value;
    const species = target.attributes["species"].value;

    // Update the state to have the new
    const oldSelected = cloneDeep(this.state.selected);

    oldSelected[site][species] = value;

    this.setState({ selected: oldSelected });
  }

  callSelector() {
    this.props.dataSelector(this.state.selected);
  }

  clearSelection() {
    // Clear all
    const selected = this.state.selected;

    for (let [key, subdict] of Object.entries(selected)) {
      for (const subkey of Object.keys(subdict)) {
        selected[key][subkey] = false;
      }
    }

    this.props.dataSelector(selected);

    // Also need to clear all checkboxes
  }

  render() {
    let blocks = [];
    const dataKeys = this.state.selected;

    for (const site of Object.keys(dataKeys)) {
      const siteName = String(site).toUpperCase();
      const siteDataKeys = dataKeys[site];

      const block = (
        <SelectionBlock
          siteDataKeys={siteDataKeys}
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
        <div className={styles.buttons}>
          <button className={styles.betterButton} onClick={this.callSelector}>
            Plot
          </button>
          <button className={styles.betterButton} onClick={this.clearSelection}>
            Clear
          </button>
        </div>
      </div>
    );
  }
}

export default DataSelector;
