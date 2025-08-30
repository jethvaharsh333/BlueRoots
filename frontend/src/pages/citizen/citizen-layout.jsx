import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaGlobe,
  FaList,
  FaPlusCircle,
  FaCalendarCheck,
  FaUser,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { useState } from "react";

const CitizenLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token, role etc. here
    localStorage.clear();
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className="w-full">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-56 flex-col bg-white border-r shadow-sm">
        {/* Logo */}
        <div className="border-b shadow-sm w-full px-4 py-3 bg-white">
          <NavLink to="/dashboard">
            <img
              src="/assets/gateway-company-black-logo.svg"
              alt="Gateway group"
            />
          </NavLink>
        </div>

        {/* Sidebar Items */}
        <div className="flex-1 px-4 mt-4">
          <ul className="flex flex-col gap-2">
            {sidebarItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <li key={i}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg transition-all 
                       ${isActive
                         ? "bg-green-900 text-white"
                         : "text-black hover:bg-green-200/40"}`
                    }
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-auto border-t shadow-sm w-full py-4 flex items-center justify-center gap-2 hover:bg-gray-100"
        >
          <FaSignOutAlt className="text-black text-sm" />
          <span className="text-black">Logout</span>
        </button>
      </div>

      {/* MOBILE NAVBAR */}
      <div className="md:hidden">
        <nav className="flex items-center justify-between border-b shadow-sm px-3 py-2 bg-white">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-3 text-black"
          >
            <FaBars />
          </button>
          <NavLink to="/dashboard">
            <img
              src="/assets/gateway-company-black-logo.svg"
              alt="Gateway group"
              className="h-9"
            />
          </NavLink>
        </nav>

        {/* Mobile Drawer (Offcanvas style) */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Overlay */}
            <div
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 bg-black/40"
            ></div>

            {/* Sidebar */}
            <div className="w-60 bg-white flex flex-col shadow-lg animate-slideIn">
              <div className="border-b px-4 py-3 flex justify-between items-center">
                <h5 className="text-black font-medium">Menu</h5>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-black"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 px-3 py-3 flex flex-col gap-2">
                {sidebarItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={i}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-lg transition-all 
                         ${isActive
                           ? "bg-green-900 text-white"
                           : "text-black hover:bg-green-200/40"}`
                      }
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="border-t shadow-sm w-full py-4 flex items-center justify-center gap-2 hover:bg-gray-100"
              >
                <FaSignOutAlt className="text-black text-sm" />
                <span className="text-black">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      {/* <div className="md:ml-56 px-3 py-4"> */}
      <div className="md:ml-56 px-4 py-4 md:px-6 md:py-6">
        <Outlet />
      </div>
    </div>
  );
};
const sidebarItems = [
  { path: "/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  { path: "/reports", label: "My Reports", icon: FaList },
  { path: "/reports/new", label: "Report Incident", icon: FaPlusCircle },
  { path: "/leaderboard", label: "Leaderboard", icon: FaGlobe },
  { path: "/profile", label: "Profile", icon: FaUser },
];

export default CitizenLayout;
