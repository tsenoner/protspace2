import {Card} from "../components/Card";
import "../styles/globals.css";

export default {
    title: 'Card',
    component: Card,
  };
  
  export const Default = () => (
    <Card
      id="id"
      text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip"
    />
  );
  