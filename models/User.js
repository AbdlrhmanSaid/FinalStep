import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    title: {
      type: String,
      default: "",
      maxlength: 60,
      trim: true,
    },
    privacy: {
      showProjects: { type: Boolean, default: true },
      showTasks: { type: Boolean, default: true },
    },
    links: {
      linkedin: { type: String, default: "", trim: true },
      github: { type: String, default: "", trim: true },
      facebook: { type: String, default: "", trim: true },
      custom: [
        {
          label: { type: String, trim: true, maxlength: 40 },
          url: { type: String, trim: true },
        },
      ],
    },
    projectsLeading: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    projectsMember: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
  },
  { timestamps: true },
);

const User = models.User || model("User", UserSchema);
export default User;
