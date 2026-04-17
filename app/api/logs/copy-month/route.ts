import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Activity from "@/lib/models/Activity";
import { auth } from "@clerk/nextjs/server";

import { unstable_noStore as noStore } from "next/cache";

export function generateStaticParams() {
  return [];
}

export async function POST(req: NextRequest) {
  noStore();
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fromMonth, toMonth } = body;

    if (!fromMonth || !toMonth) {
      return NextResponse.json(
        { error: "both fromMonth and toMonth are required" },
        { status: 400 },
      );
    }

    await dbConnect();

    // 1. Get activities from the previous month
    const previousActivities = await Activity.find({ month: fromMonth, userId }).sort({
      createdAt: 1,
    });

    if (previousActivities.length === 0) {
      return NextResponse.json(
        { message: "No activities found in the previous month to copy." },
        { status: 200 }, // Not an error, just nothing to do
      );
    }

    // 2. Get existing activities for the target month to avoid duplicates by name
    const existingActivities = await Activity.find({ month: toMonth, userId });
    const existingNames = new Set(existingActivities.map((a) => a.name));

    // 3. Filter out activities that already exist in the target month
    const activitiesToCopy = previousActivities.filter(
      (a) => !existingNames.has(a.name),
    );

    if (activitiesToCopy.length === 0) {
      return NextResponse.json(
        {
          message:
            "All activities from previous month already exist in the target month.",
        },
        { status: 200 },
      );
    }

    // 4. Prepare new documents
    const newActivities = activitiesToCopy.map((a) => ({
      userId,
      name: a.name,
      month: toMonth,
      createdAt: new Date(), // Set a new creation date or use original if preferred, but new is better for sorting
    }));

    // 5. Insert them
    const result = await Activity.insertMany(newActivities);

    return NextResponse.json(
      {
        message: `Successfully copied ${result.length} activities.`,
        copiedCount: result.length,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error copying activities:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
