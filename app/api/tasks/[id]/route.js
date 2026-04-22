import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Task from "@/models/Task";
import Project from "@/models/Project";
import User from "@/models/User";
import { sendTaskSubmissionEmail, sendTaskReviewEmail } from "@/lib/emailService";
import { recalculateTaskDates, triggerDependentTasks } from "@/lib/server/taskDates";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    await dbConnect();

    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid task ID" },
        { status: 400 },
      );
    }

    const task = await Task.findById(id)
      .populate("projectId")
      .populate("assignedTo")
      .populate("createdBy")
      .populate("review.reviewedBy")
      .populate("memberSubmissions.userId")
      .populate("memberSubmissions.review.reviewedBy");

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("GET Task Error:", error);
    return NextResponse.json({ error: "Failed to get task" }, { status: 500 });
  }
}

/**
 * Recomputes and sets task.status based on all memberSubmissions statuses.
 * - If ALL members accepted → "completed"
 * - If any member submitted (and none rejected yet with all pending) → "submitted"
 * - Otherwise → "open"  (includes rejected cases so members can resubmit)
 */
function recomputeTaskStatus(task) {
  const subs = task.memberSubmissions || [];

  if (subs.length === 0) return; // no members, keep existing status

  const allCompleted = subs.every((s) => s.status === "completed");
  const anySubmitted = subs.some((s) => s.status === "submitted");

  if (allCompleted) {
    task.status = "completed";
  } else if (anySubmitted) {
    task.status = "submitted";
  } else {
    task.status = "open";
  }
}


export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();
    const userId = request.headers.get("userId");
    const { id } = await params;

    const task = await Task.findById(id).populate("projectId");
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const project = task.projectId;

    // ── Deadline check ───────────────────────────────────────────────────────
    // Members can still submit after deadline, but it will be marked as late
    // and will affect their evaluation score. Only general edits (PUT without
    // action) are restricted to leaders after the deadline.
    const isDeadlinePassed =
      project && task.dueDate && new Date(task.dueDate) < new Date();


    // ── Is the current user a project leader / co-leader? ────────────────────
    const isLeader =
      project?.leaderId?.toString() === userId ||
      project?.coLeaders?.map((id) => id.toString()).includes(userId);

    // ╔══════════════════════════════════════════════════════════════════════╗
    // ║  ACTION: member submits their own submission                        ║
    // ╚══════════════════════════════════════════════════════════════════════╝
    if (body.action === "member_submit") {
      const { submittingUserId, submission } = body;

      if (
        task.submissionMethod !== "link" &&
        !submission?.description?.trim()
      ) {
        return NextResponse.json(
          { error: "Submission requires description" },
          { status: 400 },
        );
      }

      // Validate links if method is link or both
      const links = submission.links || [];
      if (task.submissionMethod !== "text") {
        if (links.length === 0) {
          return NextResponse.json(
            { error: "Submission requires at least one link" },
            { status: 400 },
          );
        }
        const invalidLinks = links.filter((link) => {
          try {
            new URL(link);
            return false;
          } catch {
            return true;
          }
        });
        if (invalidLinks.length > 0) {
          return NextResponse.json(
            { error: `Invalid URLs: ${invalidLinks.join(", ")}` },
            { status: 400 },
          );
        }
      }

      // Ensure the task has memberSubmissions initialised for all assignedTo
      if (!task.memberSubmissions || task.memberSubmissions.length === 0) {
        task.memberSubmissions = task.assignedTo.map((uid) => ({
          userId: uid,
          status: "open",
        }));
      }

      // Find or create this user's submission entry
      let memberSub = task.memberSubmissions.find(
        (s) => s.userId?.toString() === submittingUserId,
      );

      if (!memberSub) {
        task.memberSubmissions.push({
          userId: submittingUserId,
          status: "open",
        });
        memberSub = task.memberSubmissions[task.memberSubmissions.length - 1];
      }

      if (submittingUserId !== userId && !isLeader) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      if (task.dependsOn?.length > 0 && !task.startDate) {
        return NextResponse.json(
          { error: "لا بمكنك التسليم: هذه المهمة تعتمد على مهام لم تكتمل بعد" },
          { status: 403 },
        );
      }

      // Only allow submit when status is open, submitted, rejected, completed, or ended
      if (![
        "open",
        "submitted",
        "rejected",
        "completed",
        "ended",
      ].includes(memberSub.status)) {
        return NextResponse.json(
          {
            error: "Cannot resubmit: submission is already under review",
          },
          { status: 400 },
        );
      }

      memberSub.description = submission.description;
      memberSub.links = links;
      memberSub.submittedAt = new Date();
      memberSub.status = "submitted";

      // Mark as late submission if deadline has passed
      if (isDeadlinePassed) {
        // Block if task creator disabled late submissions
        if (task.allowLateSubmission === false) {
          return NextResponse.json(
            { error: "Late submissions are not allowed for this task." },
            { status: 403 },
          );
        }
        memberSub.isLateSubmission = true;
        const dueDate = new Date(task.dueDate);
        const now = new Date();
        const diffMs = now - dueDate;
        memberSub.lateDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      } else {
        memberSub.isLateSubmission = false;
        memberSub.lateDays = 0;
      }

      const previousStatus = task.status;
      recomputeTaskStatus(task);
      task.markModified("memberSubmissions");
      await recalculateTaskDates(task);
      const updated = await task.save();

      if (previousStatus !== "completed" && updated.status === "completed") {
        await triggerDependentTasks(updated._id);
      }

      // Send Emails asynchronously
      (async () => {
        try {
          const leaders = await User.find({ 
            _id: { $in: [project.leaderId, ...(project.coLeaders || [])] } 
          }).select("email");
          const submiter = await User.findById(submittingUserId).select("name email");
          const leaderEmails = leaders.map(u => u.email).filter(Boolean);
          
          if (leaderEmails.length > 0 && submiter) {
            await sendTaskSubmissionEmail({
              leaderEmails,
              taskTitle: task.title,
              projectName: project.title,
              taskId: task._id.toString(),
              memberName: submiter.name || submiter.email
            });
          }
        } catch (err) {
          console.error("Error sending Task Submission Email:", err);
        }
      })();

      return NextResponse.json(updated);
    }

    // ╔══════════════════════════════════════════════════════════════════════╗
    // ║  ACTION: leader reviews a specific member's submission              ║
    // ╚══════════════════════════════════════════════════════════════════════╝
    if (body.action === "review_member") {
      if (!isLeader) {
        return NextResponse.json(
          { error: "Only the project leader can review submissions" },
          { status: 403 },
        );
      }

      const { targetUserId, reviewAction, reviewNote } = body;

      if (!["completed", "rejected"].includes(reviewAction)) {
        return NextResponse.json(
          { error: "reviewAction must be 'completed' or 'rejected'" },
          { status: 400 },
        );
      }

      if (reviewAction === "rejected" && !reviewNote?.trim()) {
        return NextResponse.json(
          { error: "Rejection reason is required" },
          { status: 400 },
        );
      }

      // Ensure memberSubmissions are initialised
      if (!task.memberSubmissions || task.memberSubmissions.length === 0) {
        task.memberSubmissions = task.assignedTo.map((uid) => ({
          userId: uid,
          status: "open",
        }));
      }

      const memberSub = task.memberSubmissions.find(
        (s) => s.userId?.toString() === targetUserId,
      );

      if (!memberSub) {
        return NextResponse.json(
          { error: "No submission found for this user" },
          { status: 404 },
        );
      }

      if (memberSub.status !== "submitted") {
        return NextResponse.json(
          { error: "Can only review a submitted submission" },
          { status: 400 },
        );
      }

      memberSub.status = reviewAction; // "completed" or "rejected"
      memberSub.review = {
        reviewedBy: userId,
        reviewedAt: new Date(),
        note: reviewNote || "",
      };

      const previousStatus = task.status;
      recomputeTaskStatus(task);
      task.markModified("memberSubmissions");
      await recalculateTaskDates(task);
      const updated = await task.save();

      if (previousStatus !== "completed" && updated.status === "completed") {
        await triggerDependentTasks(updated._id);
      }

      // Send Emails asynchronously
      (async () => {
        try {
          const targetUser = await User.findById(targetUserId).select("email");
          if (targetUser && targetUser.email) {
            await sendTaskReviewEmail({
              memberEmail: targetUser.email,
              taskTitle: task.title,
              projectName: project.title,
              taskId: task._id.toString(),
              isApproved: reviewAction === "completed"
            });
          }
        } catch (err) {
          console.error("Error sending Task Review Email:", err);
        }
      })();

      return NextResponse.json(updated);
    }

    // ╔══════════════════════════════════════════════════════════════════════╗
    // ║  FALLBACK: general field update (title, description, assignedTo …)  ║
    // ╚══════════════════════════════════════════════════════════════════════╝

    // If assignedTo is being updated, sync memberSubmissions
    if (body.sectionAssignments || body.assignedTo) {
      let newAssigned = [];
      if (body.sectionAssignments && body.sectionAssignments.length > 0) {
        for (const assignment of body.sectionAssignments) {
          for (const uid of assignment.members || []) {
            if (!newAssigned.includes(uid.toString())) {
              newAssigned.push(uid.toString());
            }
          }
        }
        task.sectionAssignments = body.sectionAssignments;
        task.sectionId = body.sectionAssignments[0].sectionId;
      } else {
        newAssigned = body.assignedTo || [];
      }

      const existing = task.memberSubmissions || [];

      // Keep existing submissions for users who are still assigned
      const kept = existing.filter((s) =>
        newAssigned.includes(s.userId?.toString()),
      );

      // Add blank entries for newly added users
      const existingIds = kept.map((s) => s.userId?.toString());
      const newEntries = newAssigned
        .filter((uid) => !existingIds.includes(uid))
        .map((uid) => ({ userId: uid, status: "open" }));

      task.memberSubmissions = [...kept, ...newEntries];
      task.assignedTo = newAssigned;
      task.markModified("memberSubmissions");
      task.markModified("assignedTo");
      task.markModified("sectionAssignments");
      task.markModified("sectionId");

      // Update other allowed fields
      const allowedFields = [
        "title",
        "description",
        "priority",
        "durationDays",
        "referenceLink",
        "submissionMethod",
        "submissionDescription",
        "allowLateSubmission",
        "dependsOn",
        "dueDate"
      ];
      allowedFields.forEach((f) => {
        if (body[f] !== undefined) {
          if (f === "dueDate" && body[f] === "") {
            task[f] = null;
          } else if (f === "dependsOn" && (!body[f] || (Array.isArray(body[f]) && body[f].length === 0))) {
            task[f] = [];
          } else {
            task[f] = body[f];
          }
        }
      });

      recomputeTaskStatus(task);
      await recalculateTaskDates(task);
      const updated = await task.save();
      return NextResponse.json(updated);
    }

    // Simple field updates (title, description, priority, dueDate …)
    // Only leaders can do general field updates after deadline
    if (isDeadlinePassed) {
      const isLeader =
        project?.leaderId?.toString() === userId ||
        project?.coLeaders?.map((id) => id.toString()).includes(userId);
      if (!isLeader) {
        return NextResponse.json(
          {
            error:
              "Task deadline has passed. Only the project leader can make changes.",
          },
          { status: 403 },
        );
      }
    }

    const allowedFields = [
      "title",
      "description",
      "priority",
      "durationDays",
      "referenceLink",
      "submissionMethod",
      "submissionDescription",
      "allowLateSubmission",
      "dependsOn",
      "dueDate"
    ];
    allowedFields.forEach((f) => {
      if (body[f] !== undefined) {
        if (f === "dueDate" && body[f] === "") {
          task[f] = null;
        } else if (f === "dependsOn" && (!body[f] || (Array.isArray(body[f]) && body[f].length === 0))) {
          task[f] = [];
        } else {
          task[f] = body[f];
        }
      }
    });

    if (body.sectionAssignments) {
        task.sectionAssignments = body.sectionAssignments;
        task.sectionId = body.sectionAssignments[0]?.sectionId;
        task.markModified("sectionAssignments");
    }

    await recalculateTaskDates(task);
    const updated = await task.save();
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT Task Error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await Task.findByIdAndDelete(id);

    if (task.projectId) {
      await Project.findByIdAndUpdate(task.projectId, {
        $pull: { tasks: task._id },
      });
    }

    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    console.error("DELETE Task Error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 },
    );
  }
}
