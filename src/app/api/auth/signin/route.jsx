
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "john@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        const { email, password } = credentials;

        // Fetch the user from the database
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("No user found with this email.");
        }

        // Check if the password matches
        const isValidPassword = bcrypt.compareSync(password, user.password);

        if (!isValidPassword) {
          throw new Error("Invalid email or password.");
        }

        // Include the user's role in the session
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role, // Add role here
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Attach role to token
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role; // Attach role to session
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
    error: "/auth/error",   // Custom error page
  },
};

export default NextAuth(authOptions);
