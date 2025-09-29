import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import { NotificationsProvider } from "./NotificationContext.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <NotificationsProvider>
      <App />
    </NotificationsProvider>
  </AuthProvider>
);
