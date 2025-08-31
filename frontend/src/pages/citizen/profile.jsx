import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BACKEND_URL } from "../../constant";
import axiosClient from "../../utils/axiosClient";
import toast from "react-hot-toast";
import { UserRound, Pencil, KeyRound } from "lucide-react";
import { IconBadge } from "../../components/common/icon-badge";
import UpdateProfile from "./update-profile";
import UpdatePassword from "./update-password";

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

const avatarVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.3
    }
  }
};

const infoVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300
    }
  }
};

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [key, setKey] = useState(0); // Add a key to force re-render

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(BACKEND_URL + "/user/current");
        console.log(res.data);
        setUser(res.data.data);
        toast.success(res.data.message);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Function to handle save and refresh user data
  const handleSaveProfile = async () => {
    try {
      // Refresh user data after save
      const res = await axiosClient.get(BACKEND_URL + "/user/current");
      setUser(res.data.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsEditing(false);
      setKey(prev => prev + 1); // Force re-render
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setKey(prev => prev + 1); // Force re-render
  };

  const handleSavePassword = () => {
    setIsUpdatingPassword(false);
    setKey(prev => prev + 1); // Force re-render
  };

  const handleCancelPassword = () => {
    setIsUpdatingPassword(false);
    setKey(prev => prev + 1); // Force re-render
  };

  return (
    <motion.div 
      className="max-w-5xl mx-auto p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      key={key} // Use key to force re-render
    >
      {/* Header */}

      {/* Loading State */}
      {loading && (
        <motion.div 
          className="flex items-center justify-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-6 h-6 border-3 border-emerald-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="text-gray-600 font-medium">Loading your profile...</span>
          </div>
        </motion.div>
      )}

      {/* Profile Content */}
      {user && (
        <motion.div 
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden"
          variants={cardVariants}
          layout
        >
          <AnimatePresence mode="wait">
            {!isEditing && !isUpdatingPassword ? (
              <motion.div
                key="profile-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header Section */}
                <div className="bg-gradient-to-r from-emerald-500 to-blue-600 px-8 py-6 text-white">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <motion.div 
                      className="relative"
                      variants={avatarVariants}
                    >
                      <motion.img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="w-24 h-24 rounded-full border-4 border-white/20 shadow-lg object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      />
                      <motion.div 
                        className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                      />
                    </motion.div>
                    
                    <div className="text-center sm:text-left">
                      <motion.h3 
                        className="text-2xl font-bold mb-1"
                        variants={itemVariants}
                      >
                        {user.username}
                      </motion.h3>
                      <motion.p 
                        className="text-emerald-100 mb-2"
                        variants={itemVariants}
                      >
                        {user.email}
                      </motion.p>
                      <motion.div 
                        className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-medium"
                        variants={itemVariants}
                      >
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        {user.accountType}
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="p-8">
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                    variants={containerVariants}
                  >
                    {[
                      { label: "Username", value: user.username, icon: "👤" },
                      { label: "Email", value: user.email, icon: "📧" },
                      { label: "Gender", value: user.gender, icon: "⚧" },
                      { label: "Account Type", value: user.accountType, icon: "🏷️" },
                      { label: "Member Since", value: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), icon: "📅" },
                      { label: "Last Updated", value: new Date(user.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), icon: "🔄" }
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        className="group p-6 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all duration-200"
                        variants={infoVariants}
                        whileHover={{ scale: 1.02, y: -2 }}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500 mb-1">{item.label}</p>
                            <p className="font-semibold text-gray-900 capitalize">{item.value}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div 
                    className="flex flex-col sm:flex-row gap-4"
                    variants={itemVariants}
                  >
                    <motion.button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-4 rounded-2xl font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Pencil size={18} />
                      Edit Profile
                    </motion.button>

                    <motion.button
                      onClick={() => setIsUpdatingPassword(true)}
                      className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-2xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <KeyRound size={18} />
                      Update Password
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            ) : isEditing ? (
              <motion.div
                key="profile-edit"
                className="p-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <UpdateProfile
                  user={user}
                  setUser={setUser}
                  onCancel={handleCancelEdit}
                  onSave={handleSaveProfile}
                />
              </motion.div>
            ) : (
              <motion.div
                key="password-update"
                className="p-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <UpdatePassword
                  onCancel={handleCancelPassword}
                  onSave={handleSavePassword}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Profile;


// import { useEffect, useState } from "react";
// import { BACKEND_URL } from "../../constant";
// import axiosClient from "../../utils/axiosClient";
// import toast from "react-hot-toast";
// import { UserRound, Pencil, KeyRound } from "lucide-react";
// import { IconBadge } from "../../components/common/icon-badge";
// import UpdateProfile from "./update-profile";
// import UpdatePassword from "./update-password";

// import { motion, AnimatePresence } from "framer-motion";

// const Profile = () => {
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         setLoading(true);
//         const res = await axiosClient.get(BACKEND_URL + "/user/current");
//         setUser(res.data.data);
//         toast.success(res.data.message);
//       } catch (error) {
//         toast.error(error.response?.data?.message || "Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <div className="flex items-center gap-x-2 mb-4">
//         <IconBadge icon={UserRound} />
//         <motion.h2
//           className="text-2xl font-bold text-green-900"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           My Profile
//         </motion.h2>
//       </div>

//       {loading && <div className="text-gray-500">Loading...</div>}

//       <AnimatePresence mode="wait">
//         {user && (
//           <motion.div
//             key="profile-card"
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 30 }}
//             transition={{ duration: 0.5 }}
//             className="bg-white rounded-2xl shadow-md p-6"
//           >
//             {/* Avatar */}
//             <div className="flex justify-center mb-6 relative">
//               <AnimatePresence>
//                 <motion.img
//                   key={user.avatarUrl}
//                   src={user.avatarUrl}
//                   alt={user.username}
//                   className="w-28 h-28 rounded-full border-4 border-green-200 shadow-md object-cover"
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.8 }}
//                   transition={{ duration: 0.5 }}
//                 />
//               </AnimatePresence>
//             </div>

//             {/* Info/Grid and Actions */}
//             {!isEditing && !isUpdatingPassword ? (
//               <>
//                 <motion.div
//                   className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.4, delay: 0.15 }}
//                 >
//                   <div>
//                     <p className="text-sm text-gray-500">Username</p>
//                     <p className="font-medium">{user.username}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Email</p>
//                     <p className="font-medium">{user.email}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Gender</p>
//                     <p className="font-medium capitalize">{user.gender}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Account Type</p>
//                     <p className="font-medium">{user.accountType}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Created At</p>
//                     <p className="font-medium">
//                       {new Date(user.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Last Updated</p>
//                     <p className="font-medium">
//                       {new Date(user.updatedAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </motion.div>

//                 {/* Actions */}
//                 <div className="flex gap-3 mt-6">
//                   <motion.button
//                     onClick={() => setIsEditing(true)}
//                     className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <Pencil size={18} />
//                     Edit Profile
//                   </motion.button>
//                   <motion.button
//                     onClick={() => setIsUpdatingPassword(true)}
//                     className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <KeyRound size={18} />
//                     Update Password
//                   </motion.button>
//                 </div>
//               </>
//             ) : (
//               <AnimatePresence mode="wait">
//                 {isEditing && (
//                   <motion.div
//                     key="edit-profile"
//                     initial={{ opacity: 0, x: 40 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: -40 }}
//                     transition={{ duration: 0.4 }}
//                   >
//                     <UpdateProfile
//                       user={user}
//                       setUser={setUser}
//                       onCancel={() => setIsEditing(false)}
//                       onSave={() => setIsEditing(false)}
//                     />
//                   </motion.div>
//                 )}
//                 {isUpdatingPassword && (
//                   <motion.div
//                     key="update-password"
//                     initial={{ opacity: 0, x: 40 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: -40 }}
//                     transition={{ duration: 0.4 }}
//                   >
//                     <UpdatePassword
//                       onCancel={() => setIsUpdatingPassword(false)}
//                       onSave={() => setIsUpdatingPassword(false)}
//                     />
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Profile;
