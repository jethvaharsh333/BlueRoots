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
<<<<<<< HEAD

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
=======

        fetchReports();
    }, []);

  // Enhanced status badge component
  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: "bg-gradient-to-r from-yellow-400 to-orange-500", icon: "⏳", textColor: "text-white" },
      RESOLVED: { color: "bg-gradient-to-r from-green-400 to-emerald-500", icon: "✅", textColor: "text-white" },
      IN_PROGRESS: { color: "bg-gradient-to-r from-blue-400 to-indigo-500", icon: "🔄", textColor: "text-white" },
      REJECTED: { color: "bg-gradient-to-r from-red-400 to-pink-500", icon: "❌", textColor: "text-white" }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${config.color} ${config.textColor} animate-pulseRing`}>
        <span>{config.icon}</span>
        {status}
      </span>
    );
  };

  // Category icons and colors
  const getCategoryStyle = (category) => {
    const categoryStyles = {
      CUTTING: { icon: "🌳", gradient: "from-green-500 to-emerald-600" },
      DUMPING: { icon: "🗑️", gradient: "from-orange-500 to-red-600" },
      POLLUTION: { icon: "☁️", gradient: "from-gray-500 to-slate-600" },
      LAND_CLEARING: { icon: "🚜", gradient: "from-yellow-500 to-orange-600" },
      OTHER: { icon: "📋", gradient: "from-purple-500 to-indigo-600" }
    };
    return categoryStyles[category] || categoryStyles.OTHER;
  };

  // Enhanced loading state with skeleton cards
  if (loading) {
    return (
      <div className="min-h-screen p-4">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header skeleton */}
          <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-white/20 mb-8 animate-fadeIn">
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="h-8 bg-white/20 rounded-lg w-64 mb-2 animate-pulse"></div>
                <div className="h-4 bg-white/10 rounded w-96 animate-pulse"></div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg p-0 overflow-hidden animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="w-full h-48 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="flex justify-between items-center pt-2">
                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced error state
  if (error) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-white/20 animate-bounceIn">
          <div className="p-8 text-center">
            <div className="text-6xl mb-4 animate-pulseRing">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Oops! Something went wrong</h2>
            <p className="text-red-500 mb-6 bg-red-50 p-3 rounded-xl border border-red-200">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-102 shadow-lg hover:shadow-xl"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (reports.length === 0) {
    return (
      <div className="min-h-screen p-4">
        <div className="w-full max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-white/20 animate-fadeIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2">My Reports</h1>
                <p className="text-blue-100">Track your environmental reports</p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
            </div>

            <div className="p-8 text-center py-16">
              <div className="text-8xl mb-6 animate-bounceIn">📝</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Reports Yet</h2>
              <p className="text-gray-600 mb-8 text-lg">You haven't created any reports yet. Start by reporting an environmental issue!</p>
              <Link to="/reports/new">
              <button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-102 shadow-lg hover:shadow-xl"
                >
                🚀 Create First Report
              </button>
                  </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-white/20 animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-8 text-white relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">My Reports</h1>
                <p className="text-blue-100">Track your environmental reports and their status</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{reports.length}</div>
                <div className="text-sm text-blue-100">Total Reports</div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
          </div>

          {/* Reports Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report, index) => {
                const categoryStyle = getCategoryStyle(report.category);
                return (
                  <div
                    key={report._id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:scale-102 border border-gray-100 animate-slideUp"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Image with overlay */}
                    <div className="relative">
                      <img
                        src={report.images?.[0]}
                        alt={report.category}
                        className="w-full h-70 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTIwQzEwNi42MjcgMTIwIDExMiAxMTQuNjI3IDExMiAxMDhDMTEyIDEwMS4zNzMgMTA2LjYyNyA5NiAxMDAgOTZDOTMuMzczIDk2IDg4IDEwMS4zNzMgODggMTA4Qzg4IDExNC42MjcgOTMuMzczIDEyMCAxMDAgMTIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTAwIDEzNkM5My4zNzMgMTM2IDg4IDEzMC42MjcgODggMTI0VjEwNEM4OCAxMDEuNzkxIDg5Ljc5MSAxMDAgOTIgMTAwSDEwOEMxMTAuMjA5IDEwMCAxMTIgMTAxLjc5MSAxMTIgMTA0VjEyNEMxMTIgMTMwLjYyNyAxMDYuNjI3IDEzNiAxMDAgMTM2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                        }}
                      />

                      {/* Status badge overlay */}
                      <div className="absolute top-3 right-3">
                        {getStatusBadge(report.status)}
                      </div>

                      {/* Gradient overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <h2 className="text-xl font-bold text-gray-900 capitalize flex items-center gap-2">
                        <span>{getCategoryStyle(report.category).icon}</span>
                        {report.category?.replace('_', ' ')}
                      </h2>
                      
                      <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                        {report.notes || "No description provided"}
                      </p>
                      

                      {/* Metadata */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>📅</span>
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>🕒</span>
                          <span>{new Date(report.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations - matching NewReport component */}
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
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        
        .group:hover .group-hover\\:scale-105 {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
>>>>>>> 01448991d2542071fb37bdd226304ba90c44d29b
};

export default Reports;