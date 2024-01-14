import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux"; // Import the Provider
import store from "./redux/store.ts"; // Import your store
import App from "./App.tsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // @ts-expect-error React-Redux typings are not up to date
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);
