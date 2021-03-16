import React from "react";
import styles from "./Checkbox.module.css";

class Checkbox extends React.Component {
  render() {
    return (
      <div className={styles.main}>
        <div className={styles.label}>
            {this.props.label}
        </div>
        <div className={styles.box}>
          <input
            name={this.props.name}
            data-testid={this.props.name}
            site={this.props.site}
            species={this.props.species}
            type="checkbox"
            checked={this.props.checked}
            onChange={this.props.onChange}
            style={{ marginLeft: "0.5vw" }}
          />
        </div>
      </div>
    );
  }
}

export default Checkbox;
