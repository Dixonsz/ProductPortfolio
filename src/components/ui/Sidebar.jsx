import { NavLink, useNavigate } from "react-router-dom";
import { NAV_SECTIONS } from "../../constants/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useSidebar } from "../../hooks/useSidebar";
import { SidebarProps } from "../../types/sidebar.types";

export default function Sidebar({ sections = NAV_SECTIONS }) {
  const { collapsed, toggle } = useSidebar();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`z-50 flex h-screen flex-col border-r border-outline-variant bg-surface-container-low py-8 transition-all duration-300 ease-out ${
        collapsed ? "w-[4.5rem]" : "w-64"
      }`}
    >
      <div className="mb-10 flex items-center justify-between px-5">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 min-w-9 flex-shrink-0 items-center justify-center rounded-sm bg-primary">
            <span className="font-display text-[20px] text-on-primary">A</span>
          </div>
          {!collapsed && (
            <div className="transition-opacity duration-300">
              <p className="font-display text-headline-md leading-none text-on-surface">
                Amar y Ya
              </p>
              <p className="mt-1 text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant">
                Administración
              </p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
          className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
        >
          <span className="material-symbols-outlined">
            {collapsed ? "menu" : "menu_open"}
          </span>
        </button>
      </div>

      <nav className="flex-1 space-y-8 overflow-y-auto px-3">
        {sections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="mb-4 px-3 text-label-sm font-semibold uppercase tracking-widest text-outline transition-opacity duration-300">
                {section.label}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-3 py-3 transition-all duration-300 ${
                        isActive
                          ? "border-r-4 border-primary bg-surface-container text-primary"
                          : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
                      }`
                    }
                  >
                    {item.icon && (
                      <span
                        className="material-symbols-outlined flex-shrink-0"
                        aria-hidden="true"
                      >
                        {item.icon}
                      </span>
                    )}
                    {!collapsed && (
                      <span className="whitespace-nowrap text-body-md font-medium">
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-6 border-t border-outline-variant/60 px-3 pt-5">
        {!collapsed && (
          <div className="mb-4 px-3">
            <p className="truncate text-body-md font-semibold text-on-surface">
              {user?.name ?? "Usuario"}
            </p>
            <p className="truncate text-label-sm text-on-surface-variant">
              {user?.email ?? "Sesión activa"}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
          className="flex w-full items-center gap-4 px-3 py-3 text-on-surface-variant transition-all duration-300 hover:bg-error-container hover:text-on-error-container"
        >
          <span className="material-symbols-outlined flex-shrink-0" aria-hidden="true">
            logout
          </span>
          {!collapsed && (
            <span className="whitespace-nowrap text-body-md font-medium">
              Cerrar sesión
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}

Sidebar.propTypes = SidebarProps;
