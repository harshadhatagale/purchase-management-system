import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
import Role from "../../../../../models/Role";
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ email: credentials.email }).populate("role");

        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return { id: user._id, name: user.name, email: user.email, role: user.role.name };
        }
        throw new Error("Invalid email or password");
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      session.user = { id: token.id, email: token.email, role: token.role };
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
