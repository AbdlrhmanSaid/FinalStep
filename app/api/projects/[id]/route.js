import dbConnect from "../../../../lib/db";
import Project from "../../../../models/Project";

// 👇 لازم نسجل الموديلات المستخدمة في populate
import "../../../../models/User";
import "../../../../models/Task";
import InviteRequest from "../../../../models/InviteRequest";

import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 },
      );
    }

    const project = await Project.findById(id)
      .populate("leaderId")
      .populate("coLeaders")
      .populate("members")
      .populate({ path: "joinRequests.userId", strictPopulate: false })
      .populate({
        path: "tasks",
        populate: [
          { path: "assignedTo", strictPopulate: false },
          { path: "createdBy", strictPopulate: false },
        ],
      });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error("GET /api/projects/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 },
    );
  }
}

// DELETE /api/projects/[id]
export async function DELETE(request, context) {
  try {
    await dbConnect();
    const { params } = await context;
    const { id } = params;
    const userId = request.headers.get("userId");

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const isAuthorized =
      project.leaderId.toString() === userId ||
      project.coLeaders.map((id) => id.toString()).includes(userId);

    if (!isAuthorized) {
      return NextResponse.json(
        {
          error:
            "Unauthorized: Only the leader or co-leaders can delete this project.",
        },
        { status: 403 },
      );
    }

    // ✅ هنا التعديل المهم: استخدم findOneAndDelete لتفعيل الـ hook
    await Project.findOneAndDelete({ _id: id });

    return NextResponse.json(
      { message: "Project and its related tasks deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/projects/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}

// PUT /api/projects/[id]
export async function PUT(request, context) {
  try {
    await dbConnect();

    const { params } = context;
    const { id } = await params;
    const userId = request.headers.get("userId");
    const body = await request.json();

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const isAuthorized =
      project.leaderId.toString() === userId ||
      project.coLeaders.map((id) => id.toString()).includes(userId);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // منع تعديل leaderId
    if ("leaderId" in body) delete body.leaderId;

    // ✅ Fast path: لو الطلب بس تغيير status (مثل إعادة فتح أو إنهاء المشروع)
    // نعمله مباشرة بدون ما نلعب في InviteRequests أو أي حاجة تانية
    const bodyKeys = Object.keys(body);
    const isStatusOnlyUpdate = bodyKeys.length === 1 && "status" in body;

    if (isStatusOnlyUpdate) {
      const validStatuses = ["open", "finished"];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: "Invalid status value" },
          { status: 400 },
        );
      }
      const updatedProject = await Project.findByIdAndUpdate(
        id,
        { status: body.status },
        { new: true, runValidators: true },
      );
      return NextResponse.json(updatedProject, { status: 200 });
    }

    const updateFields = { ...body };
    delete updateFields.inviteRequests; // handled separately

    // ✅ تحقق من صلاحية قيمة status إن تم إرسالها
    if ("status" in updateFields) {
      const validStatuses = ["open", "finished"];
      if (!validStatuses.includes(updateFields.status)) {
        return NextResponse.json(
          { error: "Invalid status value" },
          { status: 400 },
        );
      }
    }

    // ✅ التحقق من الـ deadline - لو عدى الديدلاين، بس الـ leader (مش co-leader) يقدر يعدل
    const isLeaderOnly = project.leaderId.toString() === userId;
    if (
      !isLeaderOnly &&
      project.deadline &&
      new Date(project.deadline) < new Date()
    ) {
      return NextResponse.json(
        {
          error:
            "Project deadline has passed. Only the project leader can make changes.",
        },
        { status: 403 },
      );
    }

    if ("inviteRequests" in body) {
      const inviteRequests = body.inviteRequests || [];
      // حذف الدعوات القديمة من جدول InviteRequest
      await InviteRequest.deleteMany({ projectId: id });

      // إدخال الدعوات الجديدة إلى جدول InviteRequest
      if (inviteRequests.length > 0) {
        const invites = inviteRequests.map(({ email }) => ({
          email,
          projectId: id,
          invitedBy: userId,
          status: "pending",
        }));
        await InviteRequest.insertMany(invites);
      }

      // تحديث الدعوات داخل المشروع
      updateFields.inviteRequests = inviteRequests.map((i) => ({
        email: i.email,
      }));
    }

    // ✅ الاحتفاظ بقائمة الأعضاء القديمة قبل التحديث
    const oldMembers = project.members.map((id) => id.toString());
    const oldCoLeaders = project.coLeaders.map((id) => id.toString());

    // تحديث المشروع
    const updatedProject = await Project.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    // ✅ بعد التحديث، نحصل على القيم الجديدة
    const newMembers = updatedProject.members.map((id) => id.toString());
    const newCoLeaders = updatedProject.coLeaders.map((id) => id.toString());

    // تحديد المستخدمين اللي تم حذفهم
    const removedUsers = [
      ...oldMembers.filter((id) => !newMembers.includes(id)),
      ...oldCoLeaders.filter((id) => !newCoLeaders.includes(id)),
    ];

    // ✅ إزالة المستخدمين المحذوفين من المهام
    if (removedUsers.length > 0) {
      await Task.updateMany(
        { projectId: id },
        { $pull: { assignedTo: { $in: removedUsers } } },
      );
    }

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (err) {
    console.error("Update Project Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
