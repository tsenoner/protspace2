import { ColorModeScript } from "@chakra-ui/color-mode";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import ImprintComp from "../components/Imprint";
import "@testing-library/jest-dom";

const theme = extendTheme({});

const Providers = ({ children }: any) => {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      {children}
    </ChakraProvider>
  );
};

describe("ImprintComp", () => {
  it("renders without crashing", () => {
    render(<ImprintComp />, { wrapper: Providers });
    expect(screen.getByText(/Imprint/i)).toBeInTheDocument();
  });

  it("displays the correct background color for dark mode", () => {
    // Mocking useColorMode to return 'dark'
    jest.mock("@chakra-ui/system", () => ({
      ...jest.requireActual("@chakra-ui/system"),
      useColorMode: () => ({
        colorMode: "dark",
      }),
    }));
    render(<ImprintComp />, { wrapper: Providers });
    expect(
      screen.getByText(/Authorized Representative/i).parentNode
    ).toHaveStyle(`background: gray.800`);
  });

  it("contains all necessary contact information", () => {
    render(<ImprintComp />, { wrapper: Providers });
    expect(screen.getByText(/VAT ID:/i)).toBeInTheDocument();
    expect(screen.getByText(/DE811193231/i)).toBeInTheDocument();
    expect(screen.getByText(/Prof. Dr. Burkhard Rost/i)).toBeInTheDocument();
  });
});
