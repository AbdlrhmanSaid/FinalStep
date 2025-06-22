// models/InviteRequest.js
import mongoose, { Schema, models, model } from "mongoose";

const InviteRequestSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default models.InviteRequest ||
  model("InviteRequest", InviteRequestSchema);
