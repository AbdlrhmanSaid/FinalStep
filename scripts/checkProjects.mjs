import mongoose from "mongoose";

const MONGODB_URL =
  "mongodb+srv://Abdelrhman:12Bode34@cluster0.9fimd.mongodb.net";

await mongoose.connect(MONGODB_URL, { dbName: "finalstep" });

const Project = mongoose.model(
  "Project",
  new mongoose.Schema({ title: String, public: Boolean, status: String }),
);

const projects = await Project.find({}).select("title public status").lean();

const publicNe = await Project.find({ public: { $ne: false } }).lean();

const publicTrue = await Project.find({ public: true }).lean();

await mongoose.disconnect();
