import { useEffect } from "react";
import "./App.css";
import VisualizationComp from "./components/VisualizationComp";

function App() {
  useEffect(() => {
    // Function to handle the message event
    const handleMessage = (event: any) => {
      // Optional: Check the origin of the message sender for security
      // if (event.origin !== "http://expected-origin.com")
      //   return;

      // Assuming your message is a simple object
      console.log("Message received from colab:", event.data);

      // TODO: Handle the received message as needed
    };

    // Add the event listener for receiving messages
    window.addEventListener("message", handleMessage);

    // Cleanup: Remove the event listener when the component unmounts
    return () => window.removeEventListener("message", handleMessage);
  }, []); // The empty array ensures this effect runs only once on mount

  return (
    <>
      <VisualizationComp />
    </>
  );
}

export default App;
