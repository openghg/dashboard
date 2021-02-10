import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import Checkbox from "./Checkbox";

describe("Test Dashboard", () => {
  test("Check ticking calls function", () => {
    const fn = jest.fn();

    render(<Checkbox name="testbox" label="testbox" onChange={fn} />);

    const checkbox = screen.getByRole("checkbox", { name: /testbox/i });

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    userEvent.click(checkbox);

    expect(checkbox).toBeChecked();

    expect(fn).toHaveBeenCalled();
  });
});
