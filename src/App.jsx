import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useState, useEffect } from "react";
import { supabase } from "./api/client";

export default function App() {
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    // Espera que Supabase restaure la sesión del localStorage
    supabase.auth.getSession().then(() => setSessionReady(true));

    // Escucha cambios de sesión (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setSessionReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  // No renderiza nada hasta que la sesión esté lista
  if (!sessionReady) return null;

  return <RouterProvider router={router} />;
}