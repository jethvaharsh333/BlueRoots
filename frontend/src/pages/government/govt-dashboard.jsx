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
  const [dashboardData, setDashboardData] = useState({
    stats: {
      newAlerts: 0,
      activeCases: 0
    },
    priorityAlerts: [],
    recentActions: []
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch government dashboard data from the actual API
      const dashboardRes = await axiosClient.get(`${BACKEND_URL}/dashboard/government`);
      const data = dashboardRes.data.data;

      console.log("Government dashboard data received:", data);
      setDashboardData(data);
      setLastUpdated(new Date());

      if (!loading) { // Only show success toast on manual refresh, not initial load
        toast.success("Dashboard updated successfully");
      }

    } catch (error) {
      console.error("Dashboard data fetch error:", error);

      // Try to get individual data if dashboard endpoint fails
      try {
        console.log("Trying individual endpoints as fallback...");

        // Get alerts data
        let alertsData = { stats: { newAlerts: 0, activeCases: 0 }, priorityAlerts: [], recentActions: [] };

        try {
          const alertsRes = await axiosClient.get(`${BACKEND_URL}/alerts`);
          const alerts = alertsRes.data.data || [];
          const newAlerts = alerts.filter(alert => alert.status === 'NEW');

          alertsData.stats.newAlerts = newAlerts.length;
          alertsData.priorityAlerts = newAlerts.slice(0, 5);

          console.log("Alerts data fetched:", alertsData);
        } catch (alertError) {
          console.log("Alerts endpoint error:", alertError);
        }

        // Get cases data if available
        try {
          const casesRes = await axiosClient.get(`${BACKEND_URL}/cases/my-cases`);
          const cases = casesRes.data.data || [];
          const activeCases = cases.filter(c => ['OPEN', 'IN_PROGRESS'].includes(c.status));

          alertsData.stats.activeCases = activeCases.length;
          alertsData.recentActions = activeCases.slice(0, 5).map(c => ({
            caseId: c._id,
            alertTitle: c.alert?.title || 'Case Investigation',
            lastAction: c.actionLog?.[c.actionLog.length - 1] || { action: 'Case opened' },
            caseStatus: c.status,
            lastUpdate: c.updatedAt
          }));

          console.log("Cases data fetched:", alertsData);
        } catch (caseError) {
          console.log("Cases endpoint error:", caseError);
        }

        setDashboardData(alertsData);
        setLastUpdated(new Date());

      } catch (fallbackError) {
        console.error("All endpoints failed, using mock data");
        if (!loading) {
          toast.error("Unable to fetch real-time data, showing sample data");
        }

        // Enhanced fallback mock data
        setDashboardData({
          stats: {
            newAlerts: 7,
            activeCases: 12
          },
          priorityAlerts: [
            {
              _id: '1',
              title: 'Illegal Tree Cutting in Forest Area',
              severity: 'HIGH',
              createdAt: new Date().toISOString(),
              createdBy: { name: 'Green NGO' }
            },
            {
              _id: '2',
              title: 'Industrial Waste Dumping',
              severity: 'CRITICAL',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              createdBy: { name: 'EcoWatch' }
            },
            {
              _id: '3',
              title: 'Water Pollution in River',
              severity: 'HIGH',
              createdAt: new Date(Date.now() - 172800000).toISOString(),
              createdBy: { name: 'River Watch NGO' }
            }
          ],
          recentActions: [
            {
              caseId: '1',
              alertTitle: 'Pollution Report Investigation',
              lastAction: { action: 'Site inspection completed', timestamp: new Date().toISOString() },
              caseStatus: 'IN_PROGRESS',
              lastUpdate: new Date().toISOString()
            },
            {
              caseId: '2',
              alertTitle: 'Forest Deforestation Case',
              lastAction: { action: 'Evidence collected', timestamp: new Date(Date.now() - 86400000).toISOString() },
              caseStatus: 'OPEN',
              lastUpdate: new Date(Date.now() - 86400000).toISOString()
            }
          ]
        });
        setLastUpdated(new Date());
      }
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh function
  const refreshDashboard = () => {
    fetchDashboardData();
  };

  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    toast.success(autoRefresh ? "Auto-refresh disabled" : "Auto-refresh enabled");
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchDashboardData();

    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        console.log("Auto-refreshing government dashboard...");
        fetchDashboardData();
      }, 30000); // 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'from-blue-400 to-blue-500';
      case 'in_progress': return 'from-yellow-400 to-orange-500';
      case 'closed': return 'from-green-400 to-emerald-500';
      case 'pending': return 'from-yellow-400 to-orange-500';
      case 'verified': return 'from-green-400 to-emerald-500';
      case 'action_taken': return 'from-blue-400 to-purple-500';
      case 'rejected': return 'from-red-400 to-pink-500';
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
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          {[
            {
              icon: "🚨",
              label: "New Alerts",
              value: dashboardData.stats.newAlerts,
              color: "from-red-500 to-pink-500",
              description: "Require immediate attention"
            },
            {
              icon: "📋",
              label: "Active Cases",
              value: dashboardData.stats.activeCases,
              color: "from-blue-500 to-purple-500",
              description: "Currently being handled"
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
          {/* Priority Alerts */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 p-8"
            variants={cardVariants}
          >
            <motion.h2
              className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
              variants={itemVariants}
            >
              <span className="text-3xl">🚨</span>
              Priority Alerts
            </motion.h2>

            <div className="space-y-4">
              <AnimatePresence>
                {dashboardData.priorityAlerts.length > 0 ? (
                  dashboardData.priorityAlerts.map((alert, index) => (
                    <motion.div
                      key={alert._id || index}
                      className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, x: 5 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">
                          {alert.severity === 'CRITICAL' ? '🔴' : alert.severity === 'HIGH' ? '🟠' : '🟡'}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">
                            {alert.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            By: {alert.createdBy?.name || 'Anonymous'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(alert.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <motion.div
                          className={`bg-gradient-to-r ${alert.severity === 'CRITICAL' ? 'from-red-500 to-red-600' :
                            alert.severity === 'HIGH' ? 'from-orange-500 to-red-500' :
                              'from-yellow-500 to-orange-500'
                            } text-white px-3 py-1 rounded-full text-xs font-medium`}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {alert.severity}
                        </motion.div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="text-center py-8"
                    variants={itemVariants}
                  >
                    <div className="text-4xl mb-3">✅</div>
                    <h4 className="font-semibold text-gray-800 mb-2">No priority alerts</h4>
                    <p className="text-gray-600 text-sm">All alerts have been addressed</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={() => navigate('/govt/alerts')}
              className="w-full mt-4 bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-xl font-medium hover:shadow-lg transition-all"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View All Alerts →
            </motion.button>
          </motion.div>

          {/* Recent Actions */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 p-8"
            variants={cardVariants}
          >
            <motion.h2
              className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
              variants={itemVariants}
            >
              <span className="text-3xl">⚡</span>
              Recent Actions
            </motion.h2>

            <div className="space-y-4">
              <AnimatePresence>
                {dashboardData.recentActions.length > 0 ? (
                  dashboardData.recentActions.map((action, index) => (
                    <motion.div
                      key={action.caseId || index}
                      className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, x: 5 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">
                          {action.caseStatus === 'IN_PROGRESS' ? '🔄' :
                            action.caseStatus === 'OPEN' ? '📂' : '✅'}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">
                            {action.alertTitle}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {action.lastAction?.action || 'No action recorded'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(action.lastUpdate).toLocaleDateString()}
                          </p>
                        </div>
                        <motion.div
                          className={`bg-gradient-to-r ${getStatusColor(action.caseStatus)} text-white px-3 py-1 rounded-full text-xs font-medium`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {action.caseStatus?.replace('_', ' ')}
                        </motion.div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="text-center py-8"
                    variants={itemVariants}
                  >
                    <div className="text-4xl mb-3">📋</div>
                    <h4 className="font-semibold text-gray-800 mb-2">No recent actions</h4>
                    <p className="text-gray-600 text-sm">Case actions will appear here</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={() => navigate('/govt/case-management')}
              className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-xl font-medium hover:shadow-lg transition-all"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Case Management →
            </motion.button>
          </motion.div>
        </div>

        {/* System Status & Controls */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 p-8"
          variants={cardVariants}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <motion.h2
              className="text-2xl font-bold text-gray-800 flex items-center gap-3"
              variants={itemVariants}
            >
              <span className="text-3xl">📊</span>
              System Status
            </motion.h2>

            {/* Refresh Controls */}
            <div className="flex items-center gap-3">
              <motion.button
                onClick={refreshDashboard}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">🔄</span>
                Refresh
              </motion.button>

              <motion.button
                onClick={toggleAutoRefresh}
                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${autoRefresh
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">{autoRefresh ? '⏸️' : '▶️'}</span>
                Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
              </motion.button>

              {lastUpdated && (
                <motion.div
                  className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg"
                  variants={itemVariants}
                >
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </motion.div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="text-center p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl mb-3">🎯</div>
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                {dashboardData.stats.activeCases}
              </div>
              <div className="text-sm text-emerald-700">Active Cases Being Handled</div>
            </motion.div>

            <motion.div
              className="text-center p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl mb-3">⚠️</div>
              <div className="text-2xl font-bold text-red-600 mb-1">
                {dashboardData.stats.newAlerts}
              </div>
              <div className="text-sm text-red-700">New Alerts Requiring Attention</div>
            </motion.div>
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