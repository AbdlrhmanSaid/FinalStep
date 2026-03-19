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
      enum: ["open", "submitted", "completed", "rejected"],
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
    // Overall task status - auto-computed:
    // "open"      → at least one member hasn't submitted yet
    // "submitted" → at least one member submitted (but not all accepted)
    // "completed" → ALL members' submissions accepted
    // "rejected"  → kept for backward compat / single-member tasks
    status: {
      type: String,
      enum: ["open", "submitted", "rejected", "completed"],
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
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
