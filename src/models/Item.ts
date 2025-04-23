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
  receiver?: IUser | null; // populated receiver when he/she come to claim the item
  status: "available" | "requested" | "claimed" | "picked" | "donated";
  // available mean an item is available for donation
  // claimed mean a user has claimed the item but not yet picked it up "it is confirmed by donor after request from receiver"
  // picked mean a user has picked up the item
  // donated mean the item is no longer available for donation
  isRequested: boolean; // true if receiver has requested for the item
  requestAccepted: boolean; // true if the request is accepted by the donor
  requestCancelled: boolean; // true if the request is cancelled by the receiver
  isCancelled: boolean; // true if the item is cancelled by the donor
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
      enum: ["available", "requested", "claimed", "picked", "donated"],
      default: "available",
    },
    isRequested: { type: Boolean, default: false },
    requestAccepted: { type: Boolean, default: false },
    requestCancelled: { type: Boolean, default: false },
    isCancelled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent model overwrite upon hot reload in dev
export default (mongoose.models.Item as Model<IItem>) || mongoose.model<IItem>("Item", ItemSchema);
