import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { authAdapter } from "./adapters/authAdapter";
import { authApi } from "./api/endpoints/auth";
import App from "./App.jsx";
import "./index.css";
import { useAuthStore } from "./store/authStore";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No se encontró el elemento root en el documento.");
}

async function initializeAuth() {
  const { setLoading, setUser } = useAuthStore.getState();

  try {
    const {
      data: { session },
    } = await authApi.getSession();

    setUser(authAdapter.toModel(session?.user ?? null));
  } finally {
    setLoading(false);
  }

  authApi.onAuthStateChange((_event, session) => {
    useAuthStore
      .getState()
      .setUser(authAdapter.toModel(session?.user ?? null));
  });
}

await initializeAuth();

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
