import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

const shouldHydrate = container.innerHTML.trim().length > 0;

if (shouldHydrate) {
  hydrateRoot(container, <App />);
  console.log("🔄 Hydrating from server-rendered HTML");
} else {
  createRoot(container).render(<App />);
  console.log("🚀 Client-side render");
}

declare global {
  interface Window {
    __INITIAL_STATE__?: any;
    __USER_ID__?: string | null;
  }
}
