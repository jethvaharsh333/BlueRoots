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

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`${BACKEND_URL}/admin/users`);
        setUsers(res.data.data || []);
        setFilteredUsers(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to load users");
        // Mock data for demonstration
        const mockUsers = [
          {
            id: 1,
            username: "john_doe",
            email: "john@example.com",
            accountType: "CITIZEN",
            createdAt: "2024-01-15T10:30:00Z",
            isActive: true,
            ecoPoints: 1250
          },
          {
            id: 2,
            username: "green_ngo",
            email: "contact@greenngo.org",
            accountType: "NGO",
            createdAt: "2024-01-10T14:20:00Z",
            isActive: true,
            ecoPoints: 0
          },
          {
            id: 3,
            username: "eco_warrior",
            email: "warrior@eco.com",
            accountType: "CITIZEN",
            createdAt: "2024-01-20T09:15:00Z",
            isActive: true,
            ecoPoints: 890
          }
        ];
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter and search users
  useEffect(() => {
    let filtered = users;

    // Filter by role
    if (filterRole !== "ALL") {
      filtered = filtered.filter(user => user.accountType === filterRole);
    }

    // Search by username or email
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort users
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
  }, [users, searchTerm, filterRole, sortBy, sortOrder]);

  const handleUserAction = async (userId, action) => {
    try {
      await axiosClient.patch(`${BACKEND_URL}/admin/users/${userId}`, { action });
      toast.success(`User ${action} successfully`);
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, isActive: action === 'activate' }
          : user
      ));
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      toast.error(`Failed to ${action} user`);
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

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'citizen': return '👤';
      case 'ngo': return '🏢';
      case 'government': return '🏛️';
      default: return '❓';
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
        
        {/* Users skeleton */}
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
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 p-8 text-white relative overflow-hidden">
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
                  👥 User Management
                </motion.h1>
                <motion.p 
                  className="text-blue-100 text-lg"
                  variants={itemVariants}
                >
                  Manage all platform users and their activities
                </motion.p>
              </div>
              
              {/* Stats */}
              <motion.div 
                className="flex gap-4 text-center"
                variants={itemVariants}
              >
                <div className="bg-white/20 rounded-2xl p-4">
                  <div className="text-2xl font-bold">{users.length}</div>
                  <div className="text-sm opacity-90">Total Users</div>
                </div>
                <div className="bg-white/20 rounded-2xl p-4">
                  <div className="text-2xl font-bold">{users.filter(u => u.isActive).length}</div>
                  <div className="text-sm opacity-90">Active</div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 p-6"
          variants={cardVariants}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <motion.div 
              className="flex-1 relative"
              variants={itemVariants}
            >
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all"
              />
              <div className="absolute right-3 top-3 text-gray-400">
                🔍
              </div>
            </motion.div>

            {/* Role Filter */}
            <motion.select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all"
              variants={itemVariants}
            >
              <option value="ALL">All Roles</option>
              <option value="CITIZEN">Citizens</option>
              <option value="NGO">NGOs</option>
              <option value="GOVERNMENT">Government</option>
            </motion.select>

            {/* Sort */}
            <motion.select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all"
              variants={itemVariants}
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="username-asc">Name A-Z</option>
              <option value="username-desc">Name Z-A</option>
              <option value="ecoPoints-desc">Highest Points</option>
            </motion.select>
          </div>
        </motion.div>

        {/* Users List */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 p-8"
          variants={cardVariants}
        >
          <motion.h2 
            className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
            variants={itemVariants}
          >
            <span className="text-3xl">📋</span>
            Users ({filteredUsers.length})
          </motion.h2>

          <div className="space-y-4">
            <AnimatePresence>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    className="group relative bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-6">
                      {/* Avatar */}
                      <motion.div 
                        className={`w-16 h-16 rounded-full bg-gradient-to-r ${getRoleColor(user.accountType)} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </motion.div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-gray-800">
                            {user.username}
                          </h4>
                          <motion.div 
                            className={`bg-gradient-to-r ${getRoleColor(user.accountType)} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}
                            whileHover={{ scale: 1.05 }}
                          >
                            <span>{getRoleIcon(user.accountType)}</span>
                            <span>{user.accountType}</span>
                          </motion.div>
                          {!user.isActive && (
                            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-1">{user.email}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>📅 Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                          {user.ecoPoints !== undefined && (
                            <span>🌟 {user.ecoPoints} eco points</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {user.isActive ? (
                          <motion.button
                            onClick={() => handleUserAction(user.id, 'deactivate')}
                            className="bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Deactivate
                          </motion.button>
                        ) : (
                          <motion.button
                            onClick={() => handleUserAction(user.id, 'activate')}
                            className="bg-green-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-600 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Activate
                          </motion.button>
                        )}
                        
                        <motion.button
                          className="bg-blue-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-600 transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Details
                        </motion.button>
                      </div>
                    </div>

                    {/* Hover effect */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1 }}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="text-center py-16"
                  variants={itemVariants}
                >
                  <div className="text-6xl mb-4">👤</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No users found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* User Statistics */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {[
            { 
              label: "Citizens", 
              count: users.filter(u => u.accountType === 'CITIZEN').length,
              icon: "👤", 
              color: "from-emerald-500 to-green-600"
            },
            { 
              label: "NGOs", 
              count: users.filter(u => u.accountType === 'NGO').length,
              icon: "🏢", 
              color: "from-blue-500 to-indigo-600"
            },
            { 
              label: "Government", 
              count: users.filter(u => u.accountType === 'GOVERNMENT').length,
              icon: "🏛️", 
              color: "from-purple-500 to-violet-600"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className={`bg-gradient-to-r ${stat.color} text-white p-6 rounded-3xl shadow-xl text-center`}
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
              <div className="text-3xl font-bold mb-1">{stat.count}</div>
              <div className="text-lg opacity-90">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Users;