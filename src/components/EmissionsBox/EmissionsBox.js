import PropTypes from "prop-types";
import React from "react";

import TextButton from "../TextButton/TextButton";
import LeafletMap from "../LeafletMap/LeafletMap";

import styles from "./EmissionsBox.module.css";

import agriNatural_ch4 from "../../images/emissionsSVGs/ch4/ch4_ukghg_map_agriculture-and-natural_20190101T00.svg";
import combProd_ch4 from "../../images/emissionsSVGs/ch4/ch4_ukghg_map_combustion-and-production_20190101T00.svg";
import total_ch4 from "../../images/emissionsSVGs/ch4/ch4_ukghg_map_total_20190101T00.svg";
import waste_ch4 from "../../images/emissionsSVGs/ch4/ch4_ukghg_map_waste_20190101T00.svg";

import agriNatural_ch4_cbar from "../../images/emissionsSVGs/ch4/ch4_ukghg_map_agriculture-and-natural_20190101T00_colorbar.svg";
import combProd_ch4_cbar from "../../images/emissionsSVGs/ch4/ch4_ukghg_map_combustion-and-production_20190101T00_colorbar.svg";
import total_ch4_cbar from "../../images/emissionsSVGs/ch4/ch4_ukghg_map_total_20190101T00_colorbar.svg";
import waste_ch4_cbar from "../../images/emissionsSVGs/ch4/ch4_ukghg_map_waste_20190101T00_colorbar.svg";

import agriNatural_co2 from "../../images/emissionsSVGs/co2/co2_ukghg_map_agriculture-and-natural_20190101T00.svg";
import combProd_co2 from "../../images/emissionsSVGs/co2/co2_ukghg_map_combustion_20190101T00.svg";
import total_co2 from "../../images/emissionsSVGs/co2/co2_ukghg_map_total_20190101T00.svg";
import production_co2 from "../../images/emissionsSVGs/co2/co2_ukghg_map_production_20190101T00.svg";

import agriNatural_co2_cbar from "../../images/emissionsSVGs/co2/co2_ukghg_map_agriculture-and-natural_20190101T00_colorbar.svg";
import combustion_co2_cbar from "../../images/emissionsSVGs/co2/co2_ukghg_map_combustion_20190101T00_colorbar.svg";
import total_co2_cbar from "../../images/emissionsSVGs/co2/co2_ukghg_map_total_20190101T00_colorbar.svg";
import production_co2_cbar from "../../images/emissionsSVGs/co2/co2_ukghg_map_production_20190101T00_colorbar.svg";

class EmissionsBox extends React.Component {
  constructor(props) {
    super(props);

    const images = {
      CH4: {
        "Agri+Natural": agriNatural_ch4,
        "Comb+Production": combProd_ch4,
        Total: total_ch4,
        Waste: waste_ch4,
        colorbars: {
          "Agri+Natural": agriNatural_ch4_cbar,
          "Comb+Production": combProd_ch4_cbar,
          Total: total_ch4_cbar,
          Waste: waste_ch4_cbar,
        },
      },
      CO2: {
        "Agri+Natural": agriNatural_co2,
        Combustion: combProd_co2,
        Total: total_co2,
        Production: production_co2,
        colorbars: {
          "Agri+Nature": agriNatural_co2_cbar,
          Combustion: combustion_co2_cbar,
          Total: total_co2_cbar,
          Production: production_co2_cbar,
        },
      },
    };

    this.setImage = this.setImage.bind(this);
    this.setSpecies = this.setSpecies.bind(this);
    this.state = { images: images, selectedSector: "Total", selectedSpecies: "CO2" };
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

    this.setState({ selectedSpecies: species, selectedSector: "Total" });
  }

  render() {
    const selectedSector = this.state.selectedSector;
    const selectedSpecies = this.state.selectedSpecies;

    const selectedImages = this.state.images[selectedSpecies];

    let sectorButtons = [];
    const extraStyling = { "font-size": "2.3vh" };

    for (const key of Object.keys(selectedImages)) {
      if (key === "colorbars") continue;

      let styling = "dark";
      if (key === selectedSector) {
        styling = "selected";
      }

      const button = (
        <TextButton key={key} onClickParam={key} extraStyling={extraStyling} styling={styling} onClick={this.setImage}>
          {key}
        </TextButton>
      );

      sectorButtons.push(button);
    }

    let speciesButtons = [];
    for (const key of Object.keys(this.state.images)) {
      let styling = "dark";
      if (key === selectedSpecies) {
        styling = "speciesSelected";
      }
      const button = (
        <TextButton styling={styling} onClickParam={key} extraStyling={extraStyling} onClick={this.setSpecies}>
          {key}
        </TextButton>
      );

      speciesButtons.push(button);
    }

    const emissionsImage = this.state.images[this.state.selectedSpecies][this.state.selectedSector];

    // TODO - get the correct bounds for the box
    const overlayBounds = [
      [50.87063, -1.16],
      [52.0193672, 0.56799811],
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
          <div className={styles.speciesButtons}>{speciesButtons}</div>
          <div className={styles.sectorButtons}>{sectorButtons}</div>
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
