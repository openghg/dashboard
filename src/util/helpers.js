import { nanoid } from "nanoid";

export function getVisID() {
  // Create a unique ID for each visualisation
  return "vis-id-" + nanoid();
}

export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// export function importSVGs() {
//   let footprints = {};
//   try {
//     const requiredSVGs = require.context("../images/londonFootprints/TMB", false, /\.svg$/);
//     const paths = requiredSVGs.keys();

//     // This is quite a bit of work but it means we can have human-readable filenames
//     // and pass a list of UNIX timestamps to the SliderMap component
//     for (const path of paths) {
//       // Here we need to read the filename and convert it to a UNIX timestamp
//       const filename = String(path).split("_")[1];
//       const timestampStr = String(filename).split(".")[0];

//       const timestamp = new Date(timestampStr).getTime();

//       footprints[timestamp] = requiredSVGs(path)["default"];
//     }
//   } catch (error) {
//     console.error("Could not import images. We expect image filenames of the form siteName-2021-01-01T00:00:00.svg");
//   }

//   return footprints;
// }

// export function importMockEmissions() {
//   let emissions = {};
//   try {
//     const requiredPNGs = require.context("../images/mockEmissions", false, /\.png$/);
//     const paths = requiredPNGs.keys();

//     // This is quite a bit of work but it means we can have human-readable filenames
//     // and pass a list of UNIX timestamps to the SliderMap component
//     for (const path of paths) {
//       // Here we need to read the filename and convert it to a UNIX timestamp
//       const filename = String(path).split("./")[1];
//       const timestampStr = String(filename).split(".")[0];
//       const timestamp = parseInt(timestampStr);

//       emissions[timestamp] = requiredPNGs(path)["default"];
//     }
//   } catch (error) {
//     console.error("Could not import images. We expect image filenames of the form 1610323200000.png");
//   }

//   return emissions;
// }

export function importSiteImages() {
  // For all three types /\.(png|jpe?g|svg)$/
  let siteInfo = {};

  try {
    const requiredJPGs = require.context("../images/siteImages", false, /\.jpe?g$/);
    const paths = requiredJPGs.keys();

    if (paths.length === 0) {
      throw new Error("No image files found");
    }

    for (const path of paths) {
      // Here we need to read the filename and convert it to a UNIX timestamp
      const filename = String(path).split("./")[1];
      const sansExtension = String(filename).split(".")[0].toUpperCase();

      if (sansExtension.length > 3) {
          console.error("We expect filenames to be three letter site codes");
          continue;
      }

      siteInfo[sansExtension] = requiredJPGs(path)["default"];
    }
  } catch (error) {
    console.error(`Could not import site images - ${error}`);
  }
  return siteInfo;
}

export function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}