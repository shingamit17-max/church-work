import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "./db";
import { User as UserModel } from "@/models/User";
import bcrypt from "bcryptjs";

function getAuthSecret(): string {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET environment variable is required in production.");
  }
  // Dev-only fallback so the app works without an explicit secret
  return "dev-only-secret-grace-mentor-do-not-use-in-production";
}

export const authConfig: NextAuthConfig = {
  basePath: "/api/auth",
  trustHost: true,
  secret: getAuthSecret(),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/register",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-google-client-secret",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        await dbConnect();
        
        const user = await UserModel.findOne({ email: credentials.email });
        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          onboardingComplete: user.onboardingComplete,
        };
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        // For OAuth providers (Google), look up the user in our DB
        // and attach custom fields so the jwt callback can read them
        await dbConnect();
        let existingUser = await UserModel.findOne({ email: user.email });
        if (!existingUser) {
          existingUser = await UserModel.create({
            email: user.email,
            name: user.name || "New User",
            role: "unassigned",
            onboardingComplete: false,
          });
        }
        // Attach DB fields to the user object for the jwt callback
        user.id = existingUser._id.toString();
        user.role = existingUser.role;
        user.onboardingComplete = existingUser.onboardingComplete;
        user.image = existingUser.image || user.image;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // On initial sign-in, copy user fields into the token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.onboardingComplete = user.onboardingComplete;
        token.image = user.image;
      }
      
      // When the client calls update() to refresh the session (e.g. post-onboarding)
      if (trigger === "update" && session) {
        token.role = session.role ?? token.role;
        token.onboardingComplete = session.onboardingComplete ?? token.onboardingComplete;
        token.image = session.image ?? token.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.onboardingComplete = token.onboardingComplete as boolean;
        if (token.image) session.user.image = token.image as string;
      }
      return session;
    },
  },
};
