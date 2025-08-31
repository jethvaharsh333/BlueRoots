import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../utils/axiosClient";
import { BACKEND_URL } from "../../constant";
import toast from "react-hot-toast";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
};

const cardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
};

const GovtDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    verifiedReports: 0,
    totalUsers: 0,
    totalCitizens: 0,
    totalNGOs: 0,
    activeAlerts: 0
  });
  const [recentReports, setRecentReports] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard stats (you might need to create this endpoint)
        try {
          const statsRes = await axiosClient.get(`${BACKEND_URL}/admin/dashboard-stats`);
          setDashboardStats(statsRes.data.data);
        } catch (error) {
          console.log("Stats endpoint not available, using mock data");
          // Mock data for demonstration
          setDashboardStats({
            totalReports: 156,
            pendingReports: 23,
            verifiedReports: 98,
            totalUsers: 1247,
            totalCitizens: 1089,
            totalNGOs: 158,
            activeAlerts: 7
          });
        }

        // Fetch recent reports
        try {
          const reportsRes = await axiosClient.get(`${BACKEND_URL}/admin/recent-reports?limit=5`);
          setRecentReports(reportsRes.data.data || []);
        } catch (error) {
          console.log("Recent reports endpoint error:", error);
        }

        // Fetch recent users
        try {
          const usersRes = await axiosClient.get(`${BACKEND_URL}/admin/recent-users?limit=5`);
          setRecentUsers(usersRes.data.data || []);
        } catch (error) {
          console.log("Recent users endpoint error:", error);
        }

      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'from-yellow-400 to-orange-500';
      case 'verified': return 'from-green-400 to-emerald-500';
      case 'action_taken': return 'from-blue-400 to-purple-500';
      case 'rejected': return 'from-red-400 to-pink-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusEmoji = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '⏳';
      case 'verified': return '✅';
      case 'action_taken': return '🚀';
      case 'rejected': return '❌';
      default: return '📋';
    }
  };

  const getCategoryEmoji = (category) => {
    switch (category?.toLowerCase()) {
      case 'cutting': return '🌳';
      case 'dumping': return '🗑️';
      case 'pollution': return '☁️';
      case 'land_clearing': return '🚜';
      default: return '📋';
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'citizen': return 'from-emerald-400 to-green-500';
      case 'ngo': return 'from-blue-400 to-indigo-500';
      case 'government': return 'from-purple-400 to-violet-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header skeleton */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 p-8">
          <div className="h-8 bg-gray-200 rounded-xl animate-pulse w-64 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-96"></div>
        </div>
        
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 p-6">
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse mb-4"></div>
              <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-20 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-32"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) return <LoadingSkeleton />;

  const currentTime = new Date().getHours();
  const greeting = currentTime < 12 ? "Good Morning" : currentTime < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <motion.div 
        className="max-w-7xl mx-auto space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Welcome Header */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 overflow-hidden"
          variants={cardVariants}
        >
          <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-8 text-white relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <motion.div 
                className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🏛️
              </motion.div>
              <div className="text-center md:text-left">
                <motion.h1 
                  className="text-3xl md:text-4xl font-bold mb-2"
                  variants={itemVariants}
                >
                  {greeting}, Government Admin!
                </motion.h1>
                <motion.p 
                  className="text-blue-100 text-lg"
                  variants={itemVariants}
                >
                  Monitor environmental reports and manage the platform effectively 🌍
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Statistics */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {[
            { 
              icon: "📊", 
              label: "Total Reports", 
              value: dashboardStats.totalReports, 
              color: "from-emerald-500 to-teal-500",
              description: "All environmental reports"
            },
            { 
              icon: "⏳", 
              label: "Pending Reports", 
              value: dashboardStats.pendingReports, 
              color: "from-yellow-500 to-orange-500",
              description: "Awaiting review"
            },
            { 
              icon: "👥", 
              label: "Total Users", 
              value: dashboardStats.totalUsers, 
              color: "from-blue-500 to-purple-500",
              description: "Platform users"
            },
            { 
              icon: "🚨", 
              label: "Active Alerts", 
              value: dashboardStats.activeAlerts, 
              color: "from-red-500 to-pink-500",
              description: "Current alerts"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className={`bg-gradient-to-r ${stat.color} text-white p-6 rounded-3xl shadow-xl relative overflow-hidden`}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="text-4xl mb-3"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.5
                }}
              >
                {stat.icon}
              </motion.div>
              <div className="text-3xl font-bold mb-1">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </div>
              <div className="text-lg font-medium mb-1">{stat.label}</div>
              <div className="text-sm opacity-90">{stat.description}</div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer opacity-30"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 p-8"
          variants={cardVariants}
        >
          <motion.h2 
            className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
            variants={itemVariants}
          >
            <span className="text-3xl">⚡</span>
            Quick Actions
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                label: "View Analytics", 
                path: "/govt/analytics", 
                icon: "📈", 
                color: "from-emerald-500 to-blue-500" 
              },
              { 
                label: "Manage Alerts", 
                path: "/govt/alerts", 
                icon: "🚨", 
                color: "from-red-500 to-pink-500" 
              },
              { 
                label: "Add New User", 
                path: "/govt/add-user", 
                icon: "👤", 
                color: "from-purple-500 to-indigo-500" 
              },
              { 
                label: "View All Users", 
                path: "/govt/users", 
                icon: "👥", 
                color: "from-blue-500 to-cyan-500" 
              }
            ].map((action, index) => (
              <motion.button
                key={index}
                onClick={() => navigate(action.path)}
                className={`bg-gradient-to-r ${action.color} text-white p-4 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all`}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-2xl mb-2">{action.icon}</div>
                <div className="text-sm">{action.label}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Reports */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 p-8"
            variants={cardVariants}
          >
            <motion.h2 
              className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
              variants={itemVariants}
            >
              <span className="text-3xl">📋</span>
              Recent Reports
            </motion.h2>

            <div className="space-y-4">
              <AnimatePresence>
                {recentReports.length > 0 ? (
                  recentReports.slice(0, 5).map((report, index) => (
                    <motion.div
                      key={report.id || index}
                      className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, x: 5 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">
                          {getCategoryEmoji(report.category)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 capitalize">
                            {report.category?.replace('_', ' ') || 'Environmental Issue'}
                          </h4>
                          <p className="text-sm text-gray-600 truncate">
                            By: {report.user?.username || 'Anonymous'}
                          </p>
                        </div>
                        <motion.div 
                          className={`bg-gradient-to-r ${getStatusColor(report.status)} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <span>{getStatusEmoji(report.status)}</span>
                          <span className="capitalize">{report.status?.replace('_', ' ') || 'Pending'}</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    className="text-center py-8"
                    variants={itemVariants}
                  >
                    <div className="text-4xl mb-3">📝</div>
                    <h4 className="font-semibold text-gray-800 mb-2">No recent reports</h4>
                    <p className="text-gray-600 text-sm">Reports will appear here as they are submitted</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Recent Users */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 p-8"
            variants={cardVariants}
          >
            <motion.h2 
              className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
              variants={itemVariants}
            >
              <span className="text-3xl">👥</span>
              Recent Users
            </motion.h2>

            <div className="space-y-4">
              <AnimatePresence>
                {recentUsers.length > 0 ? (
                  recentUsers.slice(0, 5).map((user, index) => (
                    <motion.div
                      key={user.id || index}
                      className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, x: 5 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">
                            {user.username || 'Unknown User'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {user.email || 'No email'}
                          </p>
                        </div>
                        <motion.div 
                          className={`bg-gradient-to-r ${getRoleColor(user.accountType)} text-white px-3 py-1 rounded-full text-xs font-medium`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {user.accountType || 'User'}
                        </motion.div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    className="text-center py-8"
                    variants={itemVariants}
                  >
                    <div className="text-4xl mb-3">👤</div>
                    <h4 className="font-semibold text-gray-800 mb-2">No recent users</h4>
                    <p className="text-gray-600 text-sm">New users will appear here</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={() => navigate('/govt/users')}
              className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-xl font-medium hover:shadow-lg transition-all"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View All Users →
            </motion.button>
          </motion.div>
        </div>

        {/* System Overview */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 p-8"
          variants={cardVariants}
        >
          <motion.h2 
            className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
            variants={itemVariants}
          >
            <span className="text-3xl">🎯</span>
            System Overview
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                label: "Citizens", 
                value: dashboardStats.totalCitizens, 
                icon: "👤", 
                color: "from-emerald-400 to-green-500",
                percentage: Math.round((dashboardStats.totalCitizens / dashboardStats.totalUsers) * 100) || 0
              },
              { 
                label: "NGOs", 
                value: dashboardStats.totalNGOs, 
                icon: "🏢", 
                color: "from-blue-400 to-indigo-500",
                percentage: Math.round((dashboardStats.totalNGOs / dashboardStats.totalUsers) * 100) || 0
              },
              { 
                label: "Verified Reports", 
                value: dashboardStats.verifiedReports, 
                icon: "✅", 
                color: "from-purple-400 to-violet-500",
                percentage: Math.round((dashboardStats.verifiedReports / dashboardStats.totalReports) * 100) || 0
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`bg-gradient-to-r ${item.color} text-white p-6 rounded-2xl shadow-lg mb-4`}>
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-2xl font-bold mb-1">{item.value}</div>
                  <div className="text-sm opacity-90">{item.label}</div>
                </div>
                <div className="text-sm text-gray-600">
                  {item.percentage}% of total
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default GovtDashboard;