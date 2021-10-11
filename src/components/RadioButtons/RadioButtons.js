import PropTypes from "prop-types";
import React from "react";
import styles from "./RadioButtons.module.css";

class RadioButtons extends React.Component {
  constructor() {
    super();

    this.onChangeValue = this.onChangeValue.bind(this);
  }

  onChangeValue(event) {
    this.props.onChange(event.target.value);
  }

  render() {
    const options = this.props.options;

    let buttons = [];
    for (const option of Object.keys(options)) {
      const checked = option === this.props.selected;

      const optionUpper = option.toUpperCase();

      let label = "NA";
      if (optionUpper === "CO2") {
        label = (
          <b>
            CO<sub>2</sub>
          </b>
        );
      } else if (optionUpper === "CH4") {
        label = (
          <b>
            CH<sub>4</sub>
          </b>
        );
      } else {
        label = <b>{optionUpper}</b>;
      }

      const button = (
        <label key={option}>
          {label}
          <input type="radio" value={option} checked={checked} onChange={this.handleChange} />
        </label>
      );

      buttons.push(button);
    }

    return (
      <div className={styles.buttons} onChange={this.onChangeValue}>
        {buttons}
      </div>
    );
  }
}

RadioButtons.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  selected: PropTypes.string.isRequired,
};

export default RadioButtons;
