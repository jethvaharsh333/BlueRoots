import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../constant"; // make sure BACKEND_URL is defined
import axiosClient from "../../utils/axiosClient";


const NgoReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axiosClient.get(`${BACKEND_URL}/reports/all`);
        console.log(res);
        if (res.data.success) {
            console.log(res.data.data);
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

  if (loading) return <div className="text-center mt-10">Loading reports...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => (
        <div key={report._id} className="border rounded-lg shadow-md p-4 flex flex-col">
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
            <span className={report.status === "PENDING" ? "text-yellow-500" : "text-green-500"}>
              {report.status}
            </span>
          </p>
          <p className="text-xs text-gray-400">
            <span className="font-semibold">Created at:</span>{" "}
            {new Date(report.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default NgoReports;
