import dbConnect from "@/lib/db";
import User from "@/models/User";

/**
 * Get all users
 * @returns {Promise<Array>} Array of users
 */
export async function getAllUsers() {
  await dbConnect();
  const users = await User.find();
  return users;
}

/**
 * Get a single user by ID
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} User object
 */
export async function getUserById(userId) {
  await dbConnect();

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

/**
 * Get a user by email
 * @param {string} email - The user email
 * @returns {Promise<Object|null>} User object or null
 */
export async function getUserByEmail(email) {
  await dbConnect();
  const user = await User.findOne({ email });
  return user;
}

/**
 * Get a user by Clerk ID
 * @param {string} clerkId - The Clerk user ID
 * @returns {Promise<Object|null>} User object or null
 */
export async function getUserByClerkId(clerkId) {
  await dbConnect();
  const user = await User.findOne({ clerkId });
  return user;
}

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
export async function createUser(userData) {
  await dbConnect();
  const user = await User.create(userData);
  return user;
}

/**
 * Update a user
 * @param {string} userId - The user ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user
 */
export async function updateUser(userId, updateData) {
  await dbConnect();

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

/**
 * Delete a user
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} Deleted user
 */
export async function deleteUser(userId) {
  await dbConnect();

  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

/**
 * Search users by email or name
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching users
 */
export async function searchUsers(query) {
  await dbConnect();

  const users = await User.find({
    $or: [
      { email: { $regex: query, $options: "i" } },
      { firstName: { $regex: query, $options: "i" } },
      { lastName: { $regex: query, $options: "i" } },
    ],
  });

  return users;
}
