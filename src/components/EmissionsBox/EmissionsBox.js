import PropTypes from "prop-types";
import React from "react";

import TextButton from "../TextButton/TextButton";

import styles from "./EmissionsBox.module.css";
import agriNatural from "../../images/emissionsPNGs/ch4_ukghg_map_agriculture-and-natural.png";
import combProd from "../../images/emissionsPNGs/ch4_ukghg_map_combustion-and-production.png";
import total from "../../images/emissionsPNGs/ch4_ukghg_map_sectors_stacked.png";
import waste from "../../images/emissionsPNGs/ch4_ukghg_map_waste.png";

class EmissionsBox extends React.Component {
  constructor(props) {
    super(props);

    const images = { agri: agriNatural, combProd: combProd, total: total, waste: waste };

    this.setImage = this.setImage.bind(this);
    this.state = { images: images, selectedImage: "total" };
  }

  setImage(name) {
    if (!this.state.images.hasOwnProperty(name)) {
      console.error(`$(name) not in images`);
      return;
    }

    this.setState({ selectedImage: name });
  }

  render() {
    let styling = {};
    const selected = this.state.selectedImage;

    for (const key of Object.keys(this.state.images)) {
      if (key === selected) {
        styling[key] = "selected";
      } else {
        styling[key] = "dark";
      }
    }

    const extraStyling = { "font-size": "2.3vh" };
    const emissionsImage = this.state.images[this.state.selectedImage];

    return (
      <div className={styles.container}>
        <div className={styles.header}>{this.props.headerText}</div>
        <div className={styles.date}>Date: {new Date(this.props.selectedDate).toLocaleString()}</div>
        <div className={styles.body}>{this.props.bodyText}</div>
        <div className={styles.plot}>
          <img src={emissionsImage} alt={"Emissions graph"} />
        </div>
        <div className={styles.buttons}>
          <TextButton
            styling={styling["agri"]}
            extraStyling={extraStyling}
            onClick={() => {
              this.setImage("agri");
            }}
          >
            Argi + Natural
          </TextButton>
          <TextButton
            styling={styling["combProd"]}
            extraStyling={extraStyling}
            onClick={() => {
              this.setImage("combProd");
            }}
          >
            Combustion + Production
          </TextButton>
          <TextButton
            styling={styling["waste"]}
            extraStyling={extraStyling}
            onClick={() => {
              this.setImage("waste");
            }}
          >
            Waste
          </TextButton>
          <TextButton
            styling={styling["total"]}
            extraStyling={extraStyling}
            onClick={() => {
              this.setImage("total");
            }}
          >
            Total
          </TextButton>
        </div>
      </div>
    );
  }
}

EmissionsBox.propTypes = {
  altText: PropTypes.string,
  bodyText: PropTypes.string,
  headerText: PropTypes.string,
  imagePath: PropTypes.string,
  selectedDate: PropTypes.number,
};

export default EmissionsBox;
