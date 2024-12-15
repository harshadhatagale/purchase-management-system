import dbConnect from "../../../../lib/mongodb";
import Position from "../../../../models/Position";
export async function GET(req) {
  await dbConnect();

  const positions = await Position.find({}); // Fetch all roles
  return new Response(JSON.stringify({ positions }), { status: 200 });
}
