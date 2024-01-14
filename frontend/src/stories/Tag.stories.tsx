import Tag from "../components/Tag";
import "../styles/globals.css";

export default {
    title : 'Tag',
    component : Tag
};

export const Default = () => (<Tag
    text={"Lorem ipsum"}
    onClick={function () : void {
    console.log("onClick");
}}
    index={0}/>);
