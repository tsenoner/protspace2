import { render, screen } from "@testing-library/react";
import Nav from "../components/Nav";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@testing-library/jest-dom";

// Simple mock for useColorMode
jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useColorMode: jest.fn(),
}));

describe("Nav", () => {
  const theme = extendTheme();

  it("renders correctly with light mode", () => {
    require("@chakra-ui/react").useColorMode.mockImplementation(() => ({
      colorMode: "light",
    }));

    render(
      <ChakraProvider theme={theme}>
        <Nav />
      </ChakraProvider>
    );

    expect(screen.getByText("ProtSpace")).toBeInTheDocument();
    // Additional checks can be added here, such as verifying the color or presence of links
  });

  it("renders correctly with dark mode", () => {
    require("@chakra-ui/react").useColorMode.mockImplementation(() => ({
      colorMode: "dark",
    }));

    render(
      <ChakraProvider theme={theme}>
        <Nav />
      </ChakraProvider>
    );

    expect(screen.getByText("ProtSpace")).toBeInTheDocument();
    // Add checks for dark mode specifics here
  });
});
