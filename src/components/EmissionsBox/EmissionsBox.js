import PropTypes from "prop-types";
import React from "react";

import TextButton from "../TextButton/TextButton";
import LeafletMap from "../LeafletMap/LeafletMap";

import styles from "./EmissionsBox.module.css";

import agriNatural_ch4 from "../../images/emissionsSVGs/ch4/ch4_ukghg_map_agriculture-and-natural_20190101T00.svg";
import combProd_ch4 from "../../images/emissionsSVGs/ch4/ch4_ukghg_map_combustion-and-production_20190101T00.svg";
import stacked_ch4 from "../../images/emissionsSVGs/ch4/ch4_ukghg_map_sectors_stacked.svg";
import waste_ch4 from "../../images/emissionsSVGs/ch4/ch4_ukghg_map_waste_20190101T00.svg";

import agriNatural_co2 from "../../images/emissionsSVGs/co2/co2_ukghg_map_agriculture-and-natural_20190101T00.svg";
import combProd_co2 from "../../images/emissionsSVGs/co2/co2_ukghg_map_combustion_20190101T00.svg";
import stacked_co2 from "../../images/emissionsSVGs/co2/co2_ukghg_map_sectors_stacked.svg";
import production_co2 from "../../images/emissionsSVGs/co2/co2_ukghg_map_production_20190101T00.svg";

class EmissionsBox extends React.Component {
  constructor(props) {
    super(props);

    const images = {
      CH4: {
        "Agri+Natural": agriNatural_ch4,
        "Comb+Production": combProd_ch4,
        Total: stacked_ch4,
        Waste: waste_ch4,
        colorbars: {
          "Agri+Natural": null,
          "Comb+Production": null,
          Total: null,
          Waste: null,
        },
      },
      CO2: {
        "Agri+Natural": agriNatural_co2,
        Combustion: combProd_co2,
        Total: stacked_co2,
        Production: production_co2,
        colorbars: {
          "Agri+Nature": null,
          Combustion: null,
          Total: null,
          Production: null,
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

    this.props.speciesSelector(species);
    this.setState({ selectedSpecies: species, selectedSector: "Total" });
  }

  render() {
    const selectedSector = this.state.selectedSector;
    const selectedSpecies = this.state.selectedSpecies;

    const selectedImages = this.state.images[selectedSpecies];

    let sectorButtons = [];
    const extraStyling = { fontSize: "2.3vh" };

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
        <TextButton
          key={key}
          styling={styling}
          onClickParam={key}
          extraStyling={extraStyling}
          onClick={this.setSpecies}
        >
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

    const emissionsHeader = "Emissions";
    const emissionsText = `Emissions from the National Atmospheric Emissions Inventory (NAEI).`;

    return (
      <div className={styles.container}>
        <div className={styles.header}>{emissionsHeader}</div>
        <div className={styles.body}>{emissionsText}</div>
        <div className={styles.plot}>
          <LeafletMap centre={[51.5, -0.0782]} zoom={10} overlayBounds={overlayBounds} overlayImg={emissionsImage} />
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
  speciesSelector: PropTypes.func.isRequired,
};

export default EmissionsBox;
