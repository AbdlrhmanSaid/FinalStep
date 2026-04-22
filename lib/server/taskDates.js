import Task from "@/models/Task";

export async function recalculateTaskDates(task) {
  if (!task.dependsOn || task.dependsOn.length === 0) {
    if (!task.startDate) task.startDate = task.createdAt || new Date();
    if (task.durationDays != null && task.durationDays > 0) {
      task.dueDate = new Date(task.startDate.getTime() + task.durationDays * 24 * 60 * 60 * 1000);
    }
    // If durationDays <= 0, we don't touch task.dueDate, assuming it's manually set or null.
    return;
  }

  const deps = await Task.find({ _id: { $in: task.dependsOn } });
  // only consider it ready if at least one dependency exists and ALL are completed/ended/rejected
  const allDone = deps.length > 0 && deps.every(d => ["completed", "rejected", "ended"].includes(d.status));

  if (allDone) {
    if (!task.startDate) {
      task.startDate = new Date();
    }
    if (task.durationDays != null && task.durationDays > 0) {
      task.dueDate = new Date(task.startDate.getTime() + task.durationDays * 24 * 60 * 60 * 1000);
    }
  } else {
    task.startDate = null;
    // For dependent tasks, if they haven't started yet, we might want to keep the manual dueDate 
    // or clear it if it's duration-based. 
    // If it's duration-based (durationDays > 0), clear dueDate until started.
    if (task.durationDays != null && task.durationDays > 0) {
        task.dueDate = null;
    }
  }
}

export async function triggerDependentTasks(taskId) {
  const dependentTasks = await Task.find({ dependsOn: taskId });
  for (const t of dependentTasks) {
    await recalculateTaskDates(t);
    await t.save();
  }
}
