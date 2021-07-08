import PropTypes from "prop-types";
import React from "react";
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

    if (this.props.autoUpdate) {
      this.props.dataSelector(oldSelected);
    }
  }

  callSelector() {
    this.props.dataSelector(this.state.selected);
  }

  clearSelection() {
    const selected = this.state.selected;

    for (let [key, subdict] of Object.entries(selected)) {
      for (const subkey of Object.keys(subdict)) {
        selected[key][subkey] = false;
      }
    }

    this.props.dataSelector(selected);
  }

  render() {
    let blocks = [];

    let dataKeys = null;
    if (this.props.singleSite) {
      const selectedSite = this.props.selectedSite;
      dataKeys = {};
      dataKeys[selectedSite] = this.state.selected[selectedSite];
    } else {
      dataKeys = this.state.selected;
    }

    const selectedSites = this.props.selectedSites;

    for (const site of Object.keys(dataKeys)) {
      if (!selectedSites.has(site)) {
        continue;
      }
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

    let buttons = null;

    if (this.props.autoUpdate) {
      buttons = (
        <div>
          <button className={styles.betterButton} onClick={this.props.clearSelectedSites}>
            Clear
          </button>
        </div>
      );
    } else {
      buttons = (
        <div>
          <button className={styles.betterButton} onClick={this.callSelector}>
            Plot
          </button>
          <button className={styles.betterButton} onClick={this.clearSelection}>
            Clear
          </button>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <div className={styles.blocks}>{blocks}</div>
        <div className={styles.buttons}>{buttons}</div>
      </div>
    );
  }
}

DataSelector.propTypes = {
  dataKeys: PropTypes.object,
  dataSelector: PropTypes.func,
  autoUpdate: PropTypes.bool,
  singleSite: PropTypes.bool,
};

export default DataSelector;
