import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { useToast } from "./useToast.ts";
import ToastProvider from "./ToastProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ToastProvider>
    {/* <React.StrictMode> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* </React.StrictMode> */}
  </ToastProvider>
);

export { ToastProvider, useToast };
