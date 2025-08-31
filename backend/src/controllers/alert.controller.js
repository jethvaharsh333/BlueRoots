import { HTTPSTATUS } from "../config/http.config.js";
import { Alert } from "../models/alert.model.js";
import { Report } from "../models/report.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createAlert = async (req, res) => {
  const { title, severity, description, reports: reportIds, longitude, latitude } = req.body;
  console.log(title, severity, description, reportIds, longitude, latitude);

  if (!title || !severity || !description || !reportIds || !longitude || !latitude) {
    return ApiResponse.failure("All fields are required.", HTTPSTATUS.BAD_REQUEST).send(res);
  }

  if (!Array.isArray(reportIds) || reportIds.length === 0) {
    return ApiResponse.failure("At least one report ID must be provided.", HTTPSTATUS.BAD_REQUEST).send(res);
  }

  const reports = await Report.find({ _id: { $in: reportIds }, status: 'VERIFIED' });
  console.log("reports");
  console.log(reports);

  if (reports.length !== reportIds.length) {
    return ApiResponse.failure("One or more reports are invalid or not yet verified.", HTTPSTATUS.BAD_REQUEST).send(res);
  }

  const alert = await Alert.create({
    title,
    severity,
    description,
    reports: reportIds,
    createdBy: req.user._id,
    location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
    }
  });

  return ApiResponse.success(alert, "Alert created and sent to authorities.", HTTPSTATUS.CREATED).send(res);
};

const getAllAlerts = async (req, res) => {
    const alerts = await Alert.find().populate('createdBy', 'name').sort({ createdAt: -1 });
    return ApiResponse.success(alerts, "Alerts fetched successfully.").send(res);
};

const getAlertById = async (req, res) => {
    const alert = await Alert.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate({
          path: 'reports',
          populate: { path: 'user', select: 'name' }
      });

    if (!alert) {
        return ApiResponse.failure("Alert not found.", HTTPSTATUS.NOT_FOUND).send(res);
    }
    
    return ApiResponse.success(alert, "Alert details fetched.").send(res);
};


export {createAlert, getAllAlerts, getAlertById};