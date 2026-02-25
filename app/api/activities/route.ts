import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Activity from "@/lib/models/Activity";

import { unstable_noStore as noStore } from "next/cache";

export async function GET(req: NextRequest) {
  noStore();
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");

    if (!month) {
      return NextResponse.json(
        { error: "Month parameter is required (YYYY-MM)" },
        { status: 400 },
      );
    }

    const db = await dbConnect();
    if (!db) {
      return NextResponse.json([]);
    }

    const activities = await Activity.find({ month }).sort({ createdAt: 1 });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  noStore();
  try {
    const body = await req.json();
    const { name, month } = body;

    if (!name || !month) {
      return NextResponse.json(
        { error: "Name and month are required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const activity = await Activity.create({ name, month });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
