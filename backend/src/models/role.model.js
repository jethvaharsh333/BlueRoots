import mongoose, { Schema } from "mongoose";


const roleSchema = new Schema(
  {
    roleName: {
      type: String,
      required: true,
      unique: true,
      enum: ["GOVERNMENT", "NGO", "CITIZEN"],
    },
  },
  { timestamps: true }
);

export const Role = mongoose.model("Role", roleSchema);