import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import "./assets/scss/dashlite.scss";
import "./assets/scss/style-email.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GlobalProvider } from "./context/Provider"
import {BrowserRouter, Routes, Route} from 'react-router-dom'

//const Error404Modern = lazy(() => import("./pages/error/404-modern"));

ReactDOM.render(
  <React.Fragment>
    <BrowserRouter>
      <GlobalProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </GlobalProvider>
    </BrowserRouter>
  </React.Fragment>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
