import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { z } from "zod";

// Redux imports
import { useAppDispatch, useReports } from "../../store/hooks";
import { createReport, clearError } from "../../store/slices/reportSlice";

// Components
import FormField from "../../components/common/form-field";
import { Button } from "../../components/ui/button";

// Schema for form validation
const reportSchema = z.object({
  category: z.enum(["cutting", "dumping", "pollution", "land_clearing"], {
    required_error: "Please select a category",
  }),
  notes: z.string().min(10, "Please provide at least 10 characters of description"),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().optional(),
  }),
});

const categories = [
  { value: "cutting", label: "Tree Cutting", icon: "🌳", color: "from-green-500 to-emerald-500" },
  { value: "dumping", label: "Illegal Dumping", icon: "🗑️", color: "from-red-500 to-pink-500" },
  { value: "pollution", label: "Pollution", icon: "☁️", color: "from-gray-500 to-slate-500" },
  { value: "land_clearing", label: "Land Clearing", icon: "🚜", color: "from-yellow-500 to-orange-500" },
];

const NewReportRedux = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Redux state
  const { createLoading, createError } = useReports();
  
  // Local state
  const [selectedImages, setSelectedImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      category: "",
      notes: "",
      location: null,
    },
  });

  const selectedCategory = watch("category");

  // Clear errors on component mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Get user's current location
  const getCurrentLocation = () => {
    setLocationLoading(true);
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding to get address (you can use any geocoding service)
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`
          );
          const data = await response.json();
          const address = data.results?.[0]?.formatted || "Unknown location";
          
          const locationData = { latitude, longitude, address };
          setLocation(locationData);
          setValue("location", locationData);
          toast.success("Location captured successfully!");
        } catch (error) {
          // Fallback without address
          const locationData = { latitude, longitude, address: "Unknown location" };
          setLocation(locationData);
          setValue("location", locationData);
          toast.success("Location captured successfully!");
        }
        
        setLocationLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Failed to get location. Please try again.");
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + selectedImages.length > 5) {
      toast.error("You can upload maximum 5 images");
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    setSelectedImages(prev => [...prev, ...validFiles]);
  };

  // Remove selected image
  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Form submission
  const onSubmit = async (data) => {
    if (!location) {
      toast.error("Please capture your location first");
      return;
    }

    if (selectedImages.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    try {
      const reportData = {
        category: data.category,
        notes: data.notes,
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
        images: selectedImages,
      };

      const result = await dispatch(createReport(reportData));

      if (createReport.fulfilled.match(result)) {
        toast.success("Report submitted successfully!");
        reset();
        setSelectedImages([]);
        setLocation(null);
        navigate("/reports");
      } else {
        toast.error(result.payload || "Failed to submit report");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 p-8 text-white">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold mb-2 flex items-center gap-3"
            >
              <span className="text-4xl">📝</span>
              Report Environmental Incident
            </motion.h1>
            <p className="text-blue-100">
              Help protect our environment by reporting incidents in your area
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            {/* Display Redux error if exists */}
            {createError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
              >
                {createError}
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Category Selection */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  Select Incident Category *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <motion.label
                      key={category.value}
                      className={`relative cursor-pointer p-6 rounded-2xl border-2 transition-all ${
                        selectedCategory === category.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="radio"
                        value={category.value}
                        {...register("category")}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center text-2xl`}>
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{category.label}</h3>
                          <p className="text-sm text-gray-600">
                            {category.value === "cutting" && "Unauthorized tree cutting or deforestation"}
                            {category.value === "dumping" && "Illegal waste disposal or littering"}
                            {category.value === "pollution" && "Air, water, or soil contamination"}
                            {category.value === "land_clearing" && "Unauthorized land development"}
                          </p>
                        </div>
                      </div>
                      {selectedCategory === category.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                        >
                          <span className="text-white text-sm">✓</span>
                        </motion.div>
                      )}
                    </motion.label>
                  ))}
                </div>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-2">{errors.category.message}</p>
                )}
              </div>

              {/* Location Capture */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  Location *
                </label>
                <div className="space-y-4">
                  <Button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-500"
                  >
                    {locationLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Getting Location...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        Capture Current Location
                      </div>
                    )}
                  </Button>
                  
                  {location && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-50 border border-green-200 p-4 rounded-xl"
                    >
                      <div className="flex items-center gap-2 text-green-700">
                        <span>✅</span>
                        <span className="font-medium">Location captured successfully!</span>
                      </div>
                      <p className="text-sm text-green-600 mt-1">
                        {location.address}
                      </p>
                      <p className="text-xs text-green-500 mt-1">
                        Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  Upload Images * (Max 5 images, 5MB each)
                </label>
                <div className="space-y-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  
                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {selectedImages.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group"
                        >
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <FormField
                label="Description *"
                name="notes"
                type="textarea"
                placeholder="Provide detailed description of the incident..."
                register={register}
                error={errors.notes}
                rows={4}
                required
              />

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createLoading || !location || selectedImages.length === 0}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500"
                >
                  {createLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting Report...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>📤</span>
                      Submit Report
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewReportRedux;