import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import Task from "@/models/Task";
import Section from "@/models/Section";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const projects = await Project.find({});
    let migratedCount = 0;
    
    for (const project of projects) {
      // Find if General section already exists for this project
      let generalSection = await Section.findOne({ projectId: project._id, isDefault: true });
      
      // If no general section, create one
      if (!generalSection) {
        generalSection = new Section({
          title: "General",
          projectId: project._id,
          isDefault: true,
          members: [], // open to all project members
        });
        await generalSection.save();
      }

      // Force project to have hasSections = false to not break legacy UI initially
      project.hasSections = false;
      await project.save();

      // Find all tasks for this project that don't have a sectionId
      const tasksToUpdate = await Task.find({ projectId: project._id, sectionId: null });
      for (const task of tasksToUpdate) {
        task.sectionId = generalSection._id;
        await task.save();
      }
      migratedCount++;
    }

    return NextResponse.json({ success: true, migratedCount, message: "Migration completed successfully" });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
