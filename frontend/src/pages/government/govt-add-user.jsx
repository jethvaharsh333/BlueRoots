import { useState } from "react";
import axiosClient from "../../utils/axiosClient"; // assuming you already use axiosClient
import { BACKEND_URL } from "../../constant";

const GovtAddUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "NGO", // default value
  });

  const [message, setMessage] = useState("");

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
    try {
      const res = await axiosClient.post(
        `${BACKEND_URL}/admin/create-user`,
        formData
      );
      console.log(res);
      if (res.data.success) {
        setMessage("User created successfully ✅");
        setFormData({ username: "", email: "", role: "NGO" });
      } else {
        setMessage("Failed to create user ❌");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong ❌");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Add New User</h2>

      {message && (
        <p className="mb-3 text-sm text-green-600 font-medium">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Role */}
        <div>
          <label className="block mb-1 font-medium">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring focus:ring-blue-300"
          >
            <option value="Citizen">Citizen</option>
            <option value="NGO">NGO</option>
    
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

export default GovtAddUser;
