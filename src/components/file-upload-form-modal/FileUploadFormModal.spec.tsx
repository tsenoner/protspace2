import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { AnyAction, Store } from 'redux';
import configureStore from 'redux-mock-store';
import { FileUploadFormModal } from './FileUploadFormModal';
import { setTechnique } from '../../redux/actions/settings';

const mockStore = configureStore([]);
const initialState = {
  settings: {
    technique: '0',
    projections: [{ name: 'Projection 1', dimensions: 3 }],
    states: []
  }
};
let store: Store<unknown, AnyAction>;

beforeEach(() => {
  store = mockStore(initialState);
  store.dispatch = jest.fn();
});

describe('FileUploadFormModal', () => {
  it('renders when fileUploadShown is true', () => {
    render(
      <Provider store={store}>
        <FileUploadFormModal fileUploadShown={true} setFileUploadShown={() => {}} />
      </Provider>
    );
    expect(screen.getByText('Projection Settings')).toBeInTheDocument();
  });

  it('does not render when fileUploadShown is false', () => {
    render(
      <Provider store={store}>
        <FileUploadFormModal fileUploadShown={false} setFileUploadShown={() => {}} />
      </Provider>
    );
    expect(screen.queryByText('Projection Settings')).not.toBeInTheDocument();
  });

  it('dispatches setTechnique action with selected technique on save', () => {
    render(
      <Provider store={store}>
        <FileUploadFormModal fileUploadShown={true} setFileUploadShown={() => {}} />
      </Provider>
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '0' } });
    userEvent.click(screen.getByText('Save Changes'));
    expect(store.dispatch).toHaveBeenCalledWith(setTechnique('0'));
  });

  it('calls setFileUploadShown with false on close button click', () => {
    const setFileUploadShownMock = jest.fn();
    render(
      <Provider store={store}>
        <FileUploadFormModal fileUploadShown={true} setFileUploadShown={setFileUploadShownMock} />
      </Provider>
    );
    userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(setFileUploadShownMock).toHaveBeenCalledWith(false);
  });
});
