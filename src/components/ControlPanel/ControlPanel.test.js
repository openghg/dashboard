import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import ControlPanel from "./ControlPanel";

describe("Test Dashboard", () => {
  test("Check ticking calls function", () => {
    const fn = jest.fn();

    const testKeys = { AAA: { test_a: false, test_b: false, test_c: false } };

    render(<ControlPanel dataKeys={testKeys} dataSelector={fn} />);

    const checkboxA = screen.getByRole("checkbox", { name: /test_a/i });
    const checkboxB = screen.getByRole("checkbox", { name: /test_b/i });
    const checkboxC = screen.getByRole("checkbox", { name: /test_c/i });

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
  });
});
