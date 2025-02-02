import {StyleDiv} from "../components/StyleDiv";
import "../styles/globals.css";

export default {
    title : 'Style Div',
    component : StyleDiv
};

const spec= {cartoon: {
    hidden: false,
    color: 'spectrum',
    style: 'rectangle',
    ribbon: false,
    arrows: false,
    tubes: false,
    thickness: 0.4,
    width: 1,
    opacity: 1
}}

export const Default = () => (<StyleDiv name={"cartoon"} styleSpec={spec}/>);
