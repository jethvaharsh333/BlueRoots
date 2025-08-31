import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosClient from "../../utils/axiosClient";
import { BACKEND_URL } from "../../constant";
import toast from "react-hot-toast";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

const GovernmentDashboard = () => {
  const [stats, setStats] = useState({ newAlerts: 0, underInvestigation: 0 });
  const [priorityAlerts, setPriorityAlerts] = useState([]);
  const [recentlyUpdated, setRecentlyUpdated] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`${BACKEND_URL}/user/government`);
      const data = res.data.data;

      setStats(data.stats || { newAlerts: 0, underInvestigation: 0 });
      setPriorityAlerts(data.priorityAlerts || []);
      setRecentlyUpdated(data.recentlyUpdatedAlerts || []);
    } catch (error) {
      console.error("Government dashboard fetch error:", error);
      toast.error("Failed to load government dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "new":
        return "text-blue-600";
      case "investigating":
        return "text-orange-600";
      case "resolved":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <motion.div
      className="p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-2xl font-bold mb-6">Government Dashboard</h1>

      {/* Stats Section */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        variants={containerVariants}
      >
        <motion.div
          className="bg-white shadow rounded-lg p-4"
          variants={itemVariants}
        >
          <h2 className="text-gray-600">🆕 New Alerts</h2>
          <p className="text-3xl font-bold">{stats.newAlerts}</p>
        </motion.div>
        <motion.div
          className="bg-white shadow rounded-lg p-4"
          variants={itemVariants}
        >
          <h2 className="text-gray-600">🔍 Under Investigation</h2>
          <p className="text-3xl font-bold">{stats.underInvestigation}</p>
        </motion.div>
      </motion.div>

      {/* Priority Alerts */}
      <motion.div className="mb-6" variants={itemVariants}>
        <h2 className="text-xl font-semibold mb-3">🚨 Priority Alerts</h2>
        <div className="space-y-3">
          {priorityAlerts.map((alert) => (
            <motion.div
              key={alert._id}
              className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
              variants={itemVariants}
            >
              <div>
                <p className="font-bold">{alert.title}</p>
                <p className="text-sm text-gray-500">
                  {new Date(alert.createdAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`text-white text-xs px-3 py-1 rounded ${getSeverityColor(
                  alert.severity
                )}`}
              >
                {alert.severity}
              </span>
            </motion.div>
          ))}
          {priorityAlerts.length === 0 && (
            <p className="text-gray-500 text-sm">No priority alerts</p>
          )}
        </div>
      </motion.div>

      {/* Recently Updated Alerts */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold mb-3">
          📋 Recently Updated Alerts
        </h2>
        <div className="space-y-3">
          {recentlyUpdated.map((alert) => (
            <motion.div
              key={alert._id}
              className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
              variants={itemVariants}
            >
              <div>
                <p className="font-bold">{alert.title}</p>
                <p className="text-sm text-gray-500">
                  Updated: {new Date(alert.updatedAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`text-xs font-semibold ${getStatusColor(
                  alert.status
                )}`}
              >
                {alert.status}
              </span>
            </motion.div>
          ))}
          {recentlyUpdated.length === 0 && (
            <p className="text-gray-500 text-sm">No recent updates</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GovernmentDashboard;
