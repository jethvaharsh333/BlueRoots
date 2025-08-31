import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const GovtAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    reportsByCategory: [],
    reportsByStatus: [],
    userGrowth: [],
    monthlyReports: [],
    topPerformers: [],
    environmentalImpact: {
      totalTreesSaved: 0,
      wasteReduced: 0,
      pollutionReports: 0,
      areasProtected: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // Fetch analytics data (you might need to create this endpoint)
        try {
          const analyticsRes = await axiosClient.get(`${BACKEND_URL}/admin/analytics?days=${timeRange}`);
          setAnalyticsData(analyticsRes.data.data);
        } catch (error) {
          console.log("Analytics endpoint not available, using mock data");
          // Mock data for demonstration
          setAnalyticsData({
            reportsByCategory: [
              { category: 'Tree Cutting', count: 45, percentage: 35 },
              { category: 'Waste Dumping', count: 32, percentage: 25 },
              { category: 'Pollution', count: 28, percentage: 22 },
              { category: 'Land Clearing', count: 23, percentage: 18 }
            ],
            reportsByStatus: [
              { status: 'Verified', count: 78, percentage: 61 },
              { status: 'Pending', count: 32, percentage: 25 },
              { status: 'Action Taken', count: 18, percentage: 14 }
            ],
            userGrowth: [
              { month: 'Jan', citizens: 120, ngos: 15 },
              { month: 'Feb', citizens: 145, ngos: 18 },
              { month: 'Mar', citizens: 178, ngos: 22 },
              { month: 'Apr', citizens: 203, ngos: 25 }
            ],
            monthlyReports: [
              { month: 'Jan', reports: 25 },
              { month: 'Feb', reports: 32 },
              { month: 'Mar', reports: 41 },
              { month: 'Apr', reports: 38 }
            ],
            topPerformers: [
              { name: 'EcoWarrior123', reports: 15, points: 1250 },
              { name: 'GreenGuardian', reports: 12, points: 980 },
              { name: 'NatureLover', reports: 10, points: 850 }
            ],
            environmentalImpact: {
              totalTreesSaved: 1247,
              wasteReduced: 3.2, // tons
              pollutionReports: 89,
              areasProtected: 15.7 // hectares
            }
          });
        }

      } catch (error) {
        console.error("Analytics data fetch error:", error);
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  const getCategoryColor = (index) => {
    const colors = [
      'from-emerald-500 to-teal-500',
      'from-blue-500 to-indigo-500',
      'from-purple-500 to-violet-500',
      'from-orange-500 to-red-500',
      'from-pink-500 to-rose-500'
    ];
    return colors[index % colors.length];
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified': return 'from-green-400 to-emerald-500';
      case 'pending': return 'from-yellow-400 to-orange-500';
      case 'action taken': return 'from-blue-400 to-purple-500';
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
        
        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 p-8">
              <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-48 mb-6"></div>
              <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <motion.div 
        className="max-w-7xl mx-auto space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 overflow-hidden"
          variants={cardVariants}
        >
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-white relative overflow-hidden">
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

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <motion.h1 
                  className="text-3xl md:text-4xl font-bold mb-2"
                  variants={itemVariants}
                >
                  📈 Analytics Dashboard
                </motion.h1>
                <motion.p 
                  className="text-purple-100 text-lg"
                  variants={itemVariants}
                >
                  Comprehensive insights into environmental reporting and platform performance
                </motion.p>
              </div>
              
              {/* Time Range Selector */}
              <motion.div 
                className="flex gap-2 bg-white/20 rounded-2xl p-2"
                variants={itemVariants}
              >
                {[
                  { label: '7D', value: '7' },
                  { label: '30D', value: '30' },
                  { label: '90D', value: '90' },
                  { label: '1Y', value: '365' }
                ].map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setTimeRange(range.value)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      timeRange === range.value 
                        ? 'bg-white text-purple-600 shadow-lg' 
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Environmental Impact Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {[
            { 
              icon: "🌳", 
              label: "Trees Saved", 
              value: analyticsData.environmentalImpact.totalTreesSaved, 
              color: "from-emerald-500 to-green-600",
              suffix: ""
            },
            { 
              icon: "♻️", 
              label: "Waste Reduced", 
              value: analyticsData.environmentalImpact.wasteReduced, 
              color: "from-blue-500 to-cyan-600",
              suffix: " tons"
            },
            { 
              icon: "🏞️", 
              label: "Areas Protected", 
              value: analyticsData.environmentalImpact.areasProtected, 
              color: "from-purple-500 to-violet-600",
              suffix: " hectares"
            },
            { 
              icon: "☁️", 
              label: "Pollution Reports", 
              value: analyticsData.environmentalImpact.pollutionReports, 
              color: "from-orange-500 to-red-600",
              suffix: ""
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className={`bg-gradient-to-r ${stat.color} text-white p-6 rounded-3xl shadow-xl relative overflow-hidden`}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
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
              <div className="text-2xl font-bold mb-1">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-sm opacity-90">{stat.label}</div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer opacity-30"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reports by Category */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 p-8"
            variants={cardVariants}
          >
            <motion.h2 
              className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
              variants={itemVariants}
            >
              <span className="text-3xl">📊</span>
              Reports by Category
            </motion.h2>

            <div className="space-y-4">
              {analyticsData.reportsByCategory.map((category, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">{category.category}</span>
                    <span className="text-sm text-gray-600">{category.count} reports</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${getCategoryColor(index)} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {category.percentage}%
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Reports by Status */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 p-8"
            variants={cardVariants}
          >
            <motion.h2 
              className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
              variants={itemVariants}
            >
              <span className="text-3xl">📋</span>
              Reports by Status
            </motion.h2>

            <div className="space-y-4">
              {analyticsData.reportsByStatus.map((status, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">{status.status}</span>
                    <span className="text-sm text-gray-600">{status.count} reports</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${getStatusColor(status.status)} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${status.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {status.percentage}%
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* User Growth */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 p-8"
            variants={cardVariants}
          >
            <motion.h2 
              className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
              variants={itemVariants}
            >
              <span className="text-3xl">👥</span>
              User Growth
            </motion.h2>

            <div className="space-y-4">
              {analyticsData.userGrowth.map((month, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{month.month}</span>
                    <div className="flex gap-4 text-sm">
                      <span className="text-emerald-600">👤 {month.citizens} Citizens</span>
                      <span className="text-blue-600">🏢 {month.ngos} NGOs</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top Performers */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 p-8"
            variants={cardVariants}
          >
            <motion.h2 
              className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
              variants={itemVariants}
            >
              <span className="text-3xl">🏆</span>
              Top Performers
            </motion.h2>

            <div className="space-y-4">
              {analyticsData.topPerformers.map((performer, index) => (
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
                    <h4 className="font-semibold text-gray-800">{performer.name}</h4>
                    <p className="text-sm text-gray-600">{performer.reports} reports</p>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {performer.points} pts
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Monthly Reports Trend */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 p-8"
          variants={cardVariants}
        >
          <motion.h2 
            className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
            variants={itemVariants}
          >
            <span className="text-3xl">📈</span>
            Monthly Reports Trend
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analyticsData.monthlyReports.map((month, index) => (
              <motion.div
                key={index}
                className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {month.reports}
                </div>
                <div className="text-sm text-gray-600">{month.month}</div>
                <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(month.reports / 50) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
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

export default GovtAnalytics;
