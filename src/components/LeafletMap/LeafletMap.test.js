import { render } from "@testing-library/react";
import React from "react";

import LeafletMap from "./LeafletMap";
import siteData from "../../data/siteMetadata.json";

describe("Test LineChart", () => {
  test("Check correct chart rendered", () => {
    const { asFragment}  = render(
      <LeafletMap sites={{ TMB: siteData["TMB"] }} centre={[51.5, -0.0482]} zoom={10} width={"75vw"} height={"65vh"} />
    );

    expect(asFragment()).toMatchSnapshot()

  });
});
