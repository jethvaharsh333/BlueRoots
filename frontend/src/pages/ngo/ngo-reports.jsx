import { useEffect, useState } from "react";
import axiosClient from "../../utils/axiosClient";
import { BACKEND_URL } from "../../constant";

const NgoReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [status, setStatus] = useState("VERIFIED");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axiosClient.get(`${BACKEND_URL}/reports/all`);
        if (res.data.success) {
          setReports(res.data.data);
        } else {
          setError("Failed to fetch reports");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const openVerifyModal = (report) => {
    setSelectedReport(report);
    setStatus("VERIFIED");
    setShowModal(true);
  };

  const handleVerifySubmit = async () => {
    if (!selectedReport) return;

    setSubmitting(true);
    try {
      const res = await axiosClient.put(
        `${BACKEND_URL}/reports/verify/${selectedReport._id}`,
        { status }
      );

      if (res.data.success) {
        setReports((prev) =>
          prev.map((r) =>
            r._id === selectedReport._id ? { ...r, status } : r
          )
        );
        setShowModal(false);
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading reports...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
<>
        <h1 className="text-2xl font-bold mb-6">Reports</h1>

<div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {reports.map((report) => (
        <div key={report._id} className="border rounded-xl shadow-md p-4 flex flex-col hover:shadow-lg transition">
          <img
            src={report.images[0]}
            alt={report.category}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <h2 className="font-bold text-lg mb-1">{report.category}</h2>
          <p className="text-sm text-gray-600 mb-2">{report.notes || "No notes provided"}</p>
          <p className="text-sm mb-1">
            <span className="font-semibold">Reported by:</span> {report.user.email}
          </p>
          <p className="text-sm mb-1">
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={
                report.status === "PENDING"
                  ? "text-yellow-500"
                  : report.status === "VERIFIED"
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {report.status}
            </span>
          </p>
          <p className="text-xs text-gray-400">
            <span className="font-semibold">Created at:</span>{" "}
            {new Date(report.createdAt).toLocaleString()}
          </p>

          {/* ✅ Stylish Verify Button */}
          {report.status === "PENDING" && (
            <button
              onClick={() => openVerifyModal(report)}
              className="mt-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
            >
              Verify Report
            </button>
          )}
        </div>
      ))}

      {/* ✅ Improved Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Verify Report
            </h2>
            <p className="mb-3 text-sm text-gray-600">
              <span className="font-medium">Report ID:</span>{" "}
              {selectedReport._id}
            </p>

            {/* Dropdown */}
            <label className="block mb-2 font-medium text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500"
            >
              <option value="VERIFIED">✅ VERIFIED</option>
              <option value="REJECTED">❌ REJECTED</option>
            </select>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleVerifySubmit}
                className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 shadow-md transition disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default NgoReports;