import mongoose, { Schema, Document, Types } from "mongoose";
import AutoPopulate from "mongoose-autopopulate";

import { IUser } from "./User";

export interface IMessage extends Document {
  content: string;
  sender: IUser;
  timestamp: string;
  channelId: Types.ObjectId;
}

const MessageSchema = new Schema(
  {
    content: { type: String, required: true },
    sender: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "User",
      autopopulate: {
        select: "-password -__v",
      },
    },
    channelId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Channel",
      autopopulate: false,
    },
  },
  {
    timestamps: {
      createdAt: "timestamp",
      updatedAt: false,
    },
  }
);

MessageSchema.plugin(AutoPopulate);

export default mongoose.model<IMessage>("Message", MessageSchema);
