const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env" }); // Try .env
require("dotenv").config({ path: ".env.local" }); // Try .env.local as fallback

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['mentee', 'mentor', 'admin'] },
  onboardingComplete: { type: Boolean, default: false },
}, { timestamps: true });

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not defined in .env or .env.local");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");

  const testAccounts = [
    {
      name: "Admin User",
      email: "admin@gracementor.com",
      password: "admin123",
      role: "admin",
      onboardingComplete: true
    },
    {
      name: "Mentor User",
      email: "mentor@gracementor.com",
      password: "mentor123",
      role: "mentor",
      onboardingComplete: true
    },
    {
      name: "Mentee User",
      email: "mentee@gracementor.com",
      password: "mentee123",
      role: "mentee",
      onboardingComplete: true
    }
  ];

  for (const acc of testAccounts) {
    const hashedPassword = await bcrypt.hash(acc.password, 10);
    
    const existing = await UserModel.findOne({ email: acc.email });
    if (!existing) {
      await UserModel.create({
        name: acc.name,
        email: acc.email,
        password: hashedPassword,
        role: acc.role,
        onboardingComplete: acc.onboardingComplete
      });
      console.log(`Created account: ${acc.email}`);
    } else {
      await UserModel.updateOne(
        { email: acc.email },
        { $set: { password: hashedPassword, role: acc.role, onboardingComplete: acc.onboardingComplete } }
      );
      console.log(`Updated existing account password for: ${acc.email}`);
    }
  }

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
