import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constant";
import axiosClient from "../../utils/axiosClient";

const ReportDetail = () => {
  const { id } = useParams(); // extract report id from URL
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axiosClient.get(`${BACKEND_URL}/reports/${id}`);
        setReport(res.data.data);
      } catch (err) {
        console.log("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading report...</p>;
  if (!report) return <p style={{ textAlign: "center" }}>Report not found.</p>;

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Image */}
        <img
          src={report.images[0]}
          alt={report.category}
          style={{
            width: "100%",
            height: "300px",
            objectFit: "cover",
          }}
        />

        {/* Details */}
        <div style={{ padding: "20px" }}>
          <h2 style={{ marginBottom: "10px", color: "#333" }}>
            {report.category}
          </h2>
          <p style={{ margin: "6px 0" }}>
            <strong>Notes:</strong> {report.notes}
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color: report.status === "PENDING" ? "orange" : "green",
                fontWeight: "bold",
              }}
            >
              {report.status}
            </span>
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Reported By:</strong> {report.user?.email}
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Created At:</strong>{" "}
            {new Date(report.createdAt).toLocaleString()}
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Location:</strong>{" "}
            {report.location.coordinates.join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;