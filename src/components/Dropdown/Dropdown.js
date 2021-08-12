import PropTypes from "prop-types";
import React from "react";

import styles from "./Dropdown.module.css";

class Dropdown extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }
  onChange(event) {
    const species = event.target.value;
    this.props.onChange(species);
  }
  render() {
    const data = this.props.selectedKeys;
    let choices = [];

    for (const key of Object.keys(data).sort()) {
      const label = String(key).toUpperCase();
      const testID = "test-id-" + label;

      const choice = (
        <option key={label} data-testid={testID} value={label}>
          {label}
        </option>
      );

      choices.push(choice);
    }

    return (
      <div className={styles.plotSelector}>
        Select:
        <div>
          <form>
            <select
              data-testid="select-form"
              defaultValue={this.props.defaultValue}
              name="obs-select"
              onChange={this.onChange}
            >
              {choices}
            </select>
          </form>
        </div>
      </div>
    );
  }
}

Dropdown.propTypes = {
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  selectedKeys: PropTypes.object,
};

export default Dropdown;
