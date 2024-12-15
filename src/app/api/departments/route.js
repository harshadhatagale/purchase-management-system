import dbConnect from "../../../../lib/mongodb";
import Department from "../../../../models/Department";
export async function GET(req) {
  await dbConnect();

  const departments = await Department.find({}); // Fetch all roles
  return new Response(JSON.stringify({ departments }), { status: 200 });
}
