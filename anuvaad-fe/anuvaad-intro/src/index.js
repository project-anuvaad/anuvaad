import React from "react";
import ReactDOM from 'react-dom/client';
import "./index.css";
import App from "./web.routes";
import reportWebVitals from "./reportWebVitals";
import Theme from "./ui/pages/theme/theme";
import { ThemeProvider } from "@mui/material/styles";

import { StyledEngineProvider } from "@mui/material/styles";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
        <StyledEngineProvider injectFirst>
          <App />
        </StyledEngineProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();