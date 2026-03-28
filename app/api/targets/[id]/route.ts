import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Target from "@/lib/models/Target";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await dbConnect();

    const deletedTarget = await Target.findByIdAndDelete(id);

    if (!deletedTarget) {
      return NextResponse.json(
        { error: "Target not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Target deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting target:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { description } = body;
    
    if (!description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const updatedTarget = await Target.findByIdAndUpdate(
      id,
      { description },
      { new: true, runValidators: true }
    );

    if (!updatedTarget) {
      return NextResponse.json(
        { error: "Target not found" },
        { status: 404 } 
      );
    }

    return NextResponse.json(updatedTarget, { status: 200 });
  } catch (error) {
    console.error("Error updating target:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
