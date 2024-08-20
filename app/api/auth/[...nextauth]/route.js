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

          // ค้นหาผู้ใช้จาก username
          const user = await User.findOne({ username });

          if (user) {
            //   ตรวจสอบรหัสผ่าน
            const isValid = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (isValid) {
              return {
                uuid: user._id,
                name: user.username,
                email: user.email,
              };
            }
          }

        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uuid = user.uuid;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.uuid = token.uuid;
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
