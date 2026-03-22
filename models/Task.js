import mongoose, { Schema, model, models } from "mongoose";

const MemberSubmissionSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    links: [
      {
        type: String,
        trim: true,
        validate: {
          validator: function (v) {
            try {
              new URL(v);
              return true;
            } catch {
              return false;
            }
          },
          message: (props) => `${props.value} is not a valid URL!`,
        },
      },
    ],
    submittedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["open", "submitted", "completed", "rejected", "ended"],
      default: "open",
    },
    review: {
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      reviewedAt: {
        type: Date,
        default: null,
      },
      note: {
        type: String,
        trim: true,
      },
    },
  },
  { _id: true },
);

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "submitted", "rejected", "completed", "ended"],
      default: "open",
    },
    referenceLink: {
      type: String,
      trim: true,
      default: "",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    submissionMethod: {
      type: String,
      enum: ["text", "link", "both"],
      default: "both",
    },
    submissionDescription: {
      type: String,
      trim: true,
      default: "",
    },
    // Per-member submissions (replaces the single submission/review fields)
    memberSubmissions: [MemberSubmissionSchema],
    // Legacy single submission kept for backward compatibility
    submission: {
      description: {
        type: String,
        trim: true,
      },
      links: [
        {
          type: String,
          trim: true,
        },
      ],
      submittedAt: {
        type: Date,
        default: null,
      },
    },
    review: {
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      reviewedAt: {
        type: Date,
        default: null,
      },
      note: {
        type: String,
        trim: true,
      },
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        if (
          ret.status !== "completed" &&
          ret.status !== "rejected" &&
          ret.status !== "submitted" &&
          ret.dueDate &&
          new Date(ret.dueDate) < new Date()
        ) {
          ret.status = "ended";
        }

        if (ret.memberSubmissions && Array.isArray(ret.memberSubmissions)) {
          ret.memberSubmissions.forEach((sub) => {
            if (
              sub.status !== "completed" &&
              sub.status !== "rejected" &&
              sub.status !== "submitted" &&
              ret.dueDate &&
              new Date(ret.dueDate) < new Date()
            ) {
              sub.status = "ended";
            }
          });
        }
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        if (
          ret.status !== "completed" &&
          ret.status !== "rejected" &&
          ret.status !== "submitted" &&
          ret.dueDate &&
          new Date(ret.dueDate) < new Date()
        ) {
          ret.status = "ended";
        }

        if (ret.memberSubmissions && Array.isArray(ret.memberSubmissions)) {
          ret.memberSubmissions.forEach((sub) => {
            if (
              sub.status !== "completed" &&
              sub.status !== "rejected" &&
              sub.status !== "submitted" &&
              ret.dueDate &&
              new Date(ret.dueDate) < new Date()
            ) {
              sub.status = "ended";
            }
          });
        }
        return ret;
      },
    },
  },
);

TaskSchema.index({ title: "text", description: "text" });

TaskSchema.virtual("assignedUsers", {
  ref: "User",
  localField: "assignedTo",
  foreignField: "_id",
});

TaskSchema.virtual("project", {
  ref: "Project",
  localField: "projectId",
  foreignField: "_id",
  justOne: true,
});

const Task = models.Task || model("Task", TaskSchema);
export default Task;
