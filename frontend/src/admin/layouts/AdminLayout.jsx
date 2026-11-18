import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  ChartNoAxesCombined,
  Users,
  MessageSquare,
  Mail,
  FolderKanban,
  Code2,
  UserRound,
  Settings,
  Activity,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const navigation = [
  {
    title: "MAIN",
    items: [
      { label: "Overview", path: "/admin", icon: LayoutDashboard, end: true },
      {
        label: "Analytics",
        path: "/admin/analytics",
        icon: ChartNoAxesCombined,
      },
      { label: "Visitors", path: "/admin/visitors", icon: Users },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { label: "Messages", path: "/admin/messages", icon: MessageSquare },
      { label: "Email Management", path: "/admin/emails", icon: Mail },
      { label: "Projects", path: "/admin/projects", icon: FolderKanban },
      { label: "Skills", path: "/admin/skills", icon: Code2 },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Profile Settings", path: "/admin/profile", icon: UserRound },
      { label: "Admin Settings", path: "/admin/settings", icon: Settings },
      { label: "Activity Logs", path: "/admin/activity", icon: Activity },
    ],
  },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { admin, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login", { replace: true });
    } catch {
      // Authentication state is cleared in AuthContext.
      navigate("/admin/login", { replace: true });
    }
  };

  return (
    <div className="admin-shell">
      {sidebarOpen && (
        <button
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <aside className={`admin-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Code2 size={23} />
          </div>

          <div>
            <h2>
              ABID<span>.</span>
            </h2>
            <p>ADMIN PANEL</p>
          </div>

          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-navigation">
          {navigation.map((group) => (
            <div className="nav-group" key={group.title}>
              <p className="nav-group-title">{group.title}</p>

              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? "active" : ""}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={19} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-admin-info">
            <div className="admin-avatar">
              {admin?.fullName?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div className="admin-user-details">
              <strong>{admin?.fullName || "Administrator"}</strong>
              <span>Administrator</span>
            </div>
          </div>

          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="mobile-menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={23} />
          </button>

          <div className="topbar-title">
            <h2>Administration</h2>
            <p>Manage your portfolio platform</p>
          </div>

          <div className="topbar-right">
            <div className="topbar-status">
              <span></span>
              System Online
            </div>

            <div className="topbar-avatar">
              {admin?.fullName?.charAt(0)?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>

        <footer className="admin-footer">
          <span>© {new Date().getFullYear()} ABID.</span>
          <span>Portfolio Management System</span>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
