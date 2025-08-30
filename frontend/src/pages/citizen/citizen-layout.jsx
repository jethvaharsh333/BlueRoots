import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaGlobe,
  FaList,
  FaPlusCircle,
  FaUser,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

// Modern Icon Components (using React Icons)
const DashboardIcon = () => <FaTachometerAlt className="w-5 h-5" />;
const ReportIcon = () => <FaPlusCircle className="w-5 h-5" />;
const ListIcon = () => <FaList className="w-5 h-5" />;
const LeaderboardIcon = () => <FaGlobe className="w-5 h-5" />;
const ProfileIcon = () => <FaUser className="w-5 h-5" />;
const LogoutIcon = () => <FaSignOutAlt className="w-5 h-5" />;
const MenuIcon = () => <FaBars className="w-6 h-6" />;

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Animation variants
const sidebarVariants = {
  hidden: {
    x: -300,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200
    }
  }
};

const mobileDrawerVariants = {
  hidden: {
    x: "100%",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  },
  visible: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const logoVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: { 
    scale: 1, 
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15
    }
  }
};

const CitizenLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token, role etc. here
    localStorage.clear();
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const sidebarItems = [
    { path: "/dashboard", label: "Dashboard", icon: DashboardIcon },
    { path: "/reports/new", label: "Report Incident", icon: ReportIcon },
    { path: "/reports", label: "My Reports", icon: ListIcon },
    { path: "/leaderboard", label: "Leaderboard", icon: LeaderboardIcon },
    { path: "/profile", label: "Profile", icon: ProfileIcon },
  ];

  const role = localStorage.getItem('role');
  if(!role){
      toast.error("Something get wrong.");
      navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* DESKTOP SIDEBAR */}
      <motion.div 
        className="hidden lg:flex fixed top-0 left-0 h-screen w-64 flex-col bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl z-40"
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
      >
        {/* Logo */}
        <motion.div 
          className="p-6 border-b border-gray-100"
          variants={itemVariants}
        >
          <NavLink to="/dashboard">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg"
                variants={logoVariants}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-white font-bold text-lg">G</span>
              </motion.div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg leading-none">BlueRoots</h1>

              </div>
            </div>
          </NavLink>
        </motion.div>

        {/* Sidebar Items */}
        <div className="flex-1 px-4 py-6">
          <nav className="space-y-2">
            {sidebarItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer
                       ${isActive
                         ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                         : "text-gray-700 hover:bg-gray-100 hover:text-emerald-600"}`
                    }
                  >
                    <div className="flex-shrink-0">
                      <Icon />
                    </div>
                    <span className="font-medium">{item.label}</span>
                    <motion.div 
                      className="ml-auto opacity-0 group-hover:opacity-100"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </NavLink>
                </motion.div>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Logout */}
        <motion.div 
          className="p-4 border-t border-gray-100"
          variants={itemVariants}
        >
          <motion.div 
            className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 mb-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center"
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-white font-semibold text-sm">JD</span>
            </motion.div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">John Doe</p>
              <p className="text-gray-500 text-xs">{role}</p>
            </div>
          </motion.div>
          
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200 group"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogoutIcon />
            <span className="font-medium">Logout</span>
            <motion.div 
              className="ml-auto opacity-0 group-hover:opacity-100"
              initial={{ x: -10 }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* MOBILE NAVBAR */}
      <div className="lg:hidden sticky top-0 z-50">
        <motion.nav 
          className="flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <motion.button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-3 -ml-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MenuIcon />
          </motion.button>
          
          <NavLink to="/dashboard">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 5 }}
              >
                <span className="text-white font-bold text-sm">G</span>
              </motion.div>
              <span className="font-bold text-gray-900">Gateway</span>
            </motion.div>
          </NavLink>
          
          <div className="w-12"></div> {/* Spacer for centering */}
        </motion.nav>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="fixed inset-0 z-50 flex"
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Overlay */}
              <motion.div
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 bg-black/40 backdrop-blur-sm"
                variants={overlayVariants}
              />

              {/* Sidebar */}
              <motion.div 
                className="w-72 bg-white/95 backdrop-blur-xl flex flex-col shadow-2xl"
                variants={mobileDrawerVariants}
              >
                <motion.div 
                  className="p-6 border-b border-gray-100 flex justify-between items-center"
                  variants={itemVariants}
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center"
                      variants={logoVariants}
                    >
                      <span className="text-white font-bold text-lg">G</span>
                    </motion.div>
                    <div>
                      <h1 className="font-bold text-gray-900 text-lg">Gateway</h1>
                      <p className="text-gray-500 text-sm">Group</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <CloseIcon />
                  </motion.button>
                </motion.div>

                <div className="flex-1 px-4 py-6">
                  <nav className="space-y-2">
                    {sidebarItems.map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={i}
                          variants={itemVariants}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <NavLink
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) =>
                              `group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer
                               ${isActive
                                 ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                                 : "text-gray-700 hover:bg-gray-100 hover:text-emerald-600"}`
                            }
                          >
                            <Icon />
                            <span className="font-medium">{item.label}</span>
                            <motion.div 
                              className="ml-auto opacity-0 group-hover:opacity-100"
                              initial={{ x: -10 }}
                              whileHover={{ x: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </motion.div>
                          </NavLink>
                        </motion.div>
                      );
                    })}
                  </nav>
                </div>

                {/* User Profile & Logout */}
                <motion.div 
                  className="p-4 border-t border-gray-100"
                  variants={itemVariants}
                >
                  <motion.div 
                    className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 mb-3"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div 
                      className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center"
                      whileHover={{ rotate: 5 }}
                    >
                      <span className="text-white font-semibold text-sm">JD</span>
                    </motion.div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">John Doe</p>
                      <p className="text-gray-500 text-xs">({role})</p>
                    </div>
                  </motion.div>
                  
                  <motion.button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200 group"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogoutIcon />
                    <span className="font-medium">Logout</span>
                    <motion.div 
                      className="ml-auto opacity-0 group-hover:opacity-100"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MAIN CONTENT */}
      <div className="lg:ml-64 p-4 lg:p-8 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default CitizenLayout;