import React from "react";
import styles from "./SelectionBlock.module.css";

import Checkbox from "../Checkbox/Checkbox";

class SelectionBlock extends React.Component {
  render() {
    const dataKeys = this.props.dataKeys;
    const siteName = this.props.siteName;


    let checkboxes = [];
    for (const species of Object.keys(dataKeys)) {
      const label = `${siteName}_${species}`;
      const speciesName = String(species).toUpperCase();

      const checkbox = (
        <Checkbox
          label={speciesName}
          name={label}
          site={siteName}
          species={species}
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
