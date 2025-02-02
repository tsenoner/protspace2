import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { FileUploadFormModal } from './FileUploadFormModal';
import { setTechnique } from '../../redux/actions/settings';
import { ChakraProvider } from '@chakra-ui/react';

const initialState = {
  settings: {
    technique: '0',
    projections: [{ name: 'Projection 1', dimensions: 3 }],
    states: []
  }
};
let store: ReturnType<typeof configureStore>;

beforeEach(() => {
  store = configureStore({
    reducer: (state = initialState) => state,
    preloadedState: initialState
  });
  store.dispatch = jest.fn();
});

describe('FileUploadFormModal', () => {
  it('renders when fileUploadShown is true', () => {
    render(
      <Provider store={store}>
        <ChakraProvider>
          <FileUploadFormModal fileUploadShown={true} setFileUploadShown={() => {}} />
        </ChakraProvider>
      </Provider>
    );
    expect(screen.getByText('Projection Settings')).toBeInTheDocument();
  });

  it('does not render when fileUploadShown is false', () => {
    render(
      <Provider store={store}>
        <ChakraProvider>
          <FileUploadFormModal fileUploadShown={false} setFileUploadShown={() => {}} />
        </ChakraProvider>
      </Provider>
    );
    expect(screen.queryByText('Projection Settings')).not.toBeInTheDocument();
  });

  it('dispatches setTechnique action with selected technique on save', async () => {
    render(
      <Provider store={store}>
        <ChakraProvider>
          <FileUploadFormModal fileUploadShown={true} setFileUploadShown={() => {}} />
        </ChakraProvider>
      </Provider>
    );

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '0' } });
    await userEvent.click(screen.getByText('Save Changes'));

    expect(store.dispatch).toHaveBeenCalledWith(setTechnique('0'));
  });

  it('calls setFileUploadShown with false on close button click', async () => {
    const setFileUploadShownMock = jest.fn();

    render(
      <Provider store={store}>
        <ChakraProvider>
          <FileUploadFormModal fileUploadShown={true} setFileUploadShown={setFileUploadShownMock} />
        </ChakraProvider>
      </Provider>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => {
      expect(setFileUploadShownMock).toHaveBeenCalledWith(false);
    });
  });
});
