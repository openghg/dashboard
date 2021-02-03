import React from "react";
import styles from "./SelectionBlock.module.css";

import Checkbox from "../Checkbox/Checkbox";

class SelectionBlock extends React.Component {
  render() {
      // This just has the data for this specific site
    const siteDataKeys = this.props.siteDataKeys;
    const siteName = this.props.siteName;


    let checkboxes = [];
    for (const species of Object.keys(siteDataKeys)) {
      const label = `${siteName}_${species}`;
      const speciesName = String(species).toUpperCase();
      const checkedStatus = siteDataKeys[species];

      const checkbox = (
        <Checkbox
          label={speciesName}
          name={label}
          site={siteName}
          species={species}
          checked={checkedStatus}
          onChange={this.props.onChange}
          key={label}
        />
      );

      checkboxes.push(checkbox);
    }

    return (
      <div className={styles.container}>
        <div className={styles.header}>{this.props.siteName}</div>
        <div className={styles.checkboxes}>{checkboxes}</div>
      </div>
    );
  }
}

export default SelectionBlock;
