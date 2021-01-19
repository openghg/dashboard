function getRandomLatitude(min, max) {
  const from = min ? min : -90;
  const to = max ? max : 90;
  const dec_places = 5;

  return randomRange(from, to, dec_places);
}

function getRandomLongitude(min, max) {
  const from = min ? min : -180;
  const to = max ? max : 180;
  const dec_places = 5;

  return randomRange(from, to, dec_places);
}

function randomRange(from, to, places) {
  // Returns a float
  return (Math.random() * (to - from) + from).toFixed(places) * 1;
}

function getSiteName() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 3);
}

export function createSites() {
  // Creates random sites at random lat/longs worldwide
  const n_sites = 10;
  let sites = {};

  // Western Europe
  const minLat = 35;
  const maxLat = 68;

  const minLong = -13;
  const maxLong = 38;

  for (let i = 0; i < n_sites; i++) {
    const location = {
      latitude: getRandomLatitude(minLat, maxLat),
      longitude: getRandomLongitude(minLong, maxLong),
    };

    let site_name = getSelection();

    while (site_name in sites) {
      site_name = getSiteName();
    }

    sites[site_name] = location;
  }

  return sites;
}
