import PropTypes from "prop-types";
import React from "react";

import TextButton from "../TextButton/TextButton";
import LeafletMap from "../LeafletMap/LeafletMap";

import styles from "./EmissionsBox.module.css";

import agriNatural_ch4 from "../../images/emissionsSVGs/ch4/ch4_ukghg_map_agriculture-and-natural.svg";
import combProd_ch4 from "../../images/emissionsSVGs/ch4/ch4_ukghg_map_combustion-and-production.svg";
import total_ch4 from "../../images/emissionsSVGs/ch4/ch4_ukghg_map_total.svg";
import waste_ch4 from "../../images/emissionsSVGs/ch4/ch4_ukghg_map_waste.svg";

import agriNatural_ch4_cbar from "../../images/emissionsSVGs/ch4/ch4_ukghg_map_agriculture-and-natural_colorbar.svg";
import combProd_ch4_cbar from "../../images/emissionsSVGs/ch4/ch4_ukghg_map_combustion-and-production_colorbar.svg";
import total_ch4_cbar from "../../images/emissionsSVGs/ch4/ch4_ukghg_map_total_colorbar.svg";
import waste_ch4_cbar from "../../images/emissionsSVGs/ch4/ch4_ukghg_map_waste_colorbar.svg";

class EmissionsBox extends React.Component {
  constructor(props) {
    super(props);

    const images = {
      ch4: {
        agri: agriNatural_ch4,
        combProd: combProd_ch4,
        total: total_ch4,
        waste: waste_ch4,
        colorbars: {
          agri: agriNatural_ch4_cbar,
          combProd: combProd_ch4_cbar,
          total: total_ch4_cbar,
          waste: waste_ch4_cbar,
        },
      },
      co2: {},
    };

    this.setImage = this.setImage.bind(this);
    this.setSpecies = this.setSpecies.bind(this);
    this.state = { images: images, selectedSector: "total", selectedSpecies: "ch4" };
  }

  setImage(e) {
    const name = e.target.dataset.onclickparam;
    const species = this.state.selectedSpecies;
    if (!this.state.images[species].hasOwnProperty(name)) {
      console.error(`$(name) not in images`);
      return;
    }

    this.setState({ selectedSector: name });
  }

  setSpecies(e) {
    const species = e.target.dataset.onclickparam;
    if (!this.state.images.hasOwnProperty(species)) {
      console.error(`$(name) not in images`);
      return;
    }

    this.setState({ selectedSpecies: species });
  }

  render() {
    let sectorStyling = {};
    let speciesStyling = {};

    const selectedSector = this.state.selectedSector;
    const selectedSpecies = this.state.selectedSpecies;

    const selectedImages = this.state.images[selectedSpecies];

    for (const key of Object.keys(selectedImages)) {
      if (key === selectedSector) {
        sectorStyling[key] = "selected";
      } else {
        sectorStyling[key] = "dark";
      }
    }

    for (const key of Object.keys(this.state.images)) {
      if (key === selectedSpecies) {
        speciesStyling[key] = "selected";
      } else {
        speciesStyling[key] = "dark";
      }
    }

    const extraStyling = { "font-size": "2.3vh" };
    const emissionsImage = this.state.images[this.state.selectedSpecies][this.state.selectedSector];

    const overlayBounds = [
      [50.87063, -1.26],
      [52.0193672, 0.46799811],
    ];

    return (
      <div className={styles.container}>
        <div className={styles.header}>{this.props.headerText}</div>
        <div className={styles.date}>Date: {new Date(this.props.selectedDate).toLocaleString()}</div>
        <div className={styles.body}>{this.props.bodyText}</div>
        <div className={styles.plot}>
          <LeafletMap
            centre={[51.5, -0.0482]}
            zoom={9}
            width={"30vw"}
            overlayBounds={overlayBounds}
            overlayImg={emissionsImage}
          />
        </div>
        <div className={styles.buttons}>
          <div className={styles.speciesButtons}>
          <TextButton
              styling={speciesStyling["ch4"]}
              onClickParam={"ch4"}
              extraStyling={extraStyling}
              onClick={this.setSpecies}
            >
              CH4
            </TextButton>
            <TextButton
              styling={speciesStyling["co2"]}
              onClickParam={"co2"}
              extraStyling={extraStyling}
              onClick={this.setSpecies}
            >
              CO2
            </TextButton>
          </div>
          <div className={styles.sectorButtons}>
            
            <TextButton
              onClickParam={"agri"}
              extraStyling={extraStyling}
              styling={sectorStyling["agri"]}
              onClick={this.setImage}
            >
              Agri + Natural
            </TextButton>
            <TextButton
              onClickParam={"combProd"}
              styling={sectorStyling["combProd"]}
              extraStyling={extraStyling}
              onClick={this.setImage}
            >
              Combustion + Production
            </TextButton>
            <TextButton
              onClickParam={"waste"}
              styling={sectorStyling["waste"]}
              extraStyling={extraStyling}
              onClick={this.setImage}
            >
              Waste
            </TextButton>
            <TextButton
              onClickParam={"total"}
              styling={sectorStyling["total"]}
              extraStyling={extraStyling}
              onClick={this.setImage}
            >
              Total
            </TextButton>
          </div>
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
