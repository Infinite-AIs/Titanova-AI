import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// For demo purposes, using an in-memory "database"
let users = []; // store users here (not persistent!)

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = users.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );
        if (user) return { id: user.email, email: user.email };
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
