import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { BACKEND_URL } from "../../constant";

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

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/leaderboard`);
        if (res.data.success) {
          // sort in descending order by ecoPoints
          const sortedData = res.data.data.sort((a, b) => b.ecoPoints - a.ecoPoints);
          setLeaders(sortedData);
        } else {
          setError("Failed to fetch leaderboard");
        }
      } catch (err) {
        setError("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return "🏅";
    }
  };

  const getRankGradient = (rank) => {
    switch (rank) {
      case 1: return "from-yellow-400 to-orange-500";
      case 2: return "from-gray-300 to-gray-500";
      case 3: return "from-orange-400 to-red-500";
      default: return "from-emerald-400 to-blue-500";
    }
  };

  const getPointsColor = (points) => {
    if (points >= 1000) return "text-emerald-600";
    if (points >= 500) return "text-blue-600";
    if (points >= 100) return "text-purple-600";
    return "text-gray-600";
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="min-h-screen p-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="h-12 bg-gray-200 rounded-xl animate-pulse mx-auto w-64 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded-lg animate-pulse mx-auto w-96"></div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 p-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 p-6 mb-4 bg-gray-50 rounded-2xl animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded-lg w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-32"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded-full w-24"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <motion.div
          className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 p-8 text-center max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen p-4">
      <motion.div
        className="max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-4 rounded-3xl shadow-xl mb-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
                ease: "easeInOut"
              }}
            >
              🌍
            </motion.span>
            <h1 className="text-3xl font-bold">Eco Champions Leaderboard</h1>
          </motion.div>
          <motion.p
            className="text-gray-600 text-lg max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Celebrating our environmental heroes making a difference in the world! 🌱
          </motion.p>
        </motion.div>

        {/* Leaderboard Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 overflow-hidden"
          variants={cardVariants}
        >
          {/* Top 3 Podium */}
          {leaders.length >= 3 && (
            <motion.div
              className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 p-8 text-white relative overflow-hidden"
              variants={itemVariants}
            >
              {/* Animated background elements */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(15)].map((_, i) => (
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

              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-center mb-8">🏆 Top Champions 🏆</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 2nd Place */}
                  <motion.div
                    className="order-1 md:order-1 text-center"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 h-48 flex flex-col justify-center">
                      <div className="text-4xl mb-2">🥈</div>
                      <h3 className="font-bold text-lg mb-1">{leaders[1]?.name}</h3>
                      <div className="bg-white/30 rounded-full px-4 py-2 inline-block">
                        <span className="font-bold">{leaders[1]?.ecoPoints} pts</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* 1st Place */}
                  <motion.div
                    className="order-2 md:order-2 text-center"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 h-56 flex flex-col justify-center border-2 border-white/50">
                      <motion.div
                        className="text-5xl mb-2"
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        🥇
                      </motion.div>
                      <h3 className="font-bold text-xl mb-2">{leaders[0]?.name}</h3>
                      <div className="bg-yellow-400 text-yellow-900 rounded-full px-4 py-2 inline-block font-bold">
                        {leaders[0]?.ecoPoints} pts
                      </div>
                      <div className="text-sm mt-2 opacity-90">👑 Champion</div>
                    </div>
                  </motion.div>

                  {/* 3rd Place */}
                  <motion.div
                    className="order-3 md:order-3 text-center"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 h-48 flex flex-col justify-center">
                      <div className="text-4xl mb-2">🥉</div>
                      <h3 className="font-bold text-lg mb-1">{leaders[2]?.name}</h3>
                      <div className="bg-white/30 rounded-full px-4 py-2 inline-block">
                        <span className="font-bold">{leaders[2]?.ecoPoints} pts</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Full Leaderboard */}
          <div className="p-8">
            <motion.h3
              className="text-2xl font-bold text-gray-800 mb-6 text-center"
              variants={itemVariants}
            >
              Complete Rankings
            </motion.h3>

            <div className="space-y-4">
              <AnimatePresence>
                {leaders.map((leader, index) => (
                  <motion.div
                    key={index}
                    className="group relative bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-6">
                      {/* Rank Badge */}
                      <motion.div
                        className={`w-16 h-16 rounded-full bg-gradient-to-r ${getRankGradient(index + 1)} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-2xl">{getRankIcon(index + 1)}</span>
                      </motion.div>

                      {/* User Info */}
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-800 mb-1">
                          {leader.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-sm">Rank #{index + 1}</span>
                          {index < 3 && (
                            <motion.span
                              className="bg-gradient-to-r from-emerald-400 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulseRing"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              Top Performer
                            </motion.span>
                          )}
                        </div>
                      </div>

                      {/* Points Badge */}
                      <motion.div
                        className={`bg-gradient-to-r ${getRankGradient(index + 1)} text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center gap-2">
                          <span>🌟</span>
                          <span>{leader.ecoPoints}</span>
                          <span className="text-sm opacity-90">pts</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Hover effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1 }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty state */}
            {leaders.length === 0 && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No champions yet!</h3>
                <p className="text-gray-600">Be the first to make a difference and earn eco points!</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Stats Footer */}
        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {[
            { icon: "👥", label: "Total Champions", value: leaders.length, color: "from-blue-500 to-purple-500" },
            { icon: "🌟", label: "Total Points", value: leaders.reduce((sum, leader) => sum + leader.ecoPoints, 0), color: "from-emerald-500 to-teal-500" },
            { icon: "🏆", label: "Top Score", value: leaders[0]?.ecoPoints || 0, color: "from-yellow-500 to-orange-500" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className={`bg-gradient-to-r ${stat.color} text-white p-6 rounded-2xl shadow-lg text-center`}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold mb-1">{stat.value.toLocaleString()}</div>
              <div className="text-sm opacity-90">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-pulseRing {
          animation: pulseRing 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default Leaderboard;