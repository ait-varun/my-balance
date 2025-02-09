import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/lib/mongodb";
import { User, IUser } from "@/models/User"; // Import IUser type
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDB();

        const user = await User.findOne({ email: credentials?.email }) as IUser | null; // Ensure type

        if (!user) throw new Error("User not found");

        const isValidPassword = await bcrypt.compare(credentials?.password || "", user.password);
        if (!isValidPassword) throw new Error("Invalid password");

        return {
          id: user.id.toString(), // No more TypeScript error
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.User) {
        session.user.id = token.sub; // Attach user ID to session
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id; // Ensure token includes user ID
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
