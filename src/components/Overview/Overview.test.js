import { render, screen } from "@testing-library/react";
import React from "react";

import Overview from "./Overview";

describe("Test Overview", () => {
  test("Check overview cards rendered correctly", () => {
    render(<Overview />);

    expect(screen.getByText(/temperature/i)).toBeInTheDocument();
    expect(screen.getByText(/ppm/i)).toBeInTheDocument();
    expect(screen.getByText(/AQI/i)).toBeInTheDocument();
    expect(screen.getByText(/409.8 ppm/i)).toBeInTheDocument();
  });
});
