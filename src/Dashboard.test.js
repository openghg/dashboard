import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import Dashboard from "./Dashboard";

describe("Test Dashboard", () => {
  test("Ensure sidebar rendered correctly", () => {
    render(<Dashboard />);

    expect(screen.getByText("A new system for estimating London's emissions")).toBeInTheDocument();

    expect(screen.getByText("Sites")).toBeInTheDocument();

    expect(screen.getByTestId("AAA_gas_a")).toBeInTheDocument();
    expect(screen.getByTestId("AAA_gas_b")).toBeInTheDocument();
    expect(screen.getByTestId("AAA_gas_c")).toBeInTheDocument();

    expect(screen.getByTestId("BBB_gas_a")).toBeInTheDocument();
    expect(screen.getByTestId("BBB_gas_b")).toBeInTheDocument();
    expect(screen.getByTestId("BBB_gas_c")).toBeInTheDocument();

    expect(screen.getByTestId("CCC_gas_a")).toBeInTheDocument();
    expect(screen.getByTestId("CCC_gas_b")).toBeInTheDocument();
    expect(screen.getByTestId("CCC_gas_c")).toBeInTheDocument();
  });

  test("Check select and plot click draws new plot", () => {
    render(<Dashboard />);

    expect(screen.getByTestId("AAA_gas_a")).toBeInTheDocument();

    expect(screen.queryByTestId("vis-unit-container-GAS_A-AAA")).toBeFalsy();

    expect(screen.getByRole("button", { name: /clear/i })).toBeTruthy();

    const checkbox = screen.getByTestId("AAA_gas_a");

    expect(checkbox).not.toBeChecked();
    userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    userEvent.click(screen.getByRole("button", { name: /plot/i }));

    expect(screen.getByTestId(/vis-unit-container-GAS_A-AAA/)).toBeTruthy();
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
