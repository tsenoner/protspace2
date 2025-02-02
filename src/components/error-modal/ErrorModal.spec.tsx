import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import ErrorModal from './ErrorModal';

const createActionLogger = () => {
  let actions: any[] = [];

  return {
    getActions: () => actions,
    clearActions: () => {
      actions = [];
    }
  };
};

describe('ErrorModal', () => {
  let store: ReturnType<typeof configureStore>;
  let logger: ReturnType<typeof createActionLogger>;

  const initialState = {
    settings: {
      errorMessage: 'Test error message'
    }
  };

  beforeEach(() => {
    logger = createActionLogger();

    store = configureStore({
      reducer: (state = initialState) => state,
      preloadedState: initialState
    });

    logger.clearActions();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ErrorModal />
        </BrowserRouter>
      </Provider>
    );
  });

  it('renders correctly', () => {
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('displays the error message from Redux state', () => {
    expect(screen.getByText(/Test error message/i)).toBeInTheDocument();
  });
});
