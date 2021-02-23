import { render, screen } from "@testing-library/react";
import React from "react";

import LineChart from "./LineChart";

const mockData = {
  TEST_SITE: { x_values: [1590969600000, 1591056000000], y_values: [0.2759910252, 0.4787901427] },
};

describe("Test LineChart", () => {
  test("Check correct chart rendered", () => {
    render(
      <LineChart
        divID={"testid123"}
        data={mockData}
        colours={["green"]}
        title={"testGraph"}
        xLabel="Date"
        yLabel="Concentration"
        key={"testkey"}
      />
    );

    expect(screen.getByTestId("linePlot")).toBeInTheDocument();
  });
});
