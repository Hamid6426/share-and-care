import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./User";

export interface IItem extends Document {
  title: string;
  description: string;
  category: string;
  condition: "new" | "used" | "poor";
  images: string[];
  quantity: number;
  donor: IUser; // populated user object with donor details
  receiver?: IUser; // populated receiver when he/she come to claim the item
  status: "available" | "claimed" | "picked-up" | "donated";
  createdAt: Date;
  updatedAt: Date; 
}

function validateImageLimit(val: string[]): boolean {
  return val.length <= 4;
}

const ItemSchema: Schema<IItem> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    condition: {
      type: String,
      enum: ["new", "used", "poor"],
      default: "used",
      required: true,
    },
    images: { type: [String], validate: [validateImageLimit, "Cannot add more than 4 images"], default: [] },
    quantity: { type: Number, default: 1, min: 1 },
    donor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", default: null },
    status: {
      type: String,
      enum: ["available", "claimed", "picked-up", "donated"],
      default: "available",
    },
  },
  { timestamps: true }
);

// Prevent model overwrite upon hot reload in dev
export default (mongoose.models.Item as Model<IItem>) || mongoose.model<IItem>("Item", ItemSchema);
