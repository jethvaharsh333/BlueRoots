import { HTTPSTATUS } from "../config/http.config.js";
import { Alert } from "../models/alert.model.js";
import { Report } from "../models/report.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getCurrentUser = async(req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken -isEmailVerified");

    return ApiResponse.success(user, "Current user fetched successfully.", HTTPSTATUS.OK).send(res);
}

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  return ApiResponse.success(
    users,
    'All users fetched successfully.',
    HTTPSTATUS.OK
  ).send(res);
};

const logout = async(req, res) => {

    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: "" } },
      { new: true }
    );

    const refreshTokenOptions = {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
    }

    const accessTokenOptions = {
        httpOnly: false,
        secure: false,
        sameSite: "strict",
    }

    return res
      .status(HTTPSTATUS.OK)
      .clearCookie("accessToken", accessTokenOptions)
      .clearCookie("refreshToken", refreshTokenOptions)
      .json(ApiResponse.success(null, "Logged out successfully", HTTPSTATUS.OK));
}

const updateProfile = async(req, res) => {
    const userId = req.user?._id; // set from your auth middleware
    if (!userId) {
      return ApiResponse.failure("Unauthorized", 401).send(res);
    }

    const { username, firstName, lastName, dateOfBirth, gender } = req.body;

    if (username) {
      const existingUser = await User.findOne({ username, _id: { $ne: userId } });
      if (existingUser) {
        return ApiResponse.failure("Username already taken", 400).send(res);
      }
    }

    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime())) {
        return ApiResponse.failure("Invalid date of birth", 400).send(res);
      }
      const today = new Date();
      if (dob >= today) {
        return ApiResponse.failure("Date of birth must be in the past", 400).send(res);
      }
    }


    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(username && { username }),
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(dateOfBirth && { dateOfBirth }),
          ...(gender && { gender }),
        },
      },
      { new: true, runValidators: true, session: req.dbSession }
    ).select("-password -refreshToken"); // hide sensitive fields

    if (!updatedUser) {
      return ApiResponse.failure("User not found", 404).send(res);
    }

    return ApiResponse.success(updatedUser, "Profile updated successfully").send(res);
}

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return ApiResponse.failure(
      "Old and new password are required.",
      HTTPSTATUS.BAD_REQUEST
    ).send(res);
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return ApiResponse.failure(
      "User not found.",
      HTTPSTATUS.NOT_FOUND
    ).send(res);
  }

  const isMatch = await user.isPasswordCorrect(oldPassword);
  if (!isMatch) {
    return ApiResponse.failure(
      "Old password is incorrect.",
      HTTPSTATUS.UNAUTHORIZED
    ).send(res);
  }

  // ✅ Update password (bcrypt will hash via pre("save"))
  user.password = newPassword;

  // clear refresh token on password change
  user.refreshToken = undefined;

  await user.save({ session: req.dbSession });

  return ApiResponse.success(
    null,
    "Password updated successfully. Please log in again.",
    HTTPSTATUS.OK
  ).send(res);
};


const updateEmail = async(req, res) => {

}


const getGovernmentDashboard = async (req, res) => {
  // 1. Fetch key stats about Alerts
  const newAlertsCount = await Alert.countDocuments({ status: 'NEW' });
  const investigatingAlertsCount = await Alert.countDocuments({
    status: 'UNDER_INVESTIGATION',
  });

  // 2. Fetch priority alerts (most recent new alerts)
  const priorityAlerts = await Alert.find({ status: 'NEW' })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('createdBy', 'name')
    .select('title severity createdAt createdBy');

  // 3. Fetch recently updated alerts to show recent activity
  const recentlyUpdatedAlerts = await Alert.find()
    .sort({ updatedAt: -1 })
    .limit(5)
    .populate('createdBy', 'name')
    .select('title status updatedAt severity');

  const dashboardData = {
    stats: {
      newAlerts: newAlertsCount,
      underInvestigation: investigatingAlertsCount,
    },
    priorityAlerts,
    recentlyUpdatedAlerts,
  };

  return ApiResponse.success(
    dashboardData,
    'Government dashboard data fetched successfully.',
    HTTPSTATUS.OK
  ).send(res);
};

const getCitizenDashboard = async (req, res) => {
  const userId = req.user._id;

  // 1. Fetch user's personal stats (ecoPoints)
  const user = await User.findById(userId).select('ecoPoints name');
  if (!user) {
    return ApiResponse.failure('User not found.', HTTPSTATUS.NOT_FOUND).send(res);
  }

  // 2. Fetch aggregate report stats
  const reportsSubmitted = await Report.countDocuments({ user: userId });

  // 3. Fetch recent reports
  const recentReports = await Report.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(3)
    .select('category status createdAt');

  // 4. Fetch leaderboard snippet
  const leaderboard = await User.find({ role: 'PUBLIC' })
    .sort({ ecoPoints: -1 })
    .limit(5)
    .select('name ecoPoints');

  const dashboardData = {
    stats: {
      ecoPoints: user.ecoPoints,
      reportsSubmitted,
    },
    recentReports,
    leaderboard,
  };

  console.log(dashboardData);

  return ApiResponse.success(
    dashboardData,
    'Citizen dashboard data fetched successfully.',
    HTTPSTATUS.OK
  ).send(res);
};

const getNgoDashboard = async (req, res) => {
  const ngoUserId = req.user._id;

  // 1. Fetch key stats
  const pendingReportsCount = await Report.countDocuments({ status: 'PENDING' });
  const alertsCreatedCount = await Alert.countDocuments({ createdBy: ngoUserId });

  // 2. Fetch recent activity (latest pending reports)
  const recentActivity = await Report.find({ status: 'PENDING' })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('category location createdAt');

  // 3. Fetch all report locations for the main map
  // For performance on large datasets, consider pagination or geographic clustering
  const mapPoints = await Report.find({}).select('location status category');

  const dashboardData = {
    stats: {
      pendingReports: pendingReportsCount,
      alertsCreated: alertsCreatedCount,
    },
    recentActivity,
    mapPoints,
  };

  return ApiResponse.success(
    dashboardData,
    'NGO dashboard data fetched successfully.',
    HTTPSTATUS.OK
  ).send(res);
};

export { getCurrentUser, logout, updateProfile, updatePassword, updateEmail, getAllUsers, getGovernmentDashboard, getCitizenDashboard, getNgoDashboard };