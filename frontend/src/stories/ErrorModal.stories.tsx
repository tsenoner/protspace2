import ErrorModal from "../components/ErrorModal";
import { Provider } from 'react-redux';
import store from '../redux/store'; 
import "../styles/globals.css";
import { StoryFn } from '@storybook/react';

export default {
    title : 'Error Modal',
    component : ErrorModal,
    decorators: [
    (Story: StoryFn) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
};

export const Default = () => (<ErrorModal />);
