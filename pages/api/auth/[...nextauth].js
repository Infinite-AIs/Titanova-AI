// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Your username" },
        password: { label: "Password", type: "password", placeholder: "Your password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // Find user by username
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user) return null;

        // Check password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // Return user object (will be stored in session)
        return { id: user.id, username: user.username };
      },
    }),
  ],

  // Session config
  session: {
    strategy: "jwt", // JWT-based session
    maxAge: 60 * 60 * 24, // 1 day
  },

  // Secret for JWT/signing
  secret: process.env.NEXTAUTH_SECRET,

  // Optional: custom pages
  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
