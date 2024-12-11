import dbConnect from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
import Role from "../../../../../models/Role";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { name, email, password, role } = await req.json();

  if (!name || !email || !password) {
    return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
  }

  await dbConnect();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  // Find role in the database, default to "user"
  const assignedRole = await Role.findOne({ name: role }) || await Role.findOne({ name: "user" });

  if (!assignedRole) {
    return new Response(JSON.stringify({ message: "Invalid role" }), { status: 400 });
  }

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role: assignedRole._id,
  });

  await user.save();

  return new Response(JSON.stringify({ message: "User created successfully" }), { status: 201 });
}
