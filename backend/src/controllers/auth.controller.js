import { HTTPSTATUS } from "../config/http.config.js";
import { generateAccessAndRefereshToken } from "../helpers/generate-access-and-referesh-token.js";
import { generateVerificationToken } from "../helpers/generate-verification-token.js";
import { Role } from "../models/role.model.js";
import { UserRole } from "../models/user-role.model.js";
import { User } from "../models/user.model.js";
import { Verification } from "../models/verification.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/mail.js";

const register = async (req, res) => {
    const { username, email, password } = req.body;

    if ([username, email, password].some(f => f?.trim() === "")) {
        return ApiResponse.failure("All fields are necessary.", HTTPSTATUS.BAD_REQUEST).send(res);
    }

    const existedUser = await User.findOne({
        $or: [{ username: username.toLowerCase() }, { email }]
    });

    if (existedUser) {
        return ApiResponse.failure("User with username or email already exists.", HTTPSTATUS.CONFLICT).send(res);
    }

    const user = new User({
        username: username.toLowerCase(),
        email,
        password,
        isEmailVerified: false,
        accountType: "default",
    });
    await user.save({ session: req.dbSession });

    const citizenRole = await Role.findOne({ roleName: "CITIZEN" });
    if (!citizenRole) {
        return ApiResponse.failure("Default role not found. Please seed roles first.", HTTPSTATUS.INTERNAL_SERVER_ERROR).send(res);
    }

    const userRole = new UserRole({
        userId: user._id,
        roleId: citizenRole._id,
    });
    await userRole.save({ session: req.dbSession });

    const verificationToken = await generateVerificationToken(email, req.dbSession);

    const subject = "User Verification";
    const message = `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #4CAF50;">Welcome!</h2>
                <p style="background-color: #f9f9f9; padding: 10px; border-radius: 5px;">
                    Please verify your email address to get started. ${verificationToken.token}
                    This code will be expired in ${verificationToken.expires.getMinutes()}
                </p>
            </div>`;

    await sendEmail(verificationToken.email, subject, message);

    return ApiResponse.success(null, "Please check your inbox for verification.", HTTPSTATUS.OK).send(res);
}

const verifyEmail = async (req, res) => {
    console.log(req.body.email, ": ", req.body.code);
    const { email, code } = req.body;

    if ([email, code].some(f => f?.trim() === "")) {
        return ApiResponse.failure("All fields are necessary.", HTTPSTATUS.BAD_REQUEST).send(res);
    }

    const verification = Verification.findOne({ email, code });

    if (verification == null) {
        return ApiResponse.failure("Invalid code.", HTTPSTATUS.BAD_REQUEST).send(res);
    }

    const user = await User.findOne({ email });
    user.isEmailVerified = true;
    await user.save({ session: req.dbSession });

    const subject = "User Verification Successful!";
    const message = `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #4CAF50;">Welcome!</h2>
                <p style="font-size: 16px;">Thank you for joining our service.</p>
                <p style="background-color: #f9f9f9; padding: 10px; border-radius: 5px;">
                    You have successfully joined our services.
                </p>
            </div>`;

    await sendEmail(email, subject, message);

    return ApiResponse.success(null, "Registered Successful.", HTTPSTATUS.CREATED).send(res);
}

const resendVerificationCode = async (req, res) => {
    const { email } = req.body;
    if (email === "") {
        return ApiResponse.failure("Email field is necessary.", HTTPSTATUS.BAD_REQUEST).send(res);
    }

    const user = await User.findOne({ email });
    if (user == null) {
        return ApiResponse.failure("User not found.", HTTPSTATUS.NOT_FOUND).send(res);
    }

    const verificationToken = await generateVerificationToken(email, req.dbSession);

    const subject = "User Verification [RESEND]";
    const message = `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <p style="background-color: #f9f9f9; padding: 10px; border-radius: 5px;">
                    Please verify your email address to get started. ${verificationToken.token}
                    This code will be expired in ${verificationToken.expires.getMinutes()} Minutes.
                </p>
            </div>`;

    await sendEmail(email, subject, message);

    return ApiResponse.success(null, "Resend verification email successful.", HTTPSTATUS.CREATED).send(res);
}

const login = async (req, res) => {
    const { identifier, password } = req.body;

    if ([identifier, password].some(f => f?.trim() === "")) {
        return ApiResponse.failure("All fields are necessary.", HTTPSTATUS.BAD_REQUEST).send(res);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let user = null;
    if (emailRegex.test(identifier)) {
        user = await User.findOne({ email: identifier });
    } else {
        user = await User.findOne({ username: identifier });
    }

    if (!user) {
        return ApiResponse.failure("User not found.", HTTPSTATUS.NOT_FOUND).send(res);
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        return ApiResponse.failure("Invalid password.", HTTPSTATUS.CONFLICT).send(res);
    }

    if (!user.isEmailVerified) {
        return ApiResponse.failure("Please verify your email.", HTTPSTATUS.FORBIDDEN).send(res);
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const roles = await UserRole.findOne({userId: user._id}).populate("roleId");
    const role = roles?.roleId?.roleName || "GUEST";

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
        .status(200)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .json(ApiResponse.success(
            { user: loggedInUser, role: role }, "Login Successfull", HTTPSTATUS.OK
        ));
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email?.trim()) {
        return ApiResponse.failure("Email is required.", HTTPSTATUS.BAD_REQUEST).send(res);
    }

    const user = await User.findOne({ email });
    if (!user) {
        return ApiResponse.failure("If an account exists, password reset email has been sent.", HTTPSTATUS.OK).send(res);
    }

    const verificationToken = await generateVerificationToken(email, req.dbSession);

    const subject = "Forgot Password";
    const message = `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #4CAF50;">Welcome!</h2>
                <p style="background-color: #f9f9f9; padding: 10px; border-radius: 5px;">
                    Please enter the code while entering your new password. ${verificationToken.token}
                    This code will be expired in ${verificationToken.expires.getMinutes()} minutes.
                </p>
            </div>`;

    await sendEmail(verificationToken.email, subject, message);

    return ApiResponse.success(null, "Please check your inbox.", HTTPSTATUS.OK).send(res);
}

const resetPassword = async (req, res) => {
    const { newPassword, code, email } = req.body;
    console.log(newPassword, code, email);

    if ([newPassword, code, email].some(f => !f || String(f).trim() === "")) {
        return ApiResponse.failure("All fields are necessary.", HTTPSTATUS.BAD_REQUEST).send(res);
    }

    const verification = await Verification.findOne({
        email: email.trim(),
        token: code.trim()
    });
    console.log(verification);

    if (!verification) {
        return ApiResponse.failure("Invalid code.", HTTPSTATUS.BAD_REQUEST).send(res);
    }

    if (verification.expires < new Date()) {
        return ApiResponse.failure("Code has expired.", HTTPSTATUS.BAD_REQUEST).send(res);
    }

    var user = await User.findOne({ email });

    user.password = newPassword;

    await user.save({ session: req.dbSession });

    return ApiResponse.success(null, "Password reset successfully.", HTTPSTATUS.CREATED).send(res);
}

const googleAuth = async (req, res) => {
    const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${process.env.GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent('openid email profile')}` +
        `&access_type=offline` +
        `&prompt=consent`; // optional but useful for refresh tokens in dev
    res.redirect(redirectUrl);
};

const googleCallback = async (req, res) => {
    const code = req.query.code;

    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", null, {
        params: {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code"
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    const { access_token } = tokenRes.data;

    const userRes = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo`, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });

    const { email, name, picture } = userRes.data;

    let user = await User.findOne({ email });

    if (!user) {
        user = new User({
            userName: email.split('@')[0],
            email,
            avatarUrl: picture,
            firstName: name,
            accountType: "google"
        });
    }

    await user.save({ session: req.dbSession });

    const { accessToken, refreshToken } = await generateAccessAndRefereshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

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
        .status(200)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .json(ApiResponse.success(
            { user: loggedInUser }, "Login Successfull", HTTPSTATUS.OK
        ));
}

const generateAccessToken = async (req, res) => {
    const token = req.cookies?.refreshToken;
    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);

    const accessToken = user.generateAccessToken();

    const accessTokenOptions = {
        httpOnly: false,
        secure: false,
        sameSite: "strict",
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .json(
            ApiResponse.success(
                null, "Successfully provided access token.", HTTPSTATUS.OK
            )
        )
}


export { register, verifyEmail, resendVerificationCode, login, forgotPassword, resetPassword, googleAuth, googleCallback, generateAccessToken }