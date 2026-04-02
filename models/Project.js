import mongoose, { Schema, models, model } from "mongoose";
import Task from "./Task";
import InviteRequest from "./InviteRequest";

const InviteSchema = new Schema({
  email: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

const JoinSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coLeaders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    inviteRequests: [InviteSchema],
    joinRequests: [JoinSchema],
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    customRoles: {
      type: Map,
      of: String,
      default: {},
    },
    public: { type: Boolean, default: true },
    deadline: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["open", "finished"],
      default: "open",
    },
    hasSections: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

ProjectSchema.post("findOneAndDelete", async function (doc) {
  if (doc?._id) {
    try {
      await Task.deleteMany({ projectId: doc._id });
      await InviteRequest.deleteMany({ projectId: doc._id });
      const Section = mongoose.models.Section || mongoose.model("Section");
      await Section.deleteMany({ projectId: doc._id });
    } catch (error) {
      console.error("Error in post-delete hook:", error);
    }
  }
});

const Project = models.Project || model("Project", ProjectSchema);
export default Project;
