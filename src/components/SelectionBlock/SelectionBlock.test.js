import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import SelectionBlock from "./SelectionBlock";

const mockData = {
  gas_a: false,
  gas_b: false,
};

describe("Test SelectionBlock", () => {
  test("Check block rendered correctly", () => {
    const fn = jest.fn();

    render(<SelectionBlock siteDataKeys={mockData} siteName={"test site name"} onChange={fn} />);

    expect(screen.getByText("test site name")).toBeInTheDocument();

    const checkboxA = screen.getByTestId("test site name_gas_a");
    const checkboxB = screen.getByTestId("test site name_gas_b");

    expect(checkboxA).not.toBeChecked();
    expect(checkboxB).not.toBeChecked();
  });

  test("Check tick triggers function", () => {
    const fn = jest.fn();

    render(<SelectionBlock siteDataKeys={mockData} siteName={"test site name"} onChange={fn} />);

    const checkboxA = screen.getByTestId("test site name_gas_a");

    userEvent.click(checkboxA);

    expect(fn).toHaveBeenCalled();
  });
});
