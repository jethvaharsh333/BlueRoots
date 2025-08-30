import { useState } from "react";
import { BACKEND_URL } from "../../constant";
import axiosClient from "../../utils/axiosClient.js";
import toast from "react-hot-toast";

const UpdatePassword = ({ onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
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
        BACKEND_URL + "/user/update-password",
        formData
      );
      console.log(res.data);
      toast.success(res.data.message);
      if (onSave) onSave();
    } catch (error) {
        console.error(error);
      toast.error(error.response?.data?.message || "Password update failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 border-t pt-6 space-y-4 text-gray-700"
    >
      <h3 className="text-lg font-semibold">Update Password</h3>

      <input
        type="password"
        name="oldPassword"
        value={formData.oldPassword}
        onChange={handleChange}
        placeholder="Enter old password"
        className="w-full border rounded-lg p-2"
        required
      />

      <input
        type="password"
        name="newPassword"
        value={formData.newPassword}
        onChange={handleChange}
        placeholder="Enter new password"
        className="w-full border rounded-lg p-2"
        required
      />

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

export default UpdatePassword;
