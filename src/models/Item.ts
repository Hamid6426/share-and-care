import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./User";

export interface IItem extends Document {
  title: string;
  description: string;
  category: string;
  condition: "new" | "like_new" | "used" | "poor";
  images: string[];
  quantity: number;
  donor: IUser; // populated user object with donor details 
  receiver?: IUser; // populated receiver when he come to claim the item
  status: "available" | "reserved" | "donated";
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema: Schema<IItem> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    condition: {
      type: String,
      enum: ["new", "like_new", "used", "poor"],
      default: "used",
    },
    images: { type: [String], default: [] },
    quantity: { type: Number, default: 1, min: 1 },
    donor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", default: null },
    status: {
      type: String,
      enum: ["available", "reserved", "donated"],
      default: "available",
    },
  },
  { timestamps: true }
);

// Prevent model overwrite upon hot reload in dev
export default (mongoose.models.Item as Model<IItem>) ||
  mongoose.model<IItem>("Item", ItemSchema);