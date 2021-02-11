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

    const checkboxA = screen.getByRole("checkbox", { name: /GAS_A/i });
    const checkboxB = screen.getByRole("checkbox", { name: /GAS_B/i });

    expect(checkboxA).not.toBeChecked();
    expect(checkboxB).not.toBeChecked();
  });

  test("Check tick triggers function", () => {
    const fn = jest.fn();

    render(<SelectionBlock siteDataKeys={mockData} siteName={"test site name"} onChange={fn} />);

    const checkboxA = screen.getByRole("checkbox", { name: /GAS_A/i });

    userEvent.click(checkboxA);

    expect(fn).toHaveBeenCalled();
  });
});
