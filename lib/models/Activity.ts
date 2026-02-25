import { Schema, Document, model, models } from "mongoose";

export interface IActivity extends Document {
  name: string;
  month: string; // "YYYY-MM" format
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>({
  name: {
    type: String,
    required: [true, "Please provide a name for this activity."],
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
  month: {
    type: String,
    required: [true, "Please provide the month for this activity."],
    match: [/^\d{4}-\d{2}$/, "Please use a valid YYYY-MM format."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.Activity || model<IActivity>("Activity", ActivitySchema);
