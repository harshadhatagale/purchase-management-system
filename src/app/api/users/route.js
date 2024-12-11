import { hash } from "bcryptjs";
import dbConnect from "../../../../lib/mongodb";// Import the User model
import User from "../../../../models/User";
import Role from "../../../../models/Role";
export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    // Validate input
    if (!name || !email || !password || !role) {
      return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);
    const assignedRole = await Role.findOne({ name: role }) || await Role.findOne({ name: "user" });
    if (!assignedRole) {
        return new Response(JSON.stringify({ message: "Invalid role" }), { status: 400 });
      }
    // Connect to DB and create user
    await dbConnect();
    const newUser = new User({ name, email, password: hashedPassword, role: assignedRole._id });
    await newUser.save();

    return new Response(JSON.stringify({ message: "User added successfully" }), { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(JSON.stringify({ message: "Error adding user" }), { status: 500 });
  }
}
