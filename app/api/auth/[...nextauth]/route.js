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

          if (user) {
            const isValid = await bcrypt.compare(password, user.password);

            if (isValid) {
              return {
                uuid: user._id,
                name: user.username,
                email: user.email,
                role: user.role, 
              };
            } else {
              throw new Error("Invalid password");
            }
          } else {
            throw new Error("User not found");
          }
        } catch (error) {
          console.log("Error in authorize: ", error);
          throw new Error("Authorization failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {

      if (user) {
        token.uuid = user.uuid;
        token.role = user.role; 
      }
      return token;
    },
    async session({ session, token }) {
      // เพิ่ม uuid และ role ไปที่ session
      if (token) {
        session.user.uuid = token.uuid;
        session.user.role = token.role; 
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
