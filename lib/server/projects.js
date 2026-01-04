import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import User from "@/models/User";

/**
 * Get all projects for a specific user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Array of projects
 */
export async function getUserProjects(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  await dbConnect();

  const projects = await Project.find({
    $or: [{ leaderId: userId }, { coLeaders: userId }, { members: userId }],
  })
    .populate("leaderId")
    .populate("coLeaders")
    .populate("members");

  // Clean up invalid invites (invites for existing members)
  for (const project of projects) {
    const memberEmails = [
      project.leaderId?.email,
      ...project.coLeaders.map((u) => u.email),
      ...project.members.map((u) => u.email),
    ];

    const originalInvites = [...project.inviteRequests];
    project.inviteRequests = originalInvites.filter(
      (invite) => !memberEmails.includes(invite.email)
    );

    if (originalInvites.length !== project.inviteRequests.length) {
      await project.save();
    }
  }

  return projects;
}

/**
 * Get a single project by ID
 * @param {string} projectId - The project ID
 * @returns {Promise<Object>} Project object
 */
export async function getProjectById(projectId) {
  await dbConnect();

  const project = await Project.findById(projectId)
    .populate("leaderId")
    .populate("coLeaders")
    .populate("members")
    .populate("tasks");

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}

/**
 * Create a new project
 * @param {Object} projectData - Project data
 * @returns {Promise<Object>} Created project
 */
export async function createProject(projectData) {
  await dbConnect();
  const project = await Project.create(projectData);
  return project;
}

/**
 * Update a project
 * @param {string} projectId - The project ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated project
 */
export async function updateProject(projectId, updateData) {
  await dbConnect();

  const project = await Project.findByIdAndUpdate(projectId, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("leaderId")
    .populate("coLeaders")
    .populate("members");

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}

/**
 * Delete a project
 * @param {string} projectId - The project ID
 * @returns {Promise<Object>} Deleted project
 */
export async function deleteProject(projectId) {
  await dbConnect();

  const project = await Project.findByIdAndDelete(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}
