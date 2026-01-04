import { NextResponse } from "next/server";
import { createTask, getAllTasks } from "@/lib/server/tasks";

export async function POST(req) {
  try {
    const body = await req.json();
    const task = await createTask(body);

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("POST Task Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create task" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tasks = await getAllTasks();
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("GET Tasks Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
