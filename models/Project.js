import mongoose, { Schema, models, model } from "mongoose";
import Task from "./Task";

const InviteSchema = new Schema({
  email: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

const JoinSchema = new Schema({
  email: { type: String, required: true },
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
    public: { type: Boolean },
    status: {
      type: String,
      enum: ["open", "finished"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.post("findOneAndDelete", async function (doc) {
  if (doc?._id) {
    await Task.deleteMany({ projectId: doc._id });
  }
});

const Project = models.Project || model("Project", ProjectSchema);
export default Project;
