import { useState } from "react";
import { BACKEND_URL } from "../../constant";
import axiosClient from "../../utils/axiosClient";
import toast from "react-hot-toast";

const UpdateProfile = ({ user, setUser, onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    dateOfBirth: user?.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split("T")[0]
      : "",
    gender: user?.gender || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.put(
        BACKEND_URL + "/user/update-profile",
        formData
      );
      toast.success(res.data.message);

      // update parent state
      setUser(res.data.data);
      if (onSave) onSave();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 border-t pt-6 space-y-4 text-gray-700"
    >
      <h3 className="text-lg font-semibold">Edit Profile</h3>

      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Enter username"
        className="w-full border rounded-lg p-2"
      />

      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="First Name"
        className="w-full border rounded-lg p-2"
      />

      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Last Name"
        className="w-full border rounded-lg p-2"
      />

      <input
        type="date"
        name="dateOfBirth"
        value={formData.dateOfBirth}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      />

      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-green-600 text-white rounded-lg py-2 hover:bg-green-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-800 rounded-lg py-2 hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UpdateProfile;
