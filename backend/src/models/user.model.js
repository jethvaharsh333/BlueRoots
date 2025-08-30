import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        avatarUrl: {
            type: String,
            default: 'https://avatar.iran.liara.run/public/41'
        },
        firstName: {
            type: String,
        },
        lastName: { type: String, trim: true },
        dateOfBirth: { type: Date },
        isEmailVerified: { type: Boolean, default: false },
        gender: {
            type: String,
            enum: ["male", "female"],
            default: "male",
        },
        ecoPoints: {
            type: Number,
            default: 0,
        },
        accountType: {
            type: String,
            enum: ["default", "google", "github"],
            default: "default",
        },
        refreshToken: {
            type: String
        }
    }, 
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);