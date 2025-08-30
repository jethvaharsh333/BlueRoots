import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constant";
import axiosClient from "../../utils/axiosClient";
import { Link } from "react-router-dom";

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await axiosClient.get(`${BACKEND_URL}/reports/my`);
                if (res.data.success) {
                    setReports(res.data.data);
                } else {
                    setError("Failed to fetch reports");
                }
            } catch (err) {
                setError("Something went wrong!");
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) return <p className="text-center">Loading reports...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">My Reports</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.map((report) => (
                    <Link to={`/reports/${report._id}`} key={report._id}>
                        <div
                            key={report._id}
                            className="border rounded-lg shadow p-4 flex flex-col"
                        >
                            <img
                                src={report.images[0]}
                                alt={report.category}
                                className="w-full h-48 object-cover rounded-md mb-3"
                            />
                            <h2 className="text-lg font-semibold">{report.category}</h2>
                            <p className="text-gray-600">{report.notes}</p>
                            <p className="mt-2">
                                <span className="font-medium">Status:</span>{" "}
                                <span
                                    className={`${report.status === "PENDING"
                                            ? "text-yellow-600"
                                            : "text-green-600"
                                        }`}
                                >
                                    {report.status}
                                </span>
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                {new Date(report.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Reports;
