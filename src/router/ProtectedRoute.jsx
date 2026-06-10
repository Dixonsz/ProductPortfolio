import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute() {
  const { user, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <main className="app-shell flex min-h-screen items-center justify-center px-6">
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-6 py-5 text-center shadow-sm">
          <p className="text-label-sm font-semibold uppercase tracking-widest text-primary">
            Cargando sesión
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
