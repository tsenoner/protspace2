import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GuidelineComp from './Guideline';

jest.mock('../nav/Nav.tsx', () => {
  const MockNav = () => <div>Navigation</div>;
  MockNav.displayName = 'MockNav';
  return MockNav;
});

describe('GuidelineComp', () => {
  it('renders guidelines content', () => {
    render(
      <BrowserRouter>
        <GuidelineComp />
      </BrowserRouter>
    );

    expect(screen.getByText('Guideline')).toBeInTheDocument();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });
});
