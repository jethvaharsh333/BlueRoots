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
    images: [],
    status: "PENDING", // default
  });

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const uploadSingle = async (file) => {
    try {
      // 1. get signature & credentials from backend
      const sigRes = await axiosClient.get(`${BACKEND_URL}/config/cloudinary-signature`);
      const { timestamp, signature, apiKey, cloudName } = sigRes.data.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        { method: "POST", body: formData }
      );
      
      if (!uploadRes.ok) throw new Error("Cloudinary upload failed");
      
      const data = await uploadRes.json();
      return data.secure_url; // Return the secure URL

    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      toast.error("Image upload failed");
      return null;
    }
  };

  const handleImageUpload = async () => {
    if (!files.length) return [];

    setUploading(true);
    const uploadedUrls = [];

    for (const f of files) {
      const url = await uploadSingle(f);
      if (url) uploadedUrls.push(url);
    }

    setUploading(false);
    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. upload images first
      const uploadedUrls = await handleImageUpload();

      // 2. attach images to formData
      const payload = { 
        ...formData, 
        images: uploadedUrls,
        // Ensure coordinates are numbers, not strings
        longitude: parseFloat(formData.longitude),
        latitude: parseFloat(formData.latitude)
      };

      // 3. send report to backend
      await axiosClient.post(`${BACKEND_URL}/reports/create`, payload);

      toast.success("Report created successfully!");

      // reset
      setFormData({
        category: "",
        notes: "",
        longitude: "",
        latitude: "",
        images: [],
        status: "PENDING"
      });
      setFiles([]);
    } catch (error) {
      console.error("Error creating report:", error);
      
      // More detailed error message
      if (error.response) {
        // The server responded with an error status
        console.error("Server error:", error.response.data);
        toast.error(`Server error: ${error.response.data.message || "Please check your input"}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        toast.error("No response from server. Please try again.");
      } else {
        // Something happened in setting up the request
        console.error("Error:", error.message);
        toast.error("Failed to create report ❌");
      }
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
          type="number"
          step="any"
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
          placeholder="Longitude"
          className="w-full border p-2 rounded"
          required
        />

        {/* Latitude */}
        <input
          type="number"
          step="any"
          name="latitude"
          value={formData.latitude}
          onChange={handleChange}
          placeholder="Latitude"
          className="w-full border p-2 rounded"
          required
        />

        {/* File Upload */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border p-2 rounded"
        />
        {files.length > 0 && (
          <p className="text-sm text-gray-500">{files.length} file(s) selected</p>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {uploading ? "Uploading Images..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
};

export default NewReport;