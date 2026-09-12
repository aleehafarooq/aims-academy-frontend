import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  CreditCard,
  Receipt,
  FileText,
  BookOpen,
  Newspaper,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* =================================
     LOAD SAVED THEME
  ================================= */

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("aims_theme");

    return savedTheme === "dark"
      ? "dark"
      : "light";
  });

  const navigate = useNavigate();

  /* =================================
     APPLY THEME TO BODY
  ================================= */

  const applyTheme = (selectedTheme) => {
    const newTheme =
      selectedTheme === "dark"
        ? "dark"
        : "light";

    setTheme(newTheme);

    if (newTheme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  /* =================================
     LOAD SAVED THEME ON START
  ================================= */

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("aims_theme") ||
      "light";

    applyTheme(savedTheme);
  }, []);

  /* =================================
     LISTEN FOR THEME CHANGES
  ================================= */

  useEffect(() => {
    const handleThemeChange = () => {
      const savedTheme =
        localStorage.getItem("aims_theme") ||
        "light";

      applyTheme(savedTheme);
    };

    /* Same browser tab */

    window.addEventListener(
      "aims-theme-change",
      handleThemeChange
    );

    /* Other browser tabs */

    window.addEventListener(
      "storage",
      handleThemeChange
    );

    return () => {
      window.removeEventListener(
        "aims-theme-change",
        handleThemeChange
      );

      window.removeEventListener(
        "storage",
        handleThemeChange
      );
    };
  }, []);

  /* =================================
     KEEP BODY IN SYNC
  ================================= */

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  /* =================================
     SIDEBAR
  ================================= */

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  /* =================================
     LOGOUT
  ================================= */

  const handleLogout = () => {
    navigate("/admin/login");
  };

  /* =================================
     RENDER
  ================================= */

  return (
    <div
      className={`admin-layout ${
        theme === "dark"
          ? "dark-mode"
          : ""
      }`}
    >

      {/* ================================
          MOBILE OVERLAY
      ================================= */}

      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={closeSidebar}
        ></div>
      )}

      {/* ================================
          SIDEBAR
      ================================= */}

      <aside
        className={`admin-sidebar ${
          sidebarOpen
            ? "admin-sidebar-open"
            : ""
        }`}
      >

        {/* ================================
            SIDEBAR HEADER
        ================================= */}

        <div className="admin-sidebar-header">

          <div>
            <h2>AIMS</h2>

            <span>
              ACADEMY ADMIN
            </span>
          </div>

          <button
            type="button"
            className="admin-mobile-close"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>

        </div>

        {/* ================================
            NAVIGATION
        ================================= */}

        <nav className="admin-navigation">

          {/* DASHBOARD */}

          <NavLink
            to="/admin/dashboard"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `admin-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <LayoutDashboard size={19} />

            <span>
              Dashboard
            </span>
          </NavLink>

          {/* STUDENTS */}

          <NavLink
            to="/admin/students"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `admin-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <Users size={19} />

            <span>
              Students
            </span>
          </NavLink>

          {/* ATTENDANCE */}

          <NavLink
            to="/admin/attendance"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `admin-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <ClipboardCheck size={19} />

            <span>
              Attendance
            </span>
          </NavLink>

          {/* FEES */}

          <NavLink
            to="/admin/fees"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `admin-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <CreditCard size={19} />

            <span>
              Fees
            </span>
          </NavLink>

          {/* FEE VOUCHERS */}

          <NavLink
            to="/admin/fee-vouchers"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `admin-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <Receipt size={19} />

            <span>
              Fee Vouchers
            </span>
          </NavLink>

          {/* RESULTS */}

          <NavLink
            to="/admin/results"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `admin-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <FileText size={19} />

            <span>
              Results
            </span>
          </NavLink>

          {/* COURSES / SUBJECTS */}

          <NavLink
            to="/admin/courses"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `admin-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <BookOpen size={19} />

            <span>
              Courses / Subjects
            </span>
          </NavLink>

          {/* NEWS */}

          <NavLink
            to="/admin/news"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `admin-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <Newspaper size={19} />

            <span>
              News
            </span>
          </NavLink>

          {/* REPORTS */}

          <NavLink
            to="/admin/reports"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `admin-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <BarChart3 size={19} />

            <span>
              Reports
            </span>
          </NavLink>

          {/* SETTINGS */}

          <NavLink
            to="/admin/settings"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `admin-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <Settings size={19} />

            <span>
              Settings
            </span>
          </NavLink>

        </nav>

        {/* ================================
            LOGOUT
        ================================= */}

        <div className="admin-sidebar-footer">

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={19} />

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>

      {/* ================================
          MAIN ADMIN AREA
      ================================= */}

      <div className="admin-main">

        {/* TOP BAR */}

        <header className="admin-topbar">

          <button
            type="button"
            className="admin-mobile-menu"
            onClick={() =>
              setSidebarOpen(true)
            }
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          <div className="admin-topbar-title">

            <p>
              ADMIN PORTAL
            </p>

            <h1>
              AIMS Academy
            </h1>

          </div>

        </header>

        {/* PAGE CONTENT */}

        <main className="admin-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;