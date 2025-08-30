import { Report } from '../models/report.model.js';
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTPSTATUS } from "../config/http.config.js";

const createReport = async (req, res) => {
    const { category, notes, longitude, latitude, images } = req.body;
    console.log( category, notes, longitude, latitude, images );

    
    if (!category || !longitude || !latitude) {
        return ApiResponse.failure("Category and location coordinates are required.", HTTPSTATUS.BAD_REQUEST).send(res);
    }

    if (!images || images.length === 0) {
        return ApiResponse.failure("At least one image is required.", HTTPSTATUS.BAD_REQUEST).send(res);
    }

    const report = await Report.create({
        user: req.user._id,
        category,
        notes,
        images,
        location: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { ecoPoints: 10 } });

    return ApiResponse.success(report, "Report submitted successfully. You've earned 10 ecoPoints!", HTTPSTATUS.CREATED).send(res);
};

const getMyReports = async (req, res) => {
    const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
    return ApiResponse.success(reports, "Your reports fetched successfully.").send(res);
};

// GET /users?status=active
const getAllReports = async (req, res) => {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const reports = await Report.find(filter).populate('user', 'name email').sort({ createdAt: -1 });
    return ApiResponse.success(reports, `Reports with status ${status || 'ALL'} fetched.`).send(res);
};

// app.get("/users/:id",....)
const getReportById = async (req, res) => {
    const report = await Report.findById(req.params.id).populate('user', 'name email');

    if (!report) {
        return ApiResponse.failure("Report not found.", HTTPSTATUS.NOT_FOUND).send(res);
    }
    
    return ApiResponse.success(report, "Report details fetched.").send(res);
};

const verifyReport = async (req, res) => {
    const { status } = req.body;

    if (!['VERIFIED', 'REJECTED'].includes(status)) {
        return ApiResponse.failure("Invalid status provided.", HTTPSTATUS.BAD_REQUEST).send(res);
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
        return ApiResponse.failure("Report not found.", HTTPSTATUS.NOT_FOUND).send(res);
    }

    if (report.status !== 'PENDING') {
        return ApiResponse.failure(`Report has already been ${report.status.toLowerCase()}.`, HTTPSTATUS.BAD_REQUEST).send(res);
    }

    report.status = status;
    report.verifiedBy = req.user._id;
    await report.save({ session: req.dbSession });

    if (status === 'VERIFIED') {
        await User.findByIdAndUpdate(report.user, { $inc: { ecoPoints: 50 } }, { session: req.dbSession });
    }

    return ApiResponse.success(report, `Report has been ${status.toLowerCase()}.`).send(res);
};

export { createReport, getMyReports, getAllReports, getReportById, verifyReport };
