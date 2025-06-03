import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./User";

// ─── 1) Interface ──────────────────────────────────────────────────────────────

export interface IRequest extends Document {
  title: string;
  description: string;
  category: string;
  tags?: string[];
  receiver: IUser;
  potentialDonors: IUser[];
  acceptedDonor?: IUser | null;
  status: "open" | "offered" | "accepted" | "fulfilled" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

// ─── 2) Schema Definition ────────────────────────────────────────────────────

const RequestSchema: Schema<IRequest> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (val: string[]) {
          return val.length <= 5;
        },
        message: "You can specify up to 5 tags only.",
      },
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    potentialDonors: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    acceptedDonor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["open", "offered", "accepted", "fulfilled", "cancelled"],
      default: "open",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ─── 3) Model Export ─────────────────────────────────────────────────────────

const Request =
  mongoose.models.Request ||
  mongoose.model<IRequest>("Request", RequestSchema);

export default Request;
