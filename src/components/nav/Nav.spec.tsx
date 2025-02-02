import { render, screen } from '@testing-library/react';
import Nav from './Nav';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import '@testing-library/jest-dom';
import { useColorMode } from '@chakra-ui/react';

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useColorMode: jest.fn()
}));

describe('Nav', () => {
  const theme = extendTheme();

  const mockedUseColorMode = useColorMode as jest.MockedFunction<typeof useColorMode>;

  it('renders correctly with light mode', () => {
    mockedUseColorMode.mockImplementation(() => ({
      colorMode: 'light',
      toggleColorMode: jest.fn(),
      setColorMode: jest.fn()
    }));

    render(
      <ChakraProvider theme={theme}>
        <Nav />
      </ChakraProvider>
    );

    expect(screen.getByText('ProtSpace')).toBeInTheDocument();
  });

  it('renders correctly with dark mode', () => {
    mockedUseColorMode.mockImplementation(() => ({
      colorMode: 'dark',
      toggleColorMode: jest.fn(),
      setColorMode: jest.fn()
    }));

    render(
      <ChakraProvider theme={theme}>
        <Nav />
      </ChakraProvider>
    );

    expect(screen.getByText('ProtSpace')).toBeInTheDocument();
  });
});
