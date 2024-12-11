import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req });

  // If there's no token, redirect to login
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { pathname } = req.nextUrl;

  // Define role-specific dashboard paths
  const rolePaths = {
    admin: "/dashboard/admin",
    hod: "/dashboard/hod",
    os: "/dashboard/os",
    registrar: "/dashboard/registrar",
    principal: "/dashboard/principal",
  };

  // Check if the current path matches the user's role
  const userRole = token.role;

  if (pathname.startsWith("/dashboard") && rolePaths[userRole] !== pathname) {
    return Response.redirect(new URL(rolePaths[userRole], req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"], // Apply middleware to dashboard paths
};
