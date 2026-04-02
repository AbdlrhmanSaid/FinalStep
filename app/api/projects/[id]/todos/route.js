import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import mongoose from "mongoose";

/* ── Auth helper ────────────────────────────── */
async function checkLeader(id, userId) {
  const project = await Project.findById(id).select("leaderId coLeaders");
  if (!project) return { error: "Project not found", status: 404 };
  const uid = userId?.toString();
  const isLeader =
    project.leaderId?.toString() === uid ||
    project.coLeaders?.some((c) => c?.toString() === uid);
  if (!isLeader) return { error: "Unauthorized", status: 403 };
  return { ok: true };
}

// ── GET /api/projects/[id]/todos ─────────────
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const project = await Project.findById(id).select("todos");
    if (!project)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const sorted = [...(project.todos ?? [])].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
    return NextResponse.json(sorted);
  } catch (e) {
    console.error("[todos GET]", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ── POST /api/projects/[id]/todos — add item ──
export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const userId = req.headers.get("userId");
    const { text, status = "todo" } = await req.json();

    if (!text?.trim())
      return NextResponse.json({ error: "Text is required" }, { status: 400 });

    const auth = await checkLeader(id, userId);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    // get current count for order
    const current = await Project.findById(id).select("todos");
    const order = current?.todos?.length ?? 0;

    const newItem = {
      _id: new mongoose.Types.ObjectId(),
      text: text.trim(),
      status,
      order,
      createdAt: new Date(),
    };

    // atomic push — works even if model is cached without todos field
    await Project.updateOne(
      { _id: id },
      { $push: { todos: newItem } }
    );

    return NextResponse.json(newItem, { status: 201 });
  } catch (e) {
    console.error("[todos POST]", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ── PUT /api/projects/[id]/todos ─────────────
// body = { _id, text?, status? }  OR  array [{ _id, order }]
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const userId = req.headers.get("userId");
    const body = await req.json();

    const auth = await checkLeader(id, userId);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    // Bulk reorder
    if (Array.isArray(body)) {
      const validOps = body.filter(({ _id }) => mongoose.Types.ObjectId.isValid(_id));
      if (validOps.length > 0) {
        const bulkOps = validOps.map(({ _id, order }) => ({
          updateOne: {
            filter: { _id: id, "todos._id": new mongoose.Types.ObjectId(_id) },
            update: { $set: { "todos.$.order": order } },
          },
        }));
        await Project.bulkWrite(bulkOps);
      }
      const updated = await Project.findById(id).select("todos");
      const sorted = [...(updated?.todos ?? [])].sort((a, b) => a.order - b.order);
      return NextResponse.json(sorted);
    }

    // Single item update
    const { _id, text, status } = body;

    // Guard: Skip if _id is a temporary optimistic ID (not yet persisted)
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return NextResponse.json({ error: "Invalid or temporary todo ID — skipped" }, { status: 400 });
    }

    const setFields = {};
    if (text !== undefined) setFields["todos.$.text"] = text.trim();
    if (status !== undefined) setFields["todos.$.status"] = status;

    await Project.updateOne(
      { _id: id, "todos._id": new mongoose.Types.ObjectId(_id) },
      { $set: setFields }
    );

    // return updated item
    const proj = await Project.findById(id).select("todos");
    const item = proj?.todos?.find((t) => t._id.toString() === _id);
    return NextResponse.json(item ?? { _id, ...setFields });
  } catch (e) {
    console.error("[todos PUT]", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ── DELETE /api/projects/[id]/todos?todoId=xxx
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const userId = req.headers.get("userId");
    const todoId = new URL(req.url).searchParams.get("todoId");

    if (!todoId)
      return NextResponse.json({ error: "todoId required" }, { status: 400 });

    const auth = await checkLeader(id, userId);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    await Project.updateOne(
      { _id: id },
      { $pull: { todos: { _id: new mongoose.Types.ObjectId(todoId) } } }
    );

    return NextResponse.json({ message: "Deleted" });
  } catch (e) {
    console.error("[todos DELETE]", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
