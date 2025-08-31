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

const CitizenDashboard = () => {
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState({
    ecoPoints: 0,
    reportsSubmitted: 0,
    rank: 0
  });
  const [recentReports, setRecentReports] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch user data first
        const userRes = await axiosClient.get(`${BACKEND_URL}/user/current`);
        const userData = userRes.data.data;
        setUser(userData);
        
        // Set initial user stats from user profile data
        console.log("User data received:", userData);
        setUserStats({
          ecoPoints: userData.ecoPoints || 0,
          reportsSubmitted: 0,
          rank: 'N/A'
        });

        // Fetch citizen dashboard data from the actual API
        try {
          const dashboardRes = await axiosClient.get(`${BACKEND_URL}/dashboard/citizen`);
          const dashboardData = dashboardRes.data.data;
          console.log("Dashboard data received:", dashboardData);
          
          // Update user stats from dashboard data
          setUserStats({
            ecoPoints: dashboardData.stats.ecoPoints || userData.ecoPoints || 0,
            reportsSubmitted: dashboardData.stats.reportsSubmitted || 0,
            rank: 0 // Will be calculated from leaderboard
          });
          
          // Set recent reports
          setRecentReports(dashboardData.recentReports || []);
          
          // Set leaderboard data and calculate user rank
          const leaderboardData = dashboardData.leaderboard || [];
          setLeaderboard(leaderboardData.slice(0, 3));
          
          // Calculate user's rank from full leaderboard
          const userRank = leaderboardData.findIndex(user => user._id === userData._id || user.name === userData.username) + 1;
          setUserStats(prev => ({
            ...prev,
            rank: userRank > 0 ? userRank : 'N/A'
          }));
          
        } catch (error) {
          console.log("Dashboard endpoint not available, using individual endpoints and user data");
          console.log("Dashboard API error:", error);
          
          // Use user data directly for eco points
          setUserStats({
            ecoPoints: userData.ecoPoints || 0,
            reportsSubmitted: 0, // Will be updated from reports endpoint
            rank: 'N/A'
          });
          
          // Fallback to individual endpoints
          try {
            // Get recent reports for display
            const reportsRes = await axiosClient.get(`${BACKEND_URL}/reports/my-reports?limit=4`);
            const reports = reportsRes.data.data || [];
            setRecentReports(reports);
            
            // Get total count of all user reports
            try {
              const allReportsRes = await axiosClient.get(`${BACKEND_URL}/reports/my-reports`);
              const allReports = allReportsRes.data.data || [];
              setUserStats(prev => ({
                ...prev,
                reportsSubmitted: allReports.length
              }));
            } catch (countError) {
              // If we can't get all reports, use the recent reports count as fallback
              console.log("Could not fetch all reports count, using recent reports count");
              setUserStats(prev => ({
                ...prev,
                reportsSubmitted: reports.length
              }));
            }
          } catch (error) {
            console.log("Reports endpoint error:", error);
          }

          try {
            const leaderboardRes = await axiosClient.get(`${BACKEND_URL}/leaderboard`);
            if (leaderboardRes.data.success) {
              const sortedData = leaderboardRes.data.data.sort((a, b) => b.ecoPoints - a.ecoPoints);
              setLeaderboard(sortedData.slice(0, 3));
              
              // Calculate user's rank from leaderboard
              const userRank = sortedData.findIndex(user => user._id === userData._id || user.name === userData.username) + 1;
              setUserStats(prev => ({
                ...prev,
                rank: userRank > 0 ? userRank : 'N/A'
              }));
            }
          } catch (error) {
            console.log("Leaderboard endpoint error:", error);
          }
        }

      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

  // Manual refresh function
  const refreshDashboard = () => {
    fetchDashboardData();
  };

  useEffect(() => {
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

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header skeleton */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 p-8">
          <div className="h-8 bg-gray-200 rounded-xl animate-pulse w-64 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-96"></div>
        </div>
        
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
    <div className="min-h-screen p-4">
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
          <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 p-8 text-white relative overflow-hidden">
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
                👋
              </motion.div>
              <div className="text-center md:text-left flex-1">
                <motion.h1 
                  className="text-3xl md:text-4xl font-bold mb-2"
                  variants={itemVariants}
                >
                  {greeting}, {user?.username || 'Eco Champion'}!
                </motion.h1>
                <motion.p 
                  className="text-blue-100 text-lg"
                  variants={itemVariants}
                >
                  Ready to make a positive impact on our environment today? 🌱
                </motion.p>
              </div>
              
              {/* Refresh Button */}
              <motion.button
                onClick={refreshDashboard}
                className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl transition-all duration-200 flex items-center gap-2"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                <motion.span
                  animate={loading ? { rotate: 360 } : {}}
                  transition={loading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                  className="text-xl"
                >
                  🔄
                </motion.span>
                <span className="text-sm font-medium">Refresh</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Impact Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {[
            { 
              icon: "🌟", 
              label: "Eco Points", 
              value: userStats.ecoPoints || 0, 
              color: "from-emerald-500 to-teal-500",
              description: "Points earned"
            },
            { 
              icon: "📊", 
              label: "Reports Submitted", 
              value: userStats.reportsSubmitted || recentReports.length, 
              color: "from-blue-500 to-purple-500",
              description: "Total reports"
            },
            { 
              icon: "🏆", 
              label: "Current Rank", 
              value: userStats.rank || "N/A", 
              color: "from-yellow-500 to-orange-500",
              description: "Leaderboard position"
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

        {/* Quick Actions & Recent Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            
            <motion.button
              onClick={() => navigate('/reports/new')}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white p-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center gap-4">
                <motion.span 
                  className="text-3xl"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  📝
                </motion.span>
                <span>Report a New Incident</span>
                <motion.span 
                  className="text-2xl"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  →
                </motion.span>
              </div>
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer opacity-0 group-hover:opacity-30"></div>
            </motion.button>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <motion.button
                onClick={() => navigate('/leaderboard')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl font-medium hover:shadow-lg transition-all"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-2xl mb-2">🏆</div>
                <div>View Leaderboard</div>
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/chat-bot')}
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-4 rounded-xl font-medium hover:shadow-lg transition-all"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-2xl mb-2">🤖</div>
                <div>Ask AI Assistant</div>
              </motion.button>
            </div>
          </motion.div>

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
              My Recent Reports
            </motion.h2>

            <div className="space-y-4">
              <AnimatePresence>
                {recentReports.length > 0 ? (
                  recentReports.slice(0, 4).map((report, index) => (
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
                            {report.notes || 'No description provided'}
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
                    <h4 className="font-semibold text-gray-800 mb-2">No reports yet</h4>
                    <p className="text-gray-600 text-sm">Start making a difference by reporting your first incident!</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {recentReports.length > 0 && (
              <motion.button
                onClick={() => navigate('/reports')}
                className="w-full mt-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 p-3 rounded-xl font-medium hover:from-gray-200 hover:to-gray-300 transition-all"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View All Reports →
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Leaderboard Snippet */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 overflow-hidden"
          variants={cardVariants}
        >
          <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-6 text-white">
            <motion.h2 
              className="text-2xl font-bold flex items-center gap-3"
              variants={itemVariants}
            >
              <motion.span 
                className="text-3xl"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                🏆
              </motion.span>
              Top Eco Champions
            </motion.h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-3">
              {leaderboard.length > 0 ? (
                leaderboard.map((leader, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <div className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{leader.name}</h4>
                      <p className="text-sm text-gray-600">Rank #{index + 1}</p>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-xl font-bold">
                      {leader.ecoPoints} pts
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <div className="text-4xl mb-3">🌱</div>
                  <p>Leaderboard coming soon!</p>
                </div>
              )}
            </div>
            
            <motion.button
              onClick={() => navigate('/leaderboard')}
              className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white p-3 rounded-xl font-medium hover:shadow-lg transition-all"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Full Leaderboard →
            </motion.button>
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

export default CitizenDashboard;