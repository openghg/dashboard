import { render, screen, fireEvent } from "@testing-library/react";
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

    userEvent.click(screen.getByRole("checkbox", { name: /i accept the terms and conditions/i }));

    // userEvent.click(
    //   screen.getByRole("button", {
    //     name: /plot/i,
    //   })
    // );

    const plotButton = screen.getByRole("button", { name: /plot/i });

    fireEvent.click(plotButton);

    // expect(screen.queryByTestId("vis-unit-container-GAS_A-AAA")).toBeTruthy();

    // expect(screen.getByTestId(/vis-unit-container-GAS_A-AAA/)).toBeTruthy();
    // Check the expected isn't there
    // vis-unit-container-GAS_A-AAA
    // Click the plot button
    // userEvent.click(screen.getByText("Plot"));

    screen.debug(null, 20000);

    // Click
  });
});
