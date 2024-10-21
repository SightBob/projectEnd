import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/lib/ConnectDB";
import User from "@/models/User";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { username, password } = credentials;

        try {
          await dbConnect();
          const user = await User.findOne({ username });

          if (!user) {
            throw new Error("User not found");
          }

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            uuid: user._id,
            name: user.username,
            email: user.email,
            role: user.role,
            verify_categories: user.verifyCategories,
            verifyEmail: user.verifyEmail,
          };
        } catch (error) {
          console.log("Error in authorize: ", error);
          throw new Error("Authorization failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.uuid = user.uuid;
        token.role = user.role;
        token.verify_categories = user.verify_categories;
        token.verifyEmail = user.verifyEmail;
      }

      if (trigger === "update" && session?.user) {
        token.verify_categories = session.user.verify_categories;
        token.verifyEmail = session.user.verifyEmail;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.uuid = token.uuid;
        session.user.role = token.role;
        session.user.verify_categories = token.verify_categories;
        session.user.verifyEmail = token.verifyEmail;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    signUp: "/register",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
