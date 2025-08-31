import { useState } from "react";
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

const GovtAddUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "CITIZEN", // default value
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or error

  // Role options with visual enhancements
  const roleOptions = [
    { value: "CITIZEN", label: "Citizen", icon: "👤", color: "from-emerald-500 to-green-600", description: "Regular platform user who can report incidents" },
    { value: "NGO", label: "NGO", icon: "🏢", color: "from-blue-500 to-indigo-600", description: "Non-governmental organization with verification rights" },
  ];

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axiosClient.post(
        `${BACKEND_URL}/admin/create-user`,
        formData
      );
      
      if (res.data.success) {
        setMessage("User created successfully! 🎉");
        setMessageType("success");
        setFormData({ username: "", email: "", role: "CITIZEN" });
        toast.success("User created successfully!");
      } else {
        setMessage("Failed to create user ❌");
        setMessageType("error");
        toast.error("Failed to create user");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      setMessage(errorMessage + " ❌");
      setMessageType("error");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = roleOptions.find(role => role.value === formData.role);
  const isFormValid = formData.username && formData.email && formData.role;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 overflow-hidden mb-8"
          variants={cardVariants}
        >
          <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 p-8 text-white relative overflow-hidden">
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
                👤
              </motion.div>
              <div className="text-center md:text-left">
                <motion.h1 
                  className="text-3xl md:text-4xl font-bold mb-2"
                  variants={itemVariants}
                >
                  Add New User
                </motion.h1>
                <motion.p 
                  className="text-purple-100 text-lg"
                  variants={itemVariants}
                >
                  Create new accounts for citizens and NGOs to join the platform
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 overflow-hidden"
          variants={cardVariants}
        >
          <div className="p-8">
            {/* Success/Error Message */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mb-6 p-4 rounded-2xl border ${
                    messageType === "success"
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {messageType === "success" ? "✅" : "❌"}
                    </span>
                    <span className="font-medium">{message}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <span className="flex items-center gap-2">
                    👤 Username
                  </span>
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter unique username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 p-4 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-lg"
                  required
                  disabled={loading}
                />
              </motion.div>

              {/* Email */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <span className="flex items-center gap-2">
                    📧 Email Address
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter valid email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 p-4 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-lg"
                  required
                  disabled={loading}
                />
              </motion.div>

              {/* Role Selection */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  <span className="flex items-center gap-2">
                    🏷️ User Role
                  </span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roleOptions.map((role, index) => (
                    <motion.label
                      key={role.value}
                      className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 ${
                        formData.role === role.value
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={formData.role === role.value}
                        onChange={handleChange}
                        className="sr-only"
                        required
                        disabled={loading}
                      />
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${role.color} flex items-center justify-center text-white text-xl shadow-lg`}>
                          {role.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 text-lg mb-1">{role.label}</h3>
                          <p className="text-sm text-gray-600">{role.description}</p>
                        </div>
                      </div>
                      {formData.role === role.value && (
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.label>
                  ))}
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all relative overflow-hidden ${
                    loading || !isFormValid
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                  }`}
                  whileHover={!loading && isFormValid ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!loading && isFormValid ? { scale: 0.98 } : {}}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Creating User...
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      🚀 Create User Account
                    </span>
                  )}
                  
                  {/* Shimmer effect for valid form */}
                  {!loading && isFormValid && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer opacity-30"></div>
                  )}
                </motion.button>
              </motion.div>

              {/* Form Progress Indicator */}
              <motion.div 
                className="flex justify-center mt-6"
                variants={itemVariants}
              >
                <div className="flex gap-4">
                  {[
                    { complete: !!formData.username, label: "Username", icon: "👤" },
                    { complete: !!formData.email, label: "Email", icon: "📧" },
                    { complete: !!formData.role, label: "Role", icon: "🏷️" }
                  ].map((step, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <motion.div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                          step.complete 
                            ? 'bg-green-500 text-white shadow-lg' 
                            : 'bg-gray-200 text-gray-400'
                        }`}
                        animate={step.complete ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {step.complete ? '✓' : step.icon}
                      </motion.div>
                      <span className={`text-xs font-medium ${step.complete ? 'text-green-600' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </form>
          </div>

          {/* Selected Role Preview */}
          {selectedRole && (
            <motion.div 
              className="px-8 pb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`bg-gradient-to-r ${selectedRole.color} rounded-2xl p-6 text-white shadow-lg`}>
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{selectedRole.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg">Selected: {selectedRole.label}</h3>
                    <p className="text-sm opacity-90">{selectedRole.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
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

export default GovtAddUser;
