import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

/* Bootstrap */
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

/* Base CSS */
import "./assets/css/base/reset.css";
import "./assets/css/base/variables.css";
import "./assets/css/base/global.css";

/* Layout CSS */
import "./assets/css/layout/sidebar.css";
import "./assets/css/layout/navbar.css";
import "./assets/css/layout/layout.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
