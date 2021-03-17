import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import Dashboard from "./Dashboard";

jest.mock("./util/helpers", () => ({
  importSVGs: () => {
    return { "1609459200000": "siteName-2021-01-01T00:00:00.svg" };
  },
  isEmpty: () => false,
  getVisID: () => "123",
}));

describe("Test Dashboard", () => {
  test("Ensure sidebar rendered correctly", () => {
    render(<Dashboard />);

    expect(screen.getByText("A new system for estimating London's emissions")).toBeInTheDocument();
    expect(screen.getByText("Select visualisation type:")).toBeInTheDocument();
    expect(screen.getByText("Footprint Analysis")).toBeInTheDocument();
    expect(screen.getByTestId("select-form")).toBeInTheDocument()
    
  });

  test("Ensure select button selects", () => {
    render(<Dashboard />);

    expect(screen.getByText("Select visualisation type:")).toBeInTheDocument();
    expect(screen.getByTestId("select-form")).toBeInTheDocument()
    
    userEvent.selectOptions(screen.getByTestId("select-form"), ["footprint"]);
    expect(screen.getByTestId("sel-footprint").selected).toBe(true);
    expect(screen.getByTestId("sel-timeseries").selected).toBe(false);
    expect(screen.getByText("Footprint Analysis")).toBeInTheDocument();

    userEvent.selectOptions(screen.getByTestId("select-form"), ["timeseries"]);
    expect(screen.getByTestId("sel-footprint").selected).toBe(false);
    expect(screen.getByTestId("sel-timeseries").selected).toBe(true);
    
  });

  test("Ensure timeseries plotting panel rendered", () => {

    render(<Dashboard />);

    userEvent.selectOptions(screen.getByTestId("select-form"), ["timeseries"]);

    expect(screen.getByText("Sites")).toBeInTheDocument();

    expect(screen.getByTestId("TMB_CH4")).toBeInTheDocument();
    expect(screen.getByTestId("TMB_CO2")).toBeInTheDocument();

    expect(screen.getByTestId("NPL_CH4")).toBeInTheDocument();
    expect(screen.getByTestId("NPL_CO2")).toBeInTheDocument();

    expect(screen.getByTestId("BTT_CO2")).toBeInTheDocument();
    expect(screen.getByTestId("BTT_CH4")).toBeInTheDocument();
  });

  test("Check select and plot click draws new plot", () => {
    render(<Dashboard />);

    userEvent.selectOptions(screen.getByTestId("select-form"), ["timeseries"]);

    expect(screen.getByTestId("TMB_CH4")).toBeInTheDocument();

    expect(screen.queryByTestId("vis-unit-container-CH4-TMB")).toBeFalsy();

    expect(screen.getByRole("button", { name: /clear/i })).toBeTruthy();

    const checkbox = screen.getByTestId("TMB_CH4");

    expect(checkbox).not.toBeChecked();
    userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    userEvent.click(screen.getByRole("button", { name: /plot/i }));

    expect(screen.getByTestId(/vis-unit-container-CH4-TMB/)).toBeTruthy();
  });

  test("Check overview cards rendered", () => {
    render(<Dashboard />);

    expect(screen.getByText(/temperature/i)).toBeInTheDocument();
    expect(screen.getByText(/aqi/i)).toBeInTheDocument();
    expect(screen.getByText(/ppm/i)).toBeInTheDocument();
  });

  test("Ensure footprint analysis rendered", () => {

    render(<Dashboard />);

    userEvent.selectOptions(screen.getByTestId("select-form"), ["footprint"]);

    expect(screen.queryByText("Sites")).not.toBeInTheDocument();

    expect(screen.getByTestId("vis-unit-footprint-plot-CO2-fp-TMB")).toBeInTheDocument();
    expect(screen.getByTestId("vis-unit-footprint-plot-CH4-fp-TMB")).toBeInTheDocument();

    expect(screen.getByText("Footprint Analysis")).toBeInTheDocument()

  });

});
