import PropTypes from "prop-types";
import React from "react";
import SelectionBlock from "../SelectionBlock/SelectionBlock";

import styles from "./DataSelector.module.css";

class DataSelector extends React.Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;

    const site = target.attributes["site"].value;
    const sector = target.attributes["species"].value;

    const selectedSpecies = this.props.selectedSpecies;

    let oldSelected = this.props.selectedKeys;

    oldSelected[selectedSpecies][site][sector] = value;

    this.props.dataSelector(oldSelected);
  }

  render() {
    let blocks = [];

    const selectedKeys = this.props.selectedKeys;
    const selectedSites = this.props.selectedSites;
    const selectedSpecies = this.props.selectedSpecies;

    const speciesKeys = selectedKeys[selectedSpecies];

    for (const [site, siteDataKeys] of Object.entries(speciesKeys)) {
      if (!selectedSites.has(site)) {
        continue;
      }
      const siteName = String(site).toUpperCase();

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

    for (const site of Object.keys(selectedKeys)) {
      if (!selectedSites.has(site)) {
        continue;
      }
      const siteName = String(site).toUpperCase();
      const siteDataKeys = selectedKeys[site];

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
    if (this.props.selectedSites.size !== 0) {
      buttons = (
        <button className={styles.betterButton} onClick={this.props.clearSelectedSites}>
          Clear
        </button>
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
  clearSelectedSites: PropTypes.func.isRequired,
  dataSelector: PropTypes.func.isRequired,
  selectedKeys: PropTypes.object.isRequired,
  selectedSites: PropTypes.object.isRequired,
  selectedSpecies: PropTypes.string.isRequired,
};

export default DataSelector;
