// src/components/GuidelineComp.test.tsx

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import GuidelineComp from "../components/Guideline";

// Mock the Nav component to avoid testing its implementation details
jest.mock("../components/Nav", () => () => <div>Navigation</div>);

describe("GuidelineComp", () => {
  it("renders guidelines content", () => {
    render(
      <BrowserRouter>
        <GuidelineComp />
      </BrowserRouter>
    );

    expect(screen.getByText("Guidelines")).toBeInTheDocument();
    expect(screen.getByText("Navigation")).toBeInTheDocument(); // Check for mocked Nav component's content
    expect(
      screen.getByText(
        "Welcome to the guidelines page. Here, you'll find the rules and guidelines for using this application."
      )
    ).toBeInTheDocument();
  });
});
