import mongoose, { Schema } from "mongoose";


const roleSchema = new Schema(
  {
    roleName: {
      type: String,
      required: true,
      unique: true,
      enum: ["ADMIN", "MODERATOR", "USER", "GUEST"],
    },
  },
  { timestamps: true }
);

export const Role = mongoose.model("Role", roleSchema);