import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Activity from "@/lib/models/Activity";
import DailyLog from "@/lib/models/DailyLog";
import { auth } from "@clerk/nextjs/server";

import { unstable_noStore as noStore } from "next/cache";

export function generateStaticParams() {
  return [];
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  noStore();
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json(
        { error: "Activity ID is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Delete the activity
    const deletedActivity = await Activity.findOneAndDelete({ _id: id, userId });

    if (!deletedActivity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 },
      );
    }

    // Also delete all associated logs
    await DailyLog.deleteMany({ activityId: id, userId });

    return NextResponse.json(
      { message: "Activity and associated logs deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting activity:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  noStore();
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json(
        { error: "Activity ID is required" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required for update" },
        { status: 400 },
      );
    }

    await dbConnect();

    const updatedActivity = await Activity.findOneAndUpdate(
      { _id: id, userId },
      { name },
      { new: true, runValidators: true },
    );

    if (!updatedActivity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedActivity, { status: 200 });
  } catch (error) {
    console.error("Error updating activity:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
