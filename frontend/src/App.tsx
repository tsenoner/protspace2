import { useEffect } from "react";
import "./App.css";
import VisualizationComp from "./components/VisualizationComp";

function App() {
  useEffect(() => {
    const handleMessage = (event: { origin: string; data: any }) => {
      console.log("Received message event:", event);

      // Log the origin of the received message
      console.log("Message origin:", event.origin);

      // Conditional origin check for security (adjust the origin according to your sending site)
      if (event.origin !== "https://colab.research.google.com") {
        console.error("Message from unknown origin:", event.origin);
        return; // Stop processing the message further if the origin is not recognized
      }

      // Assuming your message is a simple object or string
      console.log("Message received from Colab:", event.data);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  console.log("App rendered");
  return (
    <>
      <VisualizationComp />
    </>
  );
}

export default App;
