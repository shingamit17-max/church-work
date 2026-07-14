"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import dbConnect from "@/lib/db";
import { User as UserModel } from "@/models/User";
import bcrypt from "bcryptjs";
import { UserRole } from "@/types";

export async function login(formData: FormData) {
  try {
    await signIn("credentials", Object.fromEntries(formData));
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}

export async function register(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as UserRole;

  if (!name || !email || !password || !role) {
    return { error: "All fields are required." };
  }

  await dbConnect();

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return { error: "Email already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new UserModel({
    name,
    email,
    password: hashedPassword,
    role,
    onboardingComplete: false,
  });

  await user.save();

  try {
    await signIn("credentials", { email, password, redirect: false });
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function loginWithLinkedIn() {
  await signIn("linkedin");
}
