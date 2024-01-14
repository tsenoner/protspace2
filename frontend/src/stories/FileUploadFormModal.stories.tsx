import {FileUploadFormModal} from "../components/FileUploadFormModal";
import {Provider} from 'react-redux';
import store from '../redux/store';
import "../styles/globals.css";
import { StoryFn } from '@storybook/react';

export default {
    title : 'File Upload Form Modal',
    component : FileUploadFormModal,
    decorators : [(Story: StoryFn) => (
            <Provider store={store}>
                <Story/>
            </Provider>
        )]
};

export const Default = () => (<FileUploadFormModal fileUploadShown={true} setFileUploadShown={console.log()}/>);
