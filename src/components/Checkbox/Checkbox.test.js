import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import Checkbox from "./Checkbox";

describe("Test Checkbox", () => {
  test("Check ticking calls function", () => {
    const fn = jest.fn();

    render(
      <Checkbox species="test_species" site="test_site" name="testbox" label="testbox" onChange={fn} />
    );

    const checkbox = screen.getByTestId("testbox");

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    userEvent.click(checkbox);

    expect(checkbox).toBeChecked();

    expect(fn).toHaveBeenCalled();
  });
});
