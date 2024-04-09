import { fireEvent, render, screen } from "@testing-library/react";
import Tag from "../components/Tag";
import "@testing-library/jest-dom";
import { colorList } from "../helpers/constants";

describe("Tag Component", () => {
  const mockOnClick = jest.fn();
  const testText = "Test Tag";
  const testIndex = 2;

  beforeEach(() => {
    mockOnClick.mockClear();
    render(<Tag text={testText} onClick={mockOnClick} index={testIndex} />);
  });

  it("renders the tag text correctly", () => {
    expect(screen.getByText(testText)).toBeInTheDocument();
  });

  it("calls the onClick function when clicked", () => {
    const tag = screen.getByText(testText).parentNode; // Assuming the click event is attached to the parent div
    // @ts-expect-error
    fireEvent.click(tag);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("applies the correct background color based on the index", () => {
    const tag = screen.getByText(testText).parentNode;
    const expectedColor = colorList[testIndex % colorList.length];
    expect(tag).toHaveStyle(`background-color: ${expectedColor}`);
  });
});
