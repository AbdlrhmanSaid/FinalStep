import dbConnect from "@/lib/db";
import Task from "@/models/Task";
import Project from "@/models/Project";
import User from "@/models/User";
import Section from "@/models/Section";

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
    .populate("review.reviewedBy")
    .populate("sectionId")
    .populate("sectionAssignments.sectionId")
    .populate("sectionAssignments.members");

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
    .populate("review.reviewedBy")
    .populate("sectionId")
    .populate("sectionAssignments.sectionId")
    .populate("sectionAssignments.members");

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

  let flattenedAssignedTo = [];
  let finalSectionAssignments = [];

  if (taskData.sectionAssignments && taskData.sectionAssignments.length > 0) {
    for (const assignment of taskData.sectionAssignments) {
      const section = await Section.findById(assignment.sectionId);
      if (!section) {
        throw new Error(`Section ${assignment.sectionId} not found`);
      }
      if (section.projectId.toString() !== taskData.projectId.toString()) {
        throw new Error(`Section ${section.title} does not belong to the given project`);
      }

      if (section.members && section.members.length > 0) {
        const sectionMembers = section.members.map(m => m.toString());
        for (const uid of assignment.members || []) {
          if (!sectionMembers.includes(uid.toString())) {
            throw new Error(`Assigned user ${uid} does not belong to the restricted section ${section.title}`);
          }
        }
      }

      finalSectionAssignments.push({
        sectionId: assignment.sectionId,
        members: assignment.members || []
      });

      // Flatten unique assigned members for legacy compatibility
      for (const uid of assignment.members || []) {
        if (!flattenedAssignedTo.includes(uid.toString())) {
          flattenedAssignedTo.push(uid.toString());
        }
      }
    }
  } else if (taskData.sectionId) {
    // Legacy support
    const section = await Section.findById(taskData.sectionId);
    if (!section) throw new Error("Section not found");
    finalSectionAssignments.push({
      sectionId: taskData.sectionId,
      members: taskData.assignedTo || []
    });
    flattenedAssignedTo = taskData.assignedTo || [];
  } else {
    throw new Error("Must provide sectionAssignments or sectionId");
  }

  // Initialise blank memberSubmissions for every assigned user
  const memberSubmissions = flattenedAssignedTo.map((uid) => ({
    userId: uid,
    status: "open",
  }));

  const task = await Task.create({ 
    ...taskData, 
    assignedTo: flattenedAssignedTo,
    sectionAssignments: finalSectionAssignments,
    sectionId: finalSectionAssignments.length > 0 ? finalSectionAssignments[0].sectionId : taskData.sectionId,
    memberSubmissions 
  });

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
    .populate("review.reviewedBy")
    .populate("sectionId")
    .populate("sectionAssignments.sectionId")
    .populate("sectionAssignments.members");

  return tasks;
}
