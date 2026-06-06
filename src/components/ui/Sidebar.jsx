import { NavLink } from "react-router-dom";
import { useSidebar } from "../../hooks/useSidebar";
import { NAV_SECTIONS } from "../../constants/navigation";
import { SidebarProps } from "../../types/sidebar.types";

export default function Sidebar({ sections = NAV_SECTIONS }) {
  const { collapsed, toggle } = useSidebar();

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
                          : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
                      }`
                    }
                  >
                    {item.icon && (
                      <span className="material-symbols-outlined flex-shrink-0" aria-hidden="true">
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
    </aside>
  );
}

Sidebar.propTypes = SidebarProps;
