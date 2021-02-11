import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import LineChart from "./LineChart";

const mockData = {
  TEST_SITE: {
    1590969600000: 0.2759910252,
    1591056000000: 0.4787901427,
    1591142400000: 0.2174108838,
    1591228800000: 0.4964628717,
    1591315200000: 0.4011362303,
    1591401600000: 0.3185649371,
    1591488000000: 0.3098276972,
    1591574400000: 0.386385681,
  },
};

describe("Test LineChart", () => {
  test("Check correct chart rendered", () => {
    const fn = jest.fn();

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
