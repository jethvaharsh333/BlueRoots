import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../utils/axiosClient";
import { BACKEND_URL } from "../../constant";
import toast from "react-hot-toast";

// Animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
};

const NgoDashboard = () => {
  const [stats, setStats] = useState({ pendingReports: 0, alertsCreated: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [mapPoints, setMapPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`${BACKEND_URL}/user/ngo`);
      const data = res.data.data;

      setStats(data.stats || {});
      setRecentActivity(data.recentActivity || []);
      setMapPoints(data.mapPoints || []);
    } catch (err) {
      console.error("NGO Dashboard fetch error:", err);
      toast.error("Failed to load NGO dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const getCategoryEmoji = (category) => {
    switch (category?.toLowerCase()) {
      case "cutting":
        return "🌳";
      case "dumping":
        return "🗑";
      case "pollution":
        return "☁";
      case "land_clearing":
        return "🚜";
      default:
        return "📋";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "from-yellow-400 to-orange-500";
      case "verified":
        return "from-green-400 to-emerald-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  return (
    <>
            <h1 className="text-2xl font-bold mb-6">Government Dashboard</h1>

    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 📊 Stats Section */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10" variants={containerVariants}>
          <motion.div
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-xl shadow-lg"
            variants={itemVariants}
          >
            <h3 className="text-lg">Pending Reports</h3>
            <p className="text-3xl font-bold">{stats.pendingReports}</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white p-6 rounded-xl shadow-lg"
            variants={itemVariants}
          >
            <h3 className="text-lg">Alerts Created</h3>
            <p className="text-3xl font-bold">{stats.alertsCreated}</p>
          </motion.div>
        </motion.div>

        {/* 📄 Recent Activity */}
        <motion.div variants={itemVariants} className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <AnimatePresence>
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <motion.div
                  key={activity._id}
                  className="bg-white p-4 rounded-xl shadow mb-3"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <div className="flex justify-between">
                    <span>
                      {getCategoryEmoji(activity.category)} {activity.category}
                    </span>
                    <span className="text-sm opacity-70">
                      {new Date(activity.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Lat: {activity.location.coordinates[1]}, Lng:{" "}
                    {activity.location.coordinates[0]}
                  </p>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500">No recent activity found.</p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 🗺 Map Section */}
        <motion.div variants={itemVariants}>
          <h3 className="text-xl font-semibold mb-4">Activity Map</h3>
          <div className="h-[500px] rounded-xl overflow-hidden shadow-lg">
            <MapContainer
              center={[21.7421, 88.8004]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              />
              {mapPoints.map((point) => (
                <Marker
                  key={point._id}
                  position={[point.location.coordinates[1], point.location.coordinates[0]]}
                >
                  <Popup>
                    <div>
                      <p>
                        {getCategoryEmoji(point.category)} <b>{point.category}</b>
                      </p>
                      <p>Status: {point.status}</p>
                      <p>
                        Lat: {point.location.coordinates[1]}, Lng:{" "}
                        {point.location.coordinates[0]}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </motion.div>
      </motion.div>
    </div>
    </>
  );
};

export default NgoDashboard;
