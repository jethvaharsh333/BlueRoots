<<<<<<< HEAD
const NGOLayout = () => {
    return (  
        <>
        NGO LAYOUT
        </>
    );
}
 
export default NGOLayout;
=======
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    FaTachometerAlt,
    FaChartLine,
    FaExclamationTriangle,
    FaUserPlus,
    FaUsers,
    FaSignOutAlt,
} from "react-icons/fa";

// ✅ Icons
const DashboardIcon = () => <FaTachometerAlt className="w-5 h-5" />;
const AnalyticsIcon = () => <FaChartLine className="w-5 h-5" />;
const AlertsIcon = () => <FaExclamationTriangle className="w-5 h-5" />;
const AddUserIcon = () => <FaUserPlus className="w-5 h-5" />;
const UsersIcon = () => <FaUsers className="w-5 h-5" />;
const LogoutIcon = () => <FaSignOutAlt className="w-5 h-5" />;

// ✅ Animations
const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100, damping: 15, staggerChildren: 0.1, delayChildren: 0.1 }
    }
};
const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 200 } }
};
const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { scale: 1, rotate: 0, transition: { type: "spring", stiffness: 200, damping: 15 } }
};

const sidebarItems = [
    { path: "/ngo/dashboard", label: "Dashboard", icon: DashboardIcon },
    { path: "/ngo/satellite-view-report", label: "Satellite", icon: AnalyticsIcon },
    { path: "/ngo/verify", label: "Verify", icon: AlertsIcon },
    { path: "/ngo/analytics", label: "Analytics", icon: AddUserIcon },
    { path: "/ngo/create-alert", label: "Create Alert", icon: AddUserIcon },
    { path: "/ngo/reports", label: "Reports", icon: AddUserIcon },

];

const NgoLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const role = localStorage.getItem("role");
    if (!role) {
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
                <motion.div className="p-6 border-b border-gray-100" variants={itemVariants}>
                    <NavLink to="/ngo/dashboard">
                        <div className="flex items-center gap-3">
                            <motion.div
                                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg"
                                variants={logoVariants}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="text-white font-bold text-lg">G</span>
                            </motion.div>
                            <h1 className="font-bold text-gray-900 text-lg leading-none">NGO Portal</h1>
                        </div>
                    </NavLink>
                </motion.div>

                {/* Sidebar Items */}
                <div className="flex-1 px-4 py-6">
                    <nav className="space-y-2">
                        {sidebarItems.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <motion.div key={i} variants={itemVariants} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer
                       ${isActive
                                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"}`
                                        }
                                    >
                                        <Icon />
                                        <span className="font-medium">{item.label}</span>
                                    </NavLink>
                                </motion.div>
                            );
                        })}
                    </nav>
                </div>

                {/* User Profile & Logout */}
                <motion.div className="p-4 border-t border-gray-100" variants={itemVariants}>
                    <motion.div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 mb-3" whileHover={{ scale: 1.02 }}>
                        <motion.div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
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
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* MAIN CONTENT */}
            <div className="lg:ml-64 p-4 lg:p-8 min-h-screen">
                <Outlet />
            </div>
        </div>
    );
};

export default NgoLayout;
>>>>>>> 01448991d2542071fb37bdd226304ba90c44d29b
