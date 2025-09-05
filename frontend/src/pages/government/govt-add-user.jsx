import { useState } from "react";
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

const GovtAddUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "NGO", // default
  });
  const [loading, setLoading] = useState(false);

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

    try {
      const res = await axiosClient.post(
        `${BACKEND_URL}/admin/create-user`,
        formData
      );

      if (res.data.success) {
        toast.success("User created successfully ✅");
        setFormData({ username: "", email: "", role: "NGO" });
      } else {
        toast.error("Failed to create user ❌");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="p-6 max-w-lg mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="bg-white shadow-lg rounded-2xl p-6"
        variants={itemVariants}
      >
        <h2 className="text-2xl font-bold mb-4">👤 Add New User</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Fill out the details below to create a new user in the system.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <motion.div variants={itemVariants}>
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </motion.div>

          {/* Email */}
          <motion.div variants={itemVariants}>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </motion.div>

          {/* Role */}
          <motion.div variants={itemVariants}>
            <label className="block mb-1 font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Citizen">Citizen</option>
              <option value="NGO">NGO</option>
              {/* <option value="Government">Government</option> */}
            </select>
          </motion.div>

          {/* Submit */}
          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white rounded-lg py-2 font-medium transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default GovtAddUser;
