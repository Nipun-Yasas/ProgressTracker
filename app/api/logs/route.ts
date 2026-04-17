import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import DailyLog from "@/lib/models/DailyLog";
import Activity from "@/lib/models/Activity";
import { auth } from "@clerk/nextjs/server";

import { unstable_noStore as noStore } from "next/cache";

export async function GET(req: NextRequest) {
  noStore();
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Find all activities for this month First
    const activities = await Activity.find({ month, userId });
    const activityIds = activities.map((a) => a._id);

    // Then find logs for these activities
    const logs = await DailyLog.find({ activityId: { $in: activityIds }, userId });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
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
    const { activityId, date, done } = body;

    if (!activityId || !date) {
      return NextResponse.json(
        { error: "Activity ID and date are required" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Verify activity belongs to user
    const activity = await Activity.findOne({ _id: activityId, userId });
    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    // Use updateOne with upsert to create or update
    const result = await DailyLog.findOneAndUpdate(
      { activityId, date, userId },
      { done },
      { new: true, upsert: true, runValidators: true },
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error creating/updating log:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
