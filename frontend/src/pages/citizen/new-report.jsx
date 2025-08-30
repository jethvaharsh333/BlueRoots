import { useState } from "react";
import axiosClient from "../../utils/axiosClient";
import { BACKEND_URL } from "../../constant";
import toast from "react-hot-toast";

// Category options with visual enhancements
const categoryOptions = [
  { value: "CUTTING", label: "Tree Cutting", icon: "🌳", color: "from-green-500 to-emerald-600" },
  { value: "DUMPING", label: "Waste Dumping", icon: "🗑️", color: "from-orange-500 to-red-600" },
  { value: "POLLUTION", label: "Pollution", icon: "☁️", color: "from-gray-500 to-slate-600" },
  { value: "LAND_CLEARING", label: "Land Clearing", icon: "🚜", color: "from-yellow-500 to-orange-600" },
  { value: "OTHER", label: "Other", icon: "📋", color: "from-purple-500 to-indigo-600" }
];

const NewReport = () => {
  const [formData, setFormData] = useState({
    category: "",
    notes: "",
    longitude: "",
    latitude: "",
    images: [],
    status: "PENDING",
  });

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles(newFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/'));
    setFiles(imageFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const uploadSingle = async (file) => {
    try {
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
      return data.secure_url;

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
      const uploadedUrls = await handleImageUpload();

      const payload = { 
        ...formData, 
        images: uploadedUrls,
        longitude: parseFloat(formData.longitude),
        latitude: parseFloat(formData.latitude)
      };

      await axiosClient.post(`${BACKEND_URL}/reports/create`, payload);

      toast.success("Report created successfully!");

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
      
      if (error.response) {
        console.error("Server error:", error.response.data);
        toast.error(`Server error: ${error.response.data.message || "Please check your input"}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response from server. Please try again.");
      } else {
        console.error("Error:", error.message);
        toast.error("Failed to create report ❌");
      }
    }
  };
const [isLoadingLocation, setIsLoadingLocation] = useState(false);
const getCurrentLocation = () => {
  if (navigator.geolocation) {
    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        });
        setIsLoadingLocation(false);
        toast.success("Location detected!");
      },
      () => {
        setIsLoadingLocation(false);
        toast.error("Unable to get location");
      }
    );
  } else {
    toast.error("Geolocation not supported");
  }
};
  

  const selectedCategory = categoryOptions.find(opt => opt.value === formData.category);
  const isFormValid = formData.category && formData.latitude && formData.longitude;

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-white/20 animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Create Environmental Report</h2>
            <p className="text-blue-100">Help protect our environment by reporting incidents</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div className="animate-slideUp animation-delay-100">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                <span className="flex items-center gap-2">
                  📂 Report Category
                </span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categoryOptions.map((option, index) => (
                  <label
                    key={option.value}
                    className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-300 hover:scale-102 ${
                      formData.category === option.value
                        ? 'border-blue-500 bg-blue-50 shadow-lg glow'
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={option.value}
                      checked={formData.category === option.value}
                      onChange={handleChange}
                      className="sr-only"
                      required
                    />
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <span className="font-medium text-gray-700">{option.label}</span>
                    </div>
                    {formData.category === option.value && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-xl animate-pulseRing"></div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Location Section */}
<div className="animate-slideUp animation-delay-200">
  <label className="block text-sm font-semibold text-gray-700 mb-4">
    <span className="flex items-center gap-2">
      📍 Location Coordinates
    </span>
  </label>
  <div className="space-y-3">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <input
        type="number"
        step="any"
        name="latitude"
        value={formData.latitude}
        onChange={handleChange}
        placeholder="Latitude"
        className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none focus:scale-101"
        required
        disabled={isLoadingLocation}
      />
      <input
        type="number"
        step="any"
        name="longitude"
        value={formData.longitude}
        onChange={handleChange}
        placeholder="Longitude"
        className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none focus:scale-101"
        required
        disabled={isLoadingLocation}
      />
    </div>
    <button
      type="button"
      onClick={getCurrentLocation}
      disabled={isLoadingLocation}
      className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${
        isLoadingLocation
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 hover:scale-102'
      }`}
    >
      {isLoadingLocation ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          Fetching Location...
        </>
      ) : (
        <>
          🎯 Get Current Location
        </>
      )}
    </button>
  </div>
</div>
 
            {/* Notes */}
            <div className="animate-slideUp animation-delay-300">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <span className="flex items-center gap-2">
                  📝 Additional Notes
                </span>
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Describe the environmental issue in detail..."
                rows={4}
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none focus:scale-101"
              />
            </div>

            {/* File Upload */}
            <div className="animate-slideUp animation-delay-400">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <span className="flex items-center gap-2">
                  🖼️ Evidence Photos
                </span>
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragOver 
                    ? 'border-blue-500 bg-blue-50 scale-105' 
                    : files.length > 0 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                } hover:scale-102`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {files.length > 0 ? (
                  <div className="space-y-3 animate-bounceIn">
                    <div className="text-4xl">✅</div>
                    <p className="text-green-700 font-medium">
                      {files.length} image{files.length !== 1 ? 's' : ''} selected
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                      {files.slice(0, 6).map((file, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg p-2 shadow-sm border animate-bounceIn"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="text-xs truncate text-gray-600">
                            {file.name}
                          </div>
                        </div>
                      ))}
                      {files.length > 6 && (
                        <div className="bg-gray-100 rounded-lg p-2 flex items-center justify-center text-gray-500 text-sm">
                          +{files.length - 6} more
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className={`text-4xl transition-transform duration-300 ${dragOver ? 'scale-110 -translate-y-1' : ''}`}>
                      📸
                    </div>
                    <p className="text-gray-600 font-medium">
                      {dragOver ? 'Drop images here!' : 'Drag & drop images or click to browse'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Support: JPG, PNG, GIF (Max 10MB each)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="animate-slideUp animation-delay-500">
              <button
                type="submit"
                disabled={uploading || !isFormValid}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all relative overflow-hidden ${
                  uploading || !isFormValid
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl hover:scale-102'
                }`}
              >
                {uploading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading Images...
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    🚀 Submit Report
                  </span>
                )}
                
                {/* Shimmer effect for valid form */}
                {!uploading && isFormValid && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer opacity-30"></div>
                )}
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center mt-6 animate-slideUp animation-delay-500">
              <div className="flex gap-4">
                {[
                  { complete: !!formData.category, label: "Category", icon: "📂" },
                  { complete: !!(formData.latitude && formData.longitude), label: "Location", icon: "📍" },
                  { complete: !!(formData.notes || files.length > 0), label: "Details", icon: "📝" }
                ].map((step, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                        step.complete 
                          ? 'bg-green-500 text-white animate-pulseRing shadow-lg' 
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {step.complete ? '✓' : step.icon}
                    </div>
                    <span className={`text-xs font-medium ${step.complete ? 'text-green-600' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Selected Category Preview */}
        {selectedCategory && (
          <div className="px-8 pb-6 animate-bounceIn">
            <div className={`bg-gradient-to-r ${selectedCategory.color} rounded-xl p-4 text-white shadow-lg`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedCategory.icon}</span>
                <div>
                  <h3 className="font-bold">Selected: {selectedCategory.label}</h3>
                  <p className="text-sm opacity-90">Category confirmed for your report</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.8); }
          60% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.4s ease-out;
        }
        
        .animate-pulseRing {
          animation: pulseRing 2s infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        
        .focus\\:scale-101:focus {
          transform: scale(1.01);
        }
        
        .glow {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
};

export default NewReport;