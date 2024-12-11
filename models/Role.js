import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "user", "admin"
  permissions: [String], // Array of permissions, e.g., ["read", "write", "delete"]
});

export default mongoose.models.Role || mongoose.model("Role", RoleSchema);
