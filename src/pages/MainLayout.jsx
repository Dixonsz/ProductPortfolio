// pages/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";

export default function MainLayout() {
  return (
    <div className="app-shell flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-20 items-center justify-between border-b border-outline-variant bg-surface/85 px-6 backdrop-blur-xl lg:px-12">
          <div>
            <p className="text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant">
              Catálogo de productos
            </p>
            <h1 className="font-display text-headline-md text-on-surface">
              Panel de Administrativo
            </h1>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container hover:text-primary"
              aria-label="Buscar"
            >
              <span className="material-symbols-outlined">search</span>
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container hover:text-primary"
              aria-label="Notificaciones"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
