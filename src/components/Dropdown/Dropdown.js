import PropTypes from "prop-types";
import React from "react";

import styles from "./Dropdown.module.css";

class Dropdown extends React.Component {
  render() {
    const data = this.props.selectedKeys;
    let choices = [];

    for (const site of Object.keys(data).sort()) {
      const label = String(site).toUpperCase();
      const testID = "test-id-" + label;

      let selected = false;

      if (site === this.props.defaultSite) {
        selected = true;
      }

      const choice = (
        <option key={label} selected={selected} data-testid={testID} value={label}>
          {label}
        </option>
      );

      choices.push(choice);
    }

    return (
      <div className={styles.plotSelector}>
        Select site:
        <div>
          <form>
            <select data-testid="select-form" name="obs-select" onChange={this.props.onChange}>
              {choices}
            </select>
          </form>
        </div>
      </div>
    );
  }
}

Dropdown.propTypes = {
  handleDropdownChange: PropTypes.func,
  selectedKeys: PropTypes.object,
};

export default Dropdown;
