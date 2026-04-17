import { Schema, Document, model, models } from "mongoose";

export interface ITarget extends Document {
  userId: string;
  description: string;
  createdAt: Date;
}

const TargetSchema = new Schema<ITarget>({
  userId: {
    type: String,
    required: [true, "Please provide the user ID."],
  },
  description: {
    type: String,
    required: [true, "Please provide a description for this target."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.Target || model<ITarget>("Target", TargetSchema);
