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

    const sector = target.attributes["species"].value;

    const selectedSpecies = this.props.selectedSpecies;
    const selectedSites = this.props.selectedSites;

    let oldSelected = this.props.selectedKeys;

    for (const site of selectedSites) {
      oldSelected[selectedSpecies][site][sector] = value;
    }

    this.props.dataSelector(oldSelected);
  }

  render() {
    const selectedKeys = this.props.selectedKeys;
    const selectedSites = this.props.selectedSites;
    const selectedSpecies = this.props.selectedSpecies;

    // Only create the buttons and selection blocks if we have a site selected
    let blocks = null;
    let buttons = null;

    if (this.props.selectedSites.size !== 0) {
      let iter = selectedSites.values();
      const aSite = iter.next().value;
      const siteDataKeys = selectedKeys[selectedSpecies][aSite];
      blocks = <SelectionBlock siteDataKeys={siteDataKeys} siteName={"Select"} onChange={this.handleInputChange} />;
      
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
  selectedSpecies: PropTypes.string.isRequired
};

export default DataSelector;
