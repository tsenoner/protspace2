import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import EntitySearch from './EntitySearch';
import Tag from '../tag/Tag';

jest.mock('../../helpers/hooks/useQuery', () => ({
  __esModule: true,
  default: jest.fn(() => ({ data: [], loading: false }))
}));

const createMockStore = (initialState: any) => {
  return configureStore({
    reducer: (state = initialState) => state,
    preloadedState: initialState
  });
};

describe('EntitySearch Component', () => {
  test('renders search input and responds to user input', async () => {
    const store = createMockStore({
      settings: {
        searchItems: [],
        keyList: []
      }
    });

    render(
      <Provider store={store}>
        <ChakraProvider>
          <EntitySearch />
        </ChakraProvider>
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText('Search by name or ID');
    expect(searchInput).toBeInTheDocument();

    await userEvent.type(searchInput, 'Test Query');
    expect(searchInput).toHaveValue('Test Query');

    const searchLabel = screen.getByTestId('search-label');
    expect(searchLabel).toBeInTheDocument();
  });

  test('renders search input and expands/collapses the search area', () => {
    const store = createMockStore({
      settings: {
        searchItems: [],
        keyList: []
      }
    });

    render(
      <Provider store={store}>
        <EntitySearch />
      </Provider>
    );

    expect(screen.queryByPlaceholderText('Search through features')).toBeNull();
  });
});

describe('EntitySearch Component with Tags', () => {
  test('renders correct number of Tag components and handles click event', () => {
    const initialState = {
      settings: {
        keyList: ['Category 1', 'Category 2'],
        searchItems: [
          { name: 'Item 1', category: 'Category 1' },
          { name: 'Item 2', category: 'Category 2' }
        ]
      }
    };
    const store = createMockStore(initialState);

    render(
      <Provider store={store}>
        <EntitySearch />
      </Provider>
    );

    const tags = screen.getAllByRole('button');
    expect(tags).toHaveLength(initialState.settings.searchItems.length);

    tags.forEach((tag, index) => {
      expect(tag.textContent).toBe(initialState.settings.searchItems[index].name);
    });

    fireEvent.click(tags[0]);

    expect(store.getState().settings.searchItems).toContainEqual({
      name: 'Item 1',
      category: 'Category 1'
    });
  });
});

describe('Spinner and Search Item', () => {
  test('renders Spinner and SearchItem components correctly and handles click event', () => {
    const initialState = {
      loading: true,
      query: 'test',
      groupedResults: new Map([['Category 1', [{ name: 'Item 1', category: 'Category 1' }]]]),
      settings: {
        searchItems: []
      }
    };
    const store = createMockStore(initialState);

    jest.mock('../../helpers/hooks/useQuery.ts', () => ({
      useQuery: () => ({
        loading: true,
        data: null
      })
    }));

    render(
      <Provider store={store}>
        <EntitySearch />
      </Provider>
    );

    expect(screen.getByTestId('progress')).toBeInTheDocument();

    store.dispatch({ type: 'SET_LOADING', payload: false });

    expect(store.getState().settings.searchItems).not.toContainEqual({
      name: 'Item 1',
      category: 'Category 1'
    });
  });
});

describe('Tag Component', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    render(<Tag text="Protein A" index={0} onClick={mockOnClick} />);
  });

  it('renders the Tag correctly with the given text', () => {
    expect(screen.getByText('Protein A')).toBeInTheDocument();
  });

  it('calls the onClick handler when the Tag is clicked', async () => {
    const tagElement = screen.getByText('Protein A');

    await userEvent.click(tagElement);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
