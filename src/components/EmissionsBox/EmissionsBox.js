import PropTypes from "prop-types";
import React from "react";

import TextButton from "../TextButton/TextButton";
import LeafletMap from "../LeafletMap/LeafletMap";

import styles from "./EmissionsBox.module.css";

import comb_ch4 from "../../images/emissionsPNGs/ch4/uk_raw/ch4_ukghg_map_combustion_20170101T00.png";
import prod_ch4 from "../../images/emissionsPNGs/ch4/uk_raw/ch4_ukghg_map_production_20170101T00.png";
import waste_ch4 from "../../images/emissionsPNGs/ch4/uk_raw/ch4_ukghg_map_waste_20170101T00.png";
import stacked_ch4 from "../../images/emissionsPNGs/ch4/uk_raw/ch4_ukghg_map_sectors_stacked_20170101T00.png";

import natural_co2 from "../../images/emissionsPNGs/co2/uk_raw/co2_ukghg_map_natural_20170101T00.png";
import comb_co2 from "../../images/emissionsPNGs/co2/uk_raw/co2_ukghg_map_combustion_20170101T00.png";
import production_co2 from "../../images/emissionsPNGs/co2/uk_raw/co2_ukghg_map_production_20170101T00.png";
import stacked_co2 from "../../images/emissionsPNGs/co2/uk_raw/co2_ukghg_map_sectors_stacked_20170101T00.png";

class EmissionsBox extends React.Component {
  constructor(props) {
    super(props);

    const images = {
      CH4: {
        Waste: waste_ch4,
        Combustion: comb_ch4,
        Power: prod_ch4,
        Total: stacked_ch4,
        colorbars: {
          Waste: null,
          Combustion: null,
          Power: null,
          Total: null,
        },
      },
      CO2: {
        Natural: natural_co2,
        Combustion: comb_co2,
        Power: production_co2,
        Total: stacked_co2,
        colorbars: {
          Natural: null,
          Combustion: null,
          Power: null,
          Total: null,
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
    // TODO - check this, using innerText could be fragile.
    const species = e.target.innerText; //.dataset.onclickparam;
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
    const extraStyling = { fontSize: "1.5em" };

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

      let label = "NA";
      if (key === "CO2") {
        label = (
          <text onClickParam={key}>
            CO<sub>2</sub>
          </text>
        );
      } else if (key === "CH4") {
        label = (
          <text onClickParam={key}>
            CH<sub>4</sub>
          </text>
        );
      } else {
        console.error("Invalid species.");
      }

      const button = (
        <TextButton
          key={key}
          styling={styling}
          onClickParam={key}
          extraStyling={extraStyling}
          onClick={this.setSpecies}
        >
          {label}
        </TextButton>
      );

      speciesButtons.push(button);
    }

    const emissionsImage = this.state.images[this.state.selectedSpecies][this.state.selectedSector];

    // TODO - get the correct bounds for the box
    const overlayBounds = [
      [49.2109147409668, -10.562146891479602],
      [61.908634740966804, 4.908553108520451],
    ];

    const midpointLat = overlayBounds[0][0] + (overlayBounds[1][0] - overlayBounds[0][0]) / 2
    const midpointLon = overlayBounds[0][1] + (overlayBounds[1][1] - overlayBounds[0][1]) / 2
    const overlayMidpoint = [midpointLat, midpointLon]
    const mapstyle = `proton`

    // const emissionsText = `Emission locations from the National Atmospheric Emissions Inventory (NAEI). Maps generated using ukghg model.`;

    return (
      <div className={styles.container}>
        <div className={styles.caption}>
            Emission locations from the&nbsp;
            <a
              href="https://naei.beis.gov.uk/about/"
              target="_blank"
              rel="noopener noreferrer"
            >
            National Atmospheric Emissions Inventory (NAEI)
            </a>
          . Maps generated using&nbsp;
          <a
              href="https://github.com/NERC-CEH/ukghg"
              target="_blank"
              rel="noopener noreferrer"
            >          
            ukghg model</a>
          .
        </div>
        <div className={styles.plot}>
          <LeafletMap centre={overlayMidpoint} zoom={5} overlayBounds={overlayBounds} overlayImg={emissionsImage} mapstyle={mapstyle}/>
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
