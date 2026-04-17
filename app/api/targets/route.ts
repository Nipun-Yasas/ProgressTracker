import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Target from "@/lib/models/Target";
import { auth } from "@clerk/nextjs/server";

import { unstable_noStore as noStore } from "next/cache";

export async function GET() {
  noStore();
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await dbConnect();
    if (!db) {
      return NextResponse.json([]);
    }

    const targets = await Target.find({ userId }).sort({ createdAt: 1 });

    return NextResponse.json(targets);
  } catch (error) {
    console.error("Error fetching targets:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  noStore();
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { description } = body;

    if (!description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const target = await Target.create({ description, userId });

    return NextResponse.json(target, { status: 201 });
  } catch (error) {
    console.error("Error creating target:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
