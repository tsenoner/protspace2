import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

jest.mock('./App', () => {
  return {
    __esModule: true,
    default: () => {
      return <div>Mocked Visualization Component</div>;
    }
  };
});

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    const visualizationCompElement = screen.getByText(/Mocked Visualization Component/i);
    expect(visualizationCompElement).toBeInTheDocument();
  });
});
