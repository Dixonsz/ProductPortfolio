import { NavLink } from "react-router-dom";
import { useSidebar } from "../../hooks/useSidebar";
import { NAV_SECTIONS } from "../../constants/navigation";
import { SidebarProps } from "../../types/sidebar.types";

export default function Sidebar({ sections = NAV_SECTIONS }) {
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={`h-screen bg-surface border-r border-outline-variant flex flex-col py-8 transition-all duration-300 ease-out z-50 ${
        collapsed ? "w-[4.5rem]" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="px-6 mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="min-w-[32px] h-[32px] bg-primary flex items-center justify-center rounded-sm flex-shrink-0">
            <span className="text-white font-headline-sm text-[18px]">A</span>
          </div>
          {!collapsed && (
            <span className="font-headline-sm tracking-widest text-primary transition-opacity duration-300">
              AURELIA
            </span>
          )}
        </div>
        <button
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-1 hover:bg-surface-container rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-on-surface-variant">
            {collapsed ? "menu" : "menu_open"}
          </span>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-8">
        {sections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="px-3 mb-4 font-label-caps text-label-caps text-outline uppercase tracking-widest transition-opacity duration-300">
                {section.label}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-3 py-3 rounded-sm transition-all duration-300 ${
                        isActive
                          ? "text-secondary border-r-2 border-secondary bg-surface-container-low"
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
                      <span className="font-nav-item text-nav-item whitespace-nowrap">
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
