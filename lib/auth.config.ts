import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "./db";
import { User as UserModel } from "@/models/User";
import bcrypt from "bcryptjs";

export const authConfig: NextAuthConfig = {
  basePath: "/api/auth",
  trustHost: true,
  secret: process.env.AUTH_SECRET || "super-secret-development-key-that-is-at-least-32-chars-long",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/register",
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
        const existingUser = await UserModel.findOne({ email: user.email });
        if (!existingUser) {
          // If the user doesn't exist in our DB, redirect them to the register page
          return "/register?error=NoAccountFound";
        }
        // Attach DB fields to the user object for the jwt callback
        user.id = existingUser._id.toString();
        user.role = existingUser.role;
        user.onboardingComplete = existingUser.onboardingComplete;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // On initial sign-in, copy user fields into the token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.onboardingComplete = user.onboardingComplete;
      }
      
      // When the client calls update() to refresh the session
      if (trigger === "update" && session) {
        token.role = session.role ?? token.role;
        token.onboardingComplete = session.onboardingComplete ?? token.onboardingComplete;
      }

      // Periodically sync from DB to pick up onboarding completion, role changes, etc.
      // We do this on every request — the DB call is fast (indexed by _id)
      if (token.id) {
        try {
          await dbConnect();
          const dbUser = await UserModel.findById(token.id).select("role onboardingComplete").lean();
          if (dbUser) {
            token.role = dbUser.role;
            token.onboardingComplete = dbUser.onboardingComplete;
          }
        } catch {
          // If DB lookup fails, keep existing token values
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.onboardingComplete = token.onboardingComplete as boolean;
      }
      return session;
    },
  },
};
