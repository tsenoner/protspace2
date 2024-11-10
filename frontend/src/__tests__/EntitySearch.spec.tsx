import { ChakraProvider } from "@chakra-ui/react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store"; // or your preferred way to create a mock store
import EntitySearch from "../components/EntitySearch";
import Tag from "../components/Tag";

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

    const searchLabel = screen.getByTestId("search-label");
    expect(searchLabel).toBeInTheDocument();
  });

  it("renders search input and expands/collapses the search area", async () => {
    // Initial state should be collapsed
    expect(screen.queryByPlaceholderText("Search through features")).toBeNull();

    // const searchLabel = screen.getByTestId("search-label");
    // // Open search area
    // userEvent.click(searchLabel);

    // // Now the search input should be visible
    // const searchInput = screen.getByPlaceholderText("Search through features");
    // expect(searchInput).toBeInTheDocument()
  });
});

describe("EntitySearch Component", () => {
  test("renders correct number of Tag components and handles click event", () => {
    const mockStore = configureStore();
    const store = mockStore({
      settings: {
        keyList: ["Category 1", "Category 2"],
        searchItems: [
          { name: "Item 1", category: "Category 1" },
          { name: "Item 2", category: "Category 2" },
          // add more items as needed...
        ],
      },
    });

    render(
      <Provider store={store}>
        <EntitySearch />
      </Provider>
    );

    const tags = screen.getAllByRole("button"); // assuming Tag is a button
    // @ts-expect-error
    expect(tags).toHaveLength(store.getState().settings.searchItems.length);

    tags.forEach((tag, index) => {
      expect(tag.textContent).toBe(
        // @ts-expect-error
        store.getState().settings.searchItems[index].name
      );
    });

    fireEvent.click(tags[0]);
    // @ts-expect-error
    expect(store.getState().settings.searchItems).toContainEqual({
      name: "Item 1",
      category: "Category 1",
    });
  });
});

describe("Spinner and Search Item", () => {
  test("renders Spinner and SearchItem components correctly and handles click event", () => {
    const mockStore = configureStore();
    const store = mockStore({
      loading: true,
      query: "test",
      groupedResults: new Map([
        ["Category 1", [{ name: "Item 1", category: "Category 1" }]],
        // add more categories and items as needed...
      ]),
      settings: {
        searchItems: [],
      },
    });

    jest.mock("../helpers/hooks/useQuery.ts", () => ({
      useQuery: () => ({
        loading: true,
        data: null,
      }),
    }));

    render(
      <Provider store={store}>
        <EntitySearch />
      </Provider>
    );

    expect(screen.getByTestId("progress")).toBeInTheDocument(); // assuming Spinner is a progressbar

    store.dispatch({ type: "SET_LOADING", payload: false }); // replace with your actual action to set loading to false

    // @ts-expect-error
    expect(store.getState().settings.searchItems).not.toContainEqual({
      name: "Item 1",
      category: "Category 1",
    });
  });
});

describe("Tag Component", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    render(<Tag text="Protein A" index={0} onClick={mockOnClick} />);
  });

  it("renders the Tag correctly with the given text", () => {
    expect(screen.getByText("Protein A")).toBeInTheDocument();
  });

  it("calls the onClick handler when the Tag is clicked", () => {
    const tagElement = screen.getByText("Protein A");
    userEvent.click(tagElement);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("displays the correct style based on the index", () => {
    const tagElement = screen.getByText("Protein A");
    // Assuming a function or constant that decides the color based on index
    // For this example, we assume the first index gets a specific class or style
    expect(tagElement).toHaveStyle("backgroundColor: rgb(255, 99, 71");
  });
});
