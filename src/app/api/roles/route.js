import dbConnect from "../../../../lib/mongodb";
import Role from "../../../../models/Role";

export async function GET(req) {
  await dbConnect();

  const roles = await Role.find({}); // Fetch all roles
  return new Response(JSON.stringify({ roles }), { status: 200 });
}
