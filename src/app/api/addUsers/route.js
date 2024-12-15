import { hash } from "bcryptjs";
import dbConnect from "../../../../lib/mongodb";// Import the User model
import User from "../../../../models/User";
import Role from "../../../../models/Role";
import Department from "../../../../models/Department";
import Position from "../../../../models/Position";
export async function POST(req) {
  try {
    const { name, username, email, password, role, gender, position, department, phone } = await req.json();

    // Validate input
    if (!name || !username || !email || !password || !role || !position || !department) {
      return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);
    const assignedRole = await Role.findOne({ name: role }) || await Role.findOne({ name: "user" });
    const assignedDept = await Department.findOne({ name: department });
    const assignedPos = await Position.findOne({ name: position });
    if (!assignedRole) {
      return new Response(JSON.stringify({ message: "Invalid role" }), { status: 400 });
    }
    if (!assignedDept) {
      return new Response(JSON.stringify({ message: "Invalid department" }), { status: 400 });
    }
    if (!assignedPos) {
      return new Response(JSON.stringify({ message: "Invalid position" }), { status: 400 });
    }
    // Connect to DB and create user
    await dbConnect();
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
    }
    const existingEmail = await User.findOne({ email:email });
    if (existingEmail) {
      return new Response(JSON.stringify({ message: "Email already exists" }), { status: 400 });
    }
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role: assignedRole._id,
      gender,
      position: assignedPos._id,
      department: assignedDept._id,
      phone
    });
    await newUser.save();

    return new Response(JSON.stringify({ message: "User added successfully" }), { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(JSON.stringify({ message: "Error adding user" }), { status: 500 });
  }
}
