import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "./User";

export interface IChat extends Document {
  chatId: string;
  participants: string[];
  createdAt: Date;
  updatedAt: Date;
}

function generateChatId(user1Id: string, user2Id: string): string {
  return [user1Id, user2Id].sort().join("_");
}

const ChatSchema: Schema<IChat> = new Schema(
  {
    chatId: {
      type: String,
      required: true,
      index: true,
    },
    participants: [{ type: Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
    // Add compound index for better querying of conversations E.G. BUT NOT IN USE
    // ChatSchema.index({ messageSenderId: 1, messageReceiverId: 1, createdAt: -1 });
  }
);
ChatSchema.index({ chatId: 1, createdAt: 1 }); // instead of `indexes` array :contentReference[oaicite:3]{index=3}

// Prevent model overwrite upon hot reload in dev
export default (mongoose.models.Chat as Model<IChat>) || mongoose.model<IChat>("Chat", ChatSchema);
