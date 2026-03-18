import dbConnect from "@/lib/db";
import Task from "@/models/Task";
import Project from "@/models/Project";
import User from "@/models/User";

/**
 * Get all tasks
 * @returns {Promise<Array>} Array of tasks
 */
export async function getAllTasks() {
  await dbConnect();

  const tasks = await Task.find()
    .populate("projectId")
    .populate("assignedTo")
    .populate("createdBy")
    .populate("review.reviewedBy");

  return tasks;
}

/**
 * Get tasks for a specific user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Array of tasks
 */
export async function getUserTasks(userId) {
  await dbConnect();

  const tasks = await Task.find({
    $or: [{ assignedTo: userId }, { createdBy: userId }],
  })
    .populate("projectId")
    .populate("assignedTo")
    .populate("createdBy")
    .populate("review.reviewedBy");

  return tasks;
}

/**
 * Get a single task by ID
 * @param {string} taskId - The task ID
 * @returns {Promise<Object>} Task object
 */
export async function getTaskById(taskId) {
  await dbConnect();

  const task = await Task.findById(taskId)
    .populate("projectId")
    .populate("assignedTo")
    .populate("createdBy")
    .populate("review.reviewedBy");

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
}

/**
 * Create a new task
 * @param {Object} taskData - Task data
 * @returns {Promise<Object>} Created task
 */
export async function createTask(taskData) {
  await dbConnect();

  // Initialise blank memberSubmissions for every assigned user
  const memberSubmissions = (taskData.assignedTo || []).map((uid) => ({
    userId: uid,
    status: "open",
  }));

  const task = await Task.create({ ...taskData, memberSubmissions });

  // Add task to project if projectId exists
  if (task.projectId) {
    await Project.findByIdAndUpdate(task.projectId, {
      $push: { tasks: task._id },
    });
  }

  return task;
}

/**
 * Update a task
 * @param {string} taskId - The task ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated task
 */
export async function updateTask(taskId, updateData) {
  await dbConnect();

  const task = await Task.findByIdAndUpdate(taskId, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("projectId")
    .populate("assignedTo")
    .populate("createdBy")
    .populate("review.reviewedBy");

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
}

/**
 * Delete a task
 * @param {string} taskId - The task ID
 * @returns {Promise<Object>} Deleted task
 */
export async function deleteTask(taskId) {
  await dbConnect();

  const task = await Task.findById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  // Remove task from project
  if (task.projectId) {
    await Project.findByIdAndUpdate(task.projectId, {
      $pull: { tasks: task._id },
    });
  }

  await Task.findByIdAndDelete(taskId);

  return task;
}

/**
 * Get tasks by project ID
 * @param {string} projectId - The project ID
 * @returns {Promise<Array>} Array of tasks
 */
export async function getTasksByProject(projectId) {
  await dbConnect();

  const tasks = await Task.find({ projectId })
    .populate("assignedTo")
    .populate("createdBy")
    .populate("review.reviewedBy");

  return tasks;
}
