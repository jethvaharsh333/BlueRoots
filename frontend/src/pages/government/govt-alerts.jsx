import { useEffect, useState } from "react";
import axiosClient from "../../utils/axiosClient";
import { BACKEND_URL } from "../../constant";

const GovtAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch Alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axiosClient.get(`${BACKEND_URL}/alert`);
        if (res.data.success) {
          setAlerts(res.data.data);
        } else {
          setError("Failed to fetch alerts");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching alerts");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading alerts...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Government Alerts</h1>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alerts.map((alert) => (
          <div
            key={alert._id}
            className="border rounded-xl shadow-md hover:shadow-lg transition p-5 bg-white"
          >
            {/* Title + Severity */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-800">{alert.title}</h2>
              <span
                className={`px-2 py-1 text-xs font-bold rounded-lg ${
                  alert.severity === "CRITICAL"
                    ? "bg-red-100 text-red-600"
                    : alert.severity === "MEDIUM"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {alert.severity}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3">
              {alert.description}
            </p>

            {/* Created By */}
            <p className="text-sm">
              <span className="font-medium">Created By:</span>{" "}
              {alert.createdBy?.name || "Unknown"}
            </p>

            {/* Status */}
            <p className="text-sm mt-1">
              <span className="font-medium">Status:</span>{" "}
              <span
                className={`${
                  alert.status === "NEW"
                    ? "text-blue-600"
                    : alert.status === "UNDER_INVESTIGATION"
                    ? "text-yellow-600"
                    : "text-green-600"
                } font-semibold`}
              >
                {alert.status}
              </span>
            </p>

            {/* Location */}
            <p className="text-xs text-gray-500 mt-2">
              📍 Lat: {alert.location.coordinates[1]}, Lng: {alert.location.coordinates[0]}
            </p>

            {/* Created Time */}
            <p className="text-xs text-gray-400 mt-1">
              Created At: {new Date(alert.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GovtAlert;