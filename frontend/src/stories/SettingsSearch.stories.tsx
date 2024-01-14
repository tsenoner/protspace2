import SettingsSearch from "../components/SettingsSearch";
import {Provider} from 'react-redux';
import store from '../redux/store';
import "../styles/globals.css";
import { StoryFn } from '@storybook/react';

export default {
    title : 'Settings Search',
    component : SettingsSearch,
    decorators : [(Story: StoryFn) => (
        <Provider store={store}>
            <Story/>
        </Provider>
    )]
};

export const Default = () => (<SettingsSearch />);
