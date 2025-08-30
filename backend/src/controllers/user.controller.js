import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getCurrentUser = async(req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken -isEmailVerified");

    return ApiResponse.success(user, "Current user fetched successfully.", HTTPSTATUS.OK).send(res);
}

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

    const updateData = {};
    if (username) updateData.username = username.trim();
    if (firstName) updateData.firstName = firstName.trim();
    if (lastName) updateData.lastName = lastName.trim();
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
    if (gender) updateData.gender = gender;

    // update and return new user data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true, context: "query" }
    ).select("-password -refreshToken"); // hide sensitive fields

    if (!updatedUser) {
      return ApiResponse.failure("User not found", 404).send(res);
    }

    return ApiResponse.success(updatedUser, "Profile updated successfully").send(res);
  
}

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return ApiResponse.error(
      "Old and new password are required.",
      HTTPSTATUS.BAD_REQUEST
    ).send(res);
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return ApiResponse.error(
      "User not found.",
      HTTPSTATUS.NOT_FOUND
    ).send(res);
  }

  // ✅ Verify old password
  const isMatch = await user.isPasswordCorrect(oldPassword);
  if (!isMatch) {
    return ApiResponse.error(
      "Old password is incorrect.",
      HTTPSTATUS.UNAUTHORIZED
    ).send(res);
  }

  // ✅ Update password (bcrypt will hash via pre("save"))
  user.password = newPassword;

  // clear refresh token on password change
  user.refreshToken = undefined;

  await user.save();

  return ApiResponse.success(
    null,
    "Password updated successfully. Please log in again.",
    HTTPSTATUS.OK
  ).send(res);
};


const updateEmail = async(req, res) => {

}


export { getCurrentUser, logout, updateProfile, updatePassword, updateEmail };