import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { SystemConfig } from "@/models/SystemConfig";

// GET all config keys
export async function GET(req: Request) {
  const url = new URL(req.url);
  const keys = url.searchParams.getAll("keys[]");
  
  try {
    await dbConnect();
    
    let query = {};
    if (keys && keys.length > 0) {
      query = { key: { $in: keys } };
    }
    
    const configs = await SystemConfig.find(query);
    const configMap = configs.reduce((acc, conf) => {
      acc[conf.key] = conf.value;
      return acc;
    }, {} as Record<string, any>);
    
    return NextResponse.json(configMap);
  } catch (e: any) {
    console.error("Failed to fetch config:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Update configs
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json(); // { key: string, value: any } or array of such objects
    await dbConnect();

    const updates = Array.isArray(data) ? data : [data];

    for (const update of updates) {
      if (!update.key) continue;
      
      await SystemConfig.findOneAndUpdate(
        { key: update.key },
        { value: update.value },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Failed to update config:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
