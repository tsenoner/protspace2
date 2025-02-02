import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { RootState } from '../../redux/store';
import EntitySearch from './EntitySearch';
import Tag from '../tag/Tag';

jest.mock('../../helpers/hooks/useQuery', () => ({
  __esModule: true,
  default: jest.fn(() => ({ data: [], loading: false }))
}));

const mockStore = configureStore();
const store = mockStore({
  settings: {
    searchItems: [],
    keyList: []
  }
});

describe('EntitySearch Component', () => {
  test('renders search input and responds to user input', async () => {
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

  it('renders search input and expands/collapses the search area', async () => {
    expect(screen.queryByPlaceholderText('Search through features')).toBeNull();
  });
});

describe('EntitySearch Component', () => {
  test('renders correct number of Tag components and handles click event', () => {
    const mockStore = configureStore();
    const store = mockStore({
      settings: {
        keyList: ['Category 1', 'Category 2'],
        searchItems: [
          { name: 'Item 1', category: 'Category 1' },
          { name: 'Item 2', category: 'Category 2' }
        ]
      }
    });

    render(
      <Provider store={store}>
        <EntitySearch />
      </Provider>
    );

    const tags = screen.getAllByRole('button');
    expect(tags).toHaveLength((store.getState() as RootState).settings.searchItems.length);

    tags.forEach((tag, index) => {
      expect(tag.textContent).toBe(
        (store.getState() as RootState).settings.searchItems[index].name
      );
    });

    fireEvent.click(tags[0]);
    expect((store.getState() as RootState).settings.searchItems).toContainEqual({
      name: 'Item 1',
      category: 'Category 1'
    });
  });
});

describe('Spinner and Search Item', () => {
  test('renders Spinner and SearchItem components correctly and handles click event', () => {
    const mockStore = configureStore();
    const store = mockStore({
      loading: true,
      query: 'test',
      groupedResults: new Map([['Category 1', [{ name: 'Item 1', category: 'Category 1' }]]]),
      settings: {
        searchItems: []
      }
    });

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

    expect((store.getState() as RootState).settings.searchItems).not.toContainEqual({
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

  it('calls the onClick handler when the Tag is clicked', () => {
    const tagElement = screen.getByText('Protein A');
    userEvent.click(tagElement);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('displays the correct style based on the index', () => {
    const tagElement = screen.getByText('Protein A');
    expect(tagElement).toHaveStyle('backgroundColor: rgb(255, 99, 71');
  });
});
