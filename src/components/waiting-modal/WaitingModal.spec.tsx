import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import VisualizationWaitingModal from './WaitingModal';
import '@testing-library/jest-dom';

describe('VisualizationWaitingModal', () => {
  it('renders correctly when open', () => {
    render(
      <ChakraProvider>
        <VisualizationWaitingModal isOpen={true} onClose={() => {}} />
      </ChakraProvider>
    );

    expect(screen.getByText('Waiting for Data')).toBeInTheDocument();
    expect(
      screen.getByText("Please wait while we're fetching the visualization data from Colab.")
    ).toBeInTheDocument();
  });
});
