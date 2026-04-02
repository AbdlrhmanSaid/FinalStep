import mongoose, { Schema, models, model } from "mongoose";

const SectionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    sectionRoles: {
      type: Map,
      of: String, // values should be "lead" or "member"
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Instead of cascading delete, we unlink the section from all tasks
SectionSchema.post("findOneAndDelete", async function (doc) {
  if (doc?._id) {
    try {
      const Task = mongoose.models.Task || mongoose.model("Task");
      
      // Pull this section straight out of the sectionAssignments array for all tasks
      await Task.updateMany(
        { "sectionAssignments.sectionId": doc._id },
        { $pull: { sectionAssignments: { sectionId: doc._id } } }
      );
      
      // Clear legacy sectionId as well
      await Task.updateMany(
        { sectionId: doc._id },
        { $unset: { sectionId: "" } }
      );
    } catch (error) {
      console.error("Error in section post-delete hook (unlink):", error);
    }
  }
});

const Section = models.Section || model("Section", SectionSchema);
export default Section;
