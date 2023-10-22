import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import 'react-toastify/dist/ReactToastify.css';
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
// import "@mantine/form/styles.css";
import { AuthContextProvider } from "./context/AuthContext.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
      <AuthContextProvider>
        <MantineProvider>
          <App />
        </MantineProvider>
      </AuthContextProvider>
  
);
