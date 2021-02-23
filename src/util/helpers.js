import { nanoid } from "nanoid";

export function getVisID() {
  // Create a unique ID for each visualisation
  return "vis-id-" + nanoid();
}

export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export function importSVGs() {
  let footprints = {};
  // TODO - fix having this folderpath hardcoded
  try {
    const requiredSVGs = require.context("../images/londonFootprints/TMB", false, /\.svg$/);
    const paths = requiredSVGs.keys();

    // This is quite a bit of work but it means we can have human-readable filenames
    // and pass a list of UNIX timestamps to the SliderMap component
    for (const path of paths) {
      // Here we need to read the filename and convert it to a UNIX timestamp
      const filename = String(path).split("_")[1];
      const timestampStr = String(filename).split(".")[0];

      const timestamp = new Date(timestampStr).getTime();

      footprints[timestamp] = requiredSVGs(path)["default"];
    }
  } catch (error) {
    console.error("Could not import images. We expect image filenames of the form siteName-2021-01-01T00:00:00.svg");
  }

  return footprints;
}
