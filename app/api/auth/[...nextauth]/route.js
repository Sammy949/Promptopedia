import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import User from "@models/user";
import { connectToDB } from "@utils/database";

const handler = (req, res) =>
  NextAuth.default(req, res, {
    providers: [
      GoogleProvider.default({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    callbacks: {
      async session({ session }) {
        const sessionUser = await User.findOne({
          email: session.user.email,
        });

        session.user.id = sessionUser._id.toString();

        return session;
      },
      async signIn({ profile }) {
        try {
          await connectToDB();
          // check user existence
          const userExists = await User.findOne({
            email: profile.email,
          });

          if (!userExists) {
            await User.create({
              email: profile.email,
              username: profile.name.replace(" ", "").toLowerCase(),
              image: profile.picture,
            });
          }

          return true;
        } catch (error) {
          // else create new user
          console.log(error);
          return false;
        }
      },
    },
  });

export { handler as GET, handler as POST };
