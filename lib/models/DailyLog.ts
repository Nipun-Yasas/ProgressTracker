import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IDailyLog extends Document {
  activityId: mongoose.Types.ObjectId;
  date: string; // "YYYY-MM-DD" format
  done: boolean;
}

const DailyLogSchema = new Schema<IDailyLog>({
  activityId: {
    type: Schema.Types.ObjectId,
    ref: "Activity",
    required: [true, "Please provide the activity ID."],
  },
  date: {
    type: String,
    required: [true, "Please provide the date for this log."],
    match: [/^\d{4}-\d{2}-\d{2}$/, "Please use a valid YYYY-MM-DD format."],
  },
  done: {
    type: Boolean,
    default: false,
  },
});

// Ensure only one log entry per activity per day
DailyLogSchema.index({ activityId: 1, date: 1 }, { unique: true });

export default models.DailyLog || model<IDailyLog>("DailyLog", DailyLogSchema);
