import EntitySearch from "../components/EntitySearch";
import { Provider } from 'react-redux';
import store from '../redux/store';
import "../styles/globals.css";
import { StoryFn } from '@storybook/react';

export default {
    title: 'Entity Search',
    component: EntitySearch,
    decorators: [(Story: StoryFn) => (
        <Provider store={store}>
            <Story />
        </Provider>
    )]
};

export const Default = () => (<EntitySearch />);
