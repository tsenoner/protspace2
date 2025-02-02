// App.test.tsx
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "../App";

// Mock VisualizationComp since we're focusing on testing App component behavior
jest.mock("../components/VisualizationComp", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>Mocked Visualization Component</div>;
    },
  };
});

describe("App Component", () => {
  test("renders without crashing", () => {
    render(<App />);
    const visualizationCompElement = screen.getByText(
      /Mocked Visualization Component/i
    );
    expect(visualizationCompElement).toBeInTheDocument();
  });

  // Add more tests here as needed
});
