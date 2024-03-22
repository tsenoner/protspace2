import { useEffect } from "react";
import "./App.css";
import VisualizationComp from "./components/VisualizationComp";

function App() {
  useEffect(() => {
    const handleMessage = (event: { origin: string; data: any }) => {
      console.log("Message received from Colab:", event.data);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <>
      <VisualizationComp />
    </>
  );
}

export default App;
