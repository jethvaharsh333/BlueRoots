import { useState } from "react";
import axiosClient from "../../utils/axiosClient"; 
import { BACKEND_URL } from "../../constant";
import toast from "react-hot-toast";

const NewReport = () => {
  const [formData, setFormData] = useState({
    category: "",
    notes: "",
    longitude: "",
    latitude: "",
    images: [""],
    status: "PENDING", // default
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "images") {
      setFormData({ ...formData, images: [value] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosClient.post(`${BACKEND_URL}/reports/create`, formData);
      toast.success("Report created successfully!");
      console.log(res.data);

      setFormData({
        category: "",
        notes: "",
        longitude: "",
        latitude: "",
        images: [""],
        status: "PENDING",
      });
    } catch (error) {
      console.error("Error creating report:", error);
      alert("Failed to create report ❌");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto shadow-lg rounded-xl bg-white">
      <h2 className="text-xl font-bold mb-4">Create New Report</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Category Dropdown */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="CUTTING">CUTTING</option>
          <option value="DUMPING">DUMPING</option>
          <option value="POLLUTION">POLLUTION</option>
          <option value="LAND_CLEARING">LAND CLEARING</option>
          <option value="OTHER">OTHER</option>
        </select>

        {/* Notes */}
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="w-full border p-2 rounded"
        />

        {/* Longitude */}
        <input
          type="text"
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
          placeholder="Longitude"
          className="w-full border p-2 rounded"
          required
        />

        {/* Latitude */}
        <input
          type="text"
          name="latitude"
          value={formData.latitude}
          onChange={handleChange}
          placeholder="Latitude"
          className="w-full border p-2 rounded"
          required
        />

        {/* Image URL */}
        <input
          type="text"
          name="images"
          value={formData.images[0]}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full border p-2 rounded"
        />

        {/* Status Dropdown */}
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="PENDING">PENDING</option>
          <option value="VERIFIED">VERIFIED</option>
          <option value="REJECTED">REJECTED</option>
          <option value="ACTIONED">ACTIONED</option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default NewReport;
