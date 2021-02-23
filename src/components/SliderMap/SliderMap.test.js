import { render, screen } from "@testing-library/react";
import React from "react";
import SliderMap from "./SliderMap";

import siteData from "../../mock/LGHGSitesRandomData.json";

describe("Test SliderMap", () => {
  test("Check map and slider renders correctly", () => {
    render(<SliderMap sites={siteData} centre={[51.5, -0.0482]} zoom={11} width={"75vw"} height={"65vh"} dates={[1614094251343, 1614094251346]} />);

    expect(screen.getByRole("link", { name: /openstreetmap/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /a js library for interactive maps/i })).toBeInTheDocument();
    expect(screen.getByRole("presentation")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Zoom in/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Zoom out/i })).toBeInTheDocument();
    expect(screen.getByRole("slider")).toBeInTheDocument();

  });
});
