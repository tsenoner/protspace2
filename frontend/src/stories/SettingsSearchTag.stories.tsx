import SettingsSearchTag from "../components/SettingsSearchTag";
import "../styles/globals.css";

export default {
    title : 'Settings Search Tag',
    component : SettingsSearchTag
};

export const Default = () => (<SettingsSearchTag text={"Lorem ipsum"} onClick={function (): void {
    console.log("onClick");
} }/>);
