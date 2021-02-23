import { nanoid } from "nanoid";

export function getVisID() {
  // Create a unique ID for each visualisation
  return "vis-id-" + nanoid();
}

export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

