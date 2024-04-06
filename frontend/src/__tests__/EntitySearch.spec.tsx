import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store"; // or your preferred way to create a mock store
import EntitySearch from "../components/EntitySearch";
import "@testing-library/jest-dom";

jest.mock("../helpers/hooks/useQuery", () => ({
  __esModule: true, // This property tells Jest it's mocking an ES module
  default: jest.fn(() => ({ data: [], loading: false })),
}));

const mockStore = configureStore();
const store = mockStore({
  settings: {
    searchItems: [],
    keyList: [],
  },
});

describe("EntitySearch Component", () => {
  test("renders search input and responds to user input", async () => {
    render(
      <Provider store={store}>
        <ChakraProvider>
          <EntitySearch />
        </ChakraProvider>
      </Provider>
    );

    // Check if the search input is rendered
    const searchInput = screen.getByPlaceholderText("Search through features");
    expect(searchInput).toBeInTheDocument();

    // Simulate typing into the search input
    await userEvent.type(searchInput, "Test Query");

    // Assert that the input value changes as expected
    expect(searchInput).toHaveValue("Test Query");
  });

  // Add more tests as needed
});
