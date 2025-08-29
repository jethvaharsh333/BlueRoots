import mongoose, { Schema } from "mongoose";

const verificationSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            unique: true,
            required: true,
        },
        expires: {
            type: Date,
        }
    }, { timestamps: true }
)

verificationSchema.index({ email: 1, token: 1 }, { unique: true });
verificationSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

export const Verification = mongoose.model("Verification", verificationSchema);