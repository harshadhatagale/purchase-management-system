import dbConnect from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
import Role from "../../../../../models/Role";
import bcrypt from "bcryptjs";
import Department from "../../../../../models/Department";
import Position from "../../../../../models/Position";

export async function POST(req) {
  const { name, username, email, password, role, gender, position, department, phone } = await req.json();

  if (!name || !username || !email || !password) {
    return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
  }

  await dbConnect();

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
  }
  const existingEmail = await User.findOne({ email: email });
  if (existingEmail) {
    return new Response(JSON.stringify({ message: "Email already exists" }), { status: 400 });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Find role in the database, default to "user"
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
  const user = new User({
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

  await user.save();

  return new Response(JSON.stringify({ message: "User created successfully" }), { status: 201 });
}
