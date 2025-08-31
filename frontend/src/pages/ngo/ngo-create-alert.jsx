import { useState, useEffect } from "react";
import axiosClient from "../../utils/axiosClient";
import { BACKEND_URL } from "../../constant";
import toast from "react-hot-toast";

const NgoCreateAlert = () => {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReportIds, setSelectedReportIds] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        severity: 'LOW',
        description: '',
        longitude: '',
        latitude: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setIsLoading(true);
                const response = await axiosClient.get(`${BACKEND_URL}/reports/all`);
                if (response.data && response.data.data) {
                    setReports(response.data.data);
                    toast.success("Reports loaded successfully");
                } else {
                    throw new Error("Invalid response structure");
                }
            } catch (err) {
                console.error("Failed to fetch reports:", err);
                const errorMsg = err.response?.data?.message || "Failed to load reports";
                setError(errorMsg);
                toast.error(errorMsg);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, []);

    useEffect(() => {
        if (selectedReportIds.length === 1) {
            const firstSelectedReport = reports.find(r => r._id === selectedReportIds[0]);
            if (firstSelectedReport && firstSelectedReport.location && firstSelectedReport.location.coordinates) {
                setFormData(prev => ({
                    ...prev,
                    longitude: firstSelectedReport.location.coordinates[0] || '',
                    latitude: firstSelectedReport.location.coordinates[1] || '',
                }));
            }
        }
    }, [selectedReportIds, reports]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (reportId, isVerified) => {
        if (!isVerified) {
            toast.error("Only verified reports can be selected for alerts");
            return;
        }
        
        setSelectedReportIds(prev =>
            prev.includes(reportId)
                ? prev.filter(id => id !== reportId)
                : [...prev, reportId]
        );
    };

    const handleSelectAllVerified = () => {
        const verifiedReportIds = reports
            .filter(report => report.status === 'VERIFIED')
            .map(report => report._id);
        
        if (verifiedReportIds.length === selectedReportIds.length) {
            setSelectedReportIds([]);
        } else {
            setSelectedReportIds(verifiedReportIds);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (selectedReportIds.length === 0) {
            toast.error('Please select at least one verified report.');
            return;
        }

        const payload = {
            ...formData,
            longitude: parseFloat(formData.longitude),
            latitude: parseFloat(formData.latitude),
            reports: selectedReportIds,
        };

        try {
            setIsSubmitting(true);
            const response = await axiosClient.post(`${BACKEND_URL}/alert`, payload);
            toast.success(response.data.message || "Alert created successfully");
            
            setFormData({
                title: '',
                severity: 'LOW',
                description: '',
                longitude: '',
                latitude: '',
            });
            setSelectedReportIds([]);
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || "Failed to create alert";
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredReports = statusFilter === 'ALL' 
        ? reports 
        : reports.filter(report => report.status === statusFilter);
    
    const verifiedReports = reports.filter(report => report.status === 'VERIFIED');
    const selectedReports = reports.filter(report => selectedReportIds.includes(report._id));

    return (
        <>
        <h1 className="text-2xl font-bold mb-6">Escalate Reports to Alert</h1>
        <div className=" min-h-screen  font-sans md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <p className="text-gray-600 mt-1">Select verified reports and bundle them into a single, actionable alert for authorities.</p>
                    {verifiedReports.length === 0 && !isLoading && (
                        <div className="mt-4 p-4 bg-yellow-100 text-yellow-700 rounded-md">
                            <p className="font-semibold">No verified reports available</p>
                            <p className="text-sm mt-1">Only reports with status "VERIFIED" can be selected for alerts.</p>
                        </div>
                    )}
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Select Reports</h2>
                            <button
                                onClick={handleSelectAllVerified}
                                disabled={verifiedReports.length === 0}
                                className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-400 rounded-md"
                            >
                                {selectedReportIds.length === verifiedReports.length ? "Deselect All Verified" : "Select All Verified"}
                            </button>
                        </div>
                        
                        <div className="mb-4 flex space-x-2 overflow-x-auto pb-2">
                            {['ALL', 'VERIFIED', 'PENDING', 'REJECTED'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3 py-1 text-xs rounded-full ${
                                        statusFilter === status 
                                            ? 'bg-indigo-600 text-white' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {status} {status === 'VERIFIED' && `(${verifiedReports.length})`}
                                </button>
                            ))}
                        </div>
                        
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                            {isLoading && (
                                <div className="text-center py-10 text-gray-600">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                                    <p className="mt-2">Loading reports...</p>
                                </div>
                            )}
                            
                            {error && !isLoading && (
                                <div className="text-red-500 text-center py-10">
                                    <p>Error: {error}</p>
                                    <button 
                                        className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                                        onClick={() => window.location.reload()}
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}
                            
                            {!isLoading && !error && filteredReports.length === 0 && (
                                <p className="text-center py-10 text-gray-600">
                                    {statusFilter === 'VERIFIED' 
                                        ? "No verified reports available." 
                                        : `No ${statusFilter.toLowerCase()} reports available.`
                                    }
                                </p>
                            )}
                            
                            {!isLoading && !error && filteredReports.map(report => {
                                const isVerified = report.status === 'VERIFIED';
                                const isSelected = selectedReportIds.includes(report._id);
                                const statusColor = isVerified ? 'text-green-600' : 'text-yellow-600';
                                
                                return (
                                    <div 
                                        key={report._id} 
                                        className={`bg-gray-50 p-4 rounded-lg shadow flex items-start gap-4 transition-all ${isSelected ? 'ring-2 ring-indigo-500' : ''} ${!isVerified ? 'opacity-70' : 'cursor-pointer hover:bg-gray-100'}`}
                                        onClick={() => handleCheckboxChange(report._id, isVerified)}
                                    >
                                        <input
                                            type="checkbox"
                                            value={report._id}
                                            checked={isSelected}
                                            onChange={() => handleCheckboxChange(report._id, isVerified)}
                                            disabled={!isVerified}
                                            className="mt-1 h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <span className={`text-xs font-bold uppercase tracking-wider ${statusColor}`}>{report.status}</span>
                                                <span className="text-xs text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="font-semibold text-gray-900 mt-1">{report.category?.replace(/_/g, ' ') || 'Unknown Category'}</p>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{report.notes || 'No notes provided.'}</p>
                                            {!isVerified && (
                                                <p className="text-xs text-yellow-600 mt-1">Only verified reports can be selected</p>
                                            )}
                                        </div>
                                        <img 
                                            src={report.images && report.images[0] ? report.images[0] : 'https://via.placeholder.com/80?text=No+Image'} 
                                            alt="Report thumbnail" 
                                            className="w-16 h-16 rounded-md object-cover flex-shrink-0" 
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="space-y-8">
                        {/* Selected Reports */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Selected Reports</h2>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto">
                                {selectedReports.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No reports selected yet</p>
                                ) : (
                                    selectedReports.map(report => (
                                        <div key={report._id} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{report.category?.replace(/_/g, ' ')}</p>
                                                <p className="text-xs text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleCheckboxChange(report._id, true)}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600">Total Selected: <span className="font-bold text-gray-900">{selectedReportIds.length}</span></p>
                            </div>
                        </div>

                        {/* Alert Form */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Alert Details</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Alert Title</label>
                                    <input 
                                        type="text" 
                                        id="title" 
                                        name="title" 
                                        value={formData.title} 
                                        onChange={handleInputChange} 
                                        required 
                                        className="mt-1 block w-full bg-white border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 text-gray-900" 
                                        placeholder="e.g., Illegal Cutting in Sector 4" 
                                    />
                                </div>
                                <div>
                                    <label htmlFor="severity" className="block text-sm font-medium text-gray-700">Severity</label>
                                    <select 
                                        id="severity" 
                                        name="severity" 
                                        value={formData.severity} 
                                        onChange={handleInputChange} 
                                        required 
                                        className="mt-1 block w-full bg-white border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 text-gray-900"
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="CRITICAL">Critical</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description / Summary</label>
                                    <textarea 
                                        id="description" 
                                        name="description" 
                                        value={formData.description} 
                                        onChange={handleInputChange} 
                                        rows="4" 
                                        required 
                                        className="mt-1 block w-full bg-white border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 text-gray-900" 
                                        placeholder="Summarize the incident..."
                                    ></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitude</label>
                                        <input 
                                            type="number" 
                                            step="any" 
                                            id="longitude" 
                                            name="longitude" 
                                            value={formData.longitude} 
                                            onChange={handleInputChange} 
                                            required 
                                            className="mt-1 block w-full bg-white border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 text-gray-900" 
                                            placeholder="e.g., 88.8004" 
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitude</label>
                                        <input 
                                            type="number" 
                                            step="any" 
                                            id="latitude" 
                                            name="latitude" 
                                            value={formData.latitude} 
                                            onChange={handleInputChange} 
                                            required 
                                            className="mt-1 block w-full bg-white border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 text-gray-900" 
                                            placeholder="e.g., 21.7184" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting || selectedReportIds.length === 0}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center justify-center"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Creating Alert...
                                            </>
                                        ) : (
                                            'Create and Send Alert'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
 
export default NgoCreateAlert;
