import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import ControlPanel from "./ControlPanel";

const testKeys = { AAA: { test_a: false, test_b: false, test_c: false } };

describe("Test ControlPanel", () => {
  test("Check correct text rendered", () => {
    const fn = jest.fn();

    render(<ControlPanel dataKeys={testKeys} dataSelector={fn} />);

    expect(screen.getByText("LondonGHG")).toBeInTheDocument();
    expect(screen.getByText("A new system for estimating London's emissions")).toBeInTheDocument();
    expect(screen.getByText("Select visualisation type:")).toBeInTheDocument();
  });

  test("Check ticking and clicking plot", () => {
    const fn = jest.fn();
    const sel_fn = jest.fn();

    render(<ControlPanel selectPlotType={sel_fn} plotType="timeseries" dataKeys={testKeys} dataSelector={fn} />);

    userEvent.selectOptions(screen.getByTestId("select-form"), ["timeseries"]);
    expect(screen.getByTestId("sel-footprint").selected).toBe(false);
    expect(screen.getByTestId("sel-timeseries").selected).toBe(true);

    expect(screen.getByText("Plot")).toBeInTheDocument()
    expect(screen.getByText("Clear")).toBeInTheDocument()

    const checkboxA = screen.getByTestId("AAA_test_a");
    const checkboxB = screen.getByTestId("AAA_test_b");
    const checkboxC = screen.getByTestId("AAA_test_c");

    expect(checkboxA).not.toBeChecked();
    expect(checkboxB).not.toBeChecked();
    expect(checkboxC).not.toBeChecked();

    userEvent.click(checkboxA);
    userEvent.click(checkboxB);
    userEvent.click(checkboxC);

    expect(checkboxA).toBeChecked();
    expect(checkboxB).toBeChecked();
    expect(checkboxC).toBeChecked();

    userEvent.click(screen.getByRole("button", { name: /plot/i }));

    expect(fn).toHaveBeenCalledTimes(1);
    expect(sel_fn).toHaveBeenCalledTimes(1);
  });

  test("Check footprint panel renders", () => {
    const fn = jest.fn();
    const sel_fn = jest.fn();

    render(<ControlPanel selectPlotType={sel_fn} plotType="footprint" dataKeys={testKeys} dataSelector={fn} />);

    expect(screen.getByText("Footprint")).toBeInTheDocument()

    userEvent.selectOptions(screen.getByTestId("select-form"), ["footprint"]);
    expect(screen.getByTestId("sel-footprint").selected).toBe(true);
    expect(screen.getByTestId("sel-timeseries").selected).toBe(false);
    
    expect(sel_fn).toHaveBeenCalledTimes(1);
  });


});
