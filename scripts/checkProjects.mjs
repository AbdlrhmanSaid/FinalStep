import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URI;

await mongoose.connect(MONGODB_URL, { dbName: "finalstep" });

const Project = mongoose.model(
  "Project",
  new mongoose.Schema({ title: String, public: Boolean, status: String }),
);

const projects = await Project.find({}).select("title public status").lean();

const publicNe = await Project.find({ public: { $ne: false } }).lean();

const publicTrue = await Project.find({ public: true }).lean();

await mongoose.disconnect();
