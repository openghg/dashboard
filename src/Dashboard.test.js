import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import Dashboard from "./Dashboard";

describe("Test Dashboard", () => {
  test("Ensure sidebar rendered correctly", () => {
    render(<Dashboard />);

    expect(screen.getByText("A new system for estimating London's emissions")).toBeInTheDocument();

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

  test("Check summary rendered", () => {
    render(<Dashboard />);

    expect(
      screen.getByText(/To tackle climate change, we need to measure and reduce carbon emissions/i)
    ).toBeInTheDocument();
  });
});
