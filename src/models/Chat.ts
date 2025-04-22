import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./User";

export interface IChat extends Document {
  messageSenderId: IUser;
  messageReceiverId: IUser;
  message: string;
  chatId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema: Schema<IChat> = new Schema(
  {
    messageSenderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true, // Add index for better query performance
    },
    messageReceiverId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true, // Remove whitespace
      maxlength: [500, "Message cannot be more than 500 characters"], // Add max length
    },
    chatId: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    // Add compound index for better querying of conversations
  }
);
ChatSchema.index({ chatId: 1, createdAt: 1 }); // instead of `indexes` array :contentReference[oaicite:3]{index=3}

// Prevent model overwrite upon hot reload in dev
export default (mongoose.models.Chat as Model<IChat>) || mongoose.model<IChat>("Chat", ChatSchema);
