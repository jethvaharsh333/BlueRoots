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
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
};

const cardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
};

const CitizenDashboard = () => {
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState({ ecoPoints: 0, reportsSubmitted: 0, rank: "N/A" });
  const [recentReports, setRecentReports] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // ✅ Fetch current user
      const userRes = await axiosClient.get(`${BACKEND_URL}/user/current`);
      const userData = userRes.data.data;
      setUser(userData);

      // ✅ Fetch citizen dashboard
      const dashboardRes = await axiosClient.get(`${BACKEND_URL}/user/citizen`);
      const dashboardData = dashboardRes.data.data;

      setUserStats({
        ecoPoints: dashboardData.stats.ecoPoints || 0,
        reportsSubmitted: dashboardData.stats.reportsSubmitted || 0,
        rank: "N/A", // leaderboard empty for now
      });

      setRecentReports(dashboardData.recentReports || []);
      setLeaderboard(dashboardData.leaderboard || []);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "from-yellow-400 to-orange-500";
      case "verified":
        return "from-green-400 to-emerald-500";
      case "action_taken":
        return "from-blue-400 to-purple-500";
      case "rejected":
        return "from-red-400 to-pink-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  const getStatusEmoji = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "⏳";
      case "verified":
        return "✅";
      case "action_taken":
        return "🚀";
      case "rejected":
        return "❌";
      default:
        return "📋";
    }
  };

  const getCategoryEmoji = (category) => {
    switch (category?.toLowerCase()) {
      case "cutting":
        return "🌳";
      case "dumping":
        return "🗑";
      case "pollution":
        return "☁";
      case "land_clearing":
        return "🚜";
      default:
        return "📋";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 👤 User Greeting */}
        <motion.h2 className="text-2xl font-bold mb-6" variants={itemVariants}>
          Welcome back, {user?.username || "Citizen"} 👋
        </motion.h2>

        {/* 📊 Stats Section */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10" variants={containerVariants}>
          <motion.div
            className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-6 rounded-xl shadow-lg"
            variants={cardVariants}
          >
            <h3 className="text-lg">Eco Points</h3>
            <p className="text-3xl font-bold">{userStats.ecoPoints}</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white p-6 rounded-xl shadow-lg"
            variants={cardVariants}
          >
            <h3 className="text-lg">Reports Submitted</h3>
            <p className="text-3xl font-bold">{userStats.reportsSubmitted}</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-purple-400 to-pink-500 text-white p-6 rounded-xl shadow-lg"
            variants={cardVariants}
          >
            <h3 className="text-lg">Leaderboard Rank</h3>
            <p className="text-3xl font-bold">{userStats.rank}</p>
          </motion.div>
        </motion.div>

        {/* 📄 Recent Reports */}
        <motion.div variants={itemVariants}>
          <h3 className="text-xl font-semibold mb-4">Recent Reports</h3>
          <AnimatePresence>
            {recentReports.length > 0 ? (
              recentReports.map((report) => (
                <motion.div
                  key={report._id}
                  className={`bg-gradient-to-r ${getStatusColor(report.status)} text-white p-4 rounded-xl mb-3 shadow-md`}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">
                      {getCategoryEmoji(report.category)} {report.category}
                    </span>
                    <span className="text-sm">
                      {getStatusEmoji(report.status)} {report.status}
                    </span>
                  </div>
                  <p className="text-xs opacity-80 mt-1">
                    {new Date(report.createdAt).toLocaleString()}
                  </p>
                </motion.div>
              ))
            ) : (
              <motion.p className="text-gray-500">No recent reports found.</motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        
      </motion.div>
    </div>
  );
};

export default CitizenDashboard;
