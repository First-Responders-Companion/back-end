/**
 * A channel is an abstraction where a group of users can send messages.
 * Consider it as a mimic of Slack Channel.
 */

import mongoose, { Document, Model, Schema } from "mongoose";
import AutoPopulate from "mongoose-autopopulate";
import ROLES from "../utils/Roles";
import systemDefinedChannels from "../utils/SystemDefinedChannels";

import { IMessage } from "./Message";
import { IUser } from "./User";
import UserChannelMembership from "./UserChannelMembership";

export const PUBLIC_CHANNEL_NAME = "Public";

export interface IChannel extends Document {
  name?: string;
  messages: IMessage[];
  private?: boolean;
  hospitalId?: string;
  groupmetadata?: {
    owner: IUser;
    state: "Active" | "Closed";
    description?: string;
  };
  updateGroupChannel: (groupChannel: IChannel) => Promise<IChannel>;
  addMessage: (message: IMessage) => void;
}

export interface IChannelModel extends Model<IChannel> {
  getPublicChannel: () => Promise<IChannel>;
  addUserToGroupChannel: (role: string, user: IUser) => Promise<void>;
  getPrivateChannelBetweenUsers: (
    user1: IUser,
    user2: IUser
  ) => Promise<IChannel>;
}

const ChannelSchema = new Schema({
  name: { type: String },
  messages: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Message",
      autopopulate: true,
    },
  ],
  private: { type: Boolean, default: false },
  hospitalId: { type: String, required: false },
  groupmetadata: {
    owner: { type: Schema.Types.ObjectId, ref: "User", autopopulate: true },
    state: { type: String, default: "Active" },
    description: { type: String, required: false },
  },
});

ChannelSchema.plugin(AutoPopulate);

ChannelSchema.methods.updateGroupChannel = async function (
  groupChannel: IChannel
) {
  const currentGroupChannel = this as IChannel;
  if (currentGroupChannel) {
    currentGroupChannel.overwrite(groupChannel);
    return await currentGroupChannel.save();
  } else {
    throw new Error("Group channel not found");
  }
};

ChannelSchema.statics.addUserToGroupChannel = async (
  role: string,
  user: IUser
) => {
  if (role === ROLES.ADMINISTRATOR) {
    await Promise.all(
      Object.keys(systemDefinedChannels).map(async (channelName: string) => {
        if (systemDefinedChannels[channelName] === "Public") return;
        const channel = await Channel.findOne({
          name: systemDefinedChannels[channelName],
        }).exec();
        if (channel) {
          await new UserChannelMembership({ user, channel }).save();
        }
      })
    );
    return;
  }

  role = role === ROLES.NURSE ? "Nurses" : role;
  role = role === ROLES.CITIZEN ? "Citizens" : role;
  const channel = await Channel.findOne({
    name: role,
  }).exec();
  if (channel) {
    await new UserChannelMembership({ user, channel }).save();
  }
  if (role === "Nurses" || role === ROLES.FIRE || role === ROLES.POLICE) {
    const channel = await Channel.findOne({ name: "Medic" }).exec();
    if (channel) {
      await new UserChannelMembership({ user, channel }).save();
    }
  }
  if (role === ROLES.FIRE || role === ROLES.POLICE || role === ROLES.DISPATCH) {
    const channel = await Channel.findOne({ name: "Responders" }).exec();
    if (channel) {
      await new UserChannelMembership({ user, channel }).save();
    }
  }
  if (role === ROLES.SWAT) {
    const channel = await Channel.findOne({ name: "SWAT" }).exec();
    if (channel) {
      await new UserChannelMembership({ user, channel }).save();
    }
  }
};

ChannelSchema.statics.getPublicChannel = async () => {
  try {
    return await Channel.findOne({ name: PUBLIC_CHANNEL_NAME }).exec();
  } catch (error) {
    throw new Error("Public channel not found");
  }
};

ChannelSchema.methods.addMessage = function (message: IMessage) {
  this.messages.push(message);
};

ChannelSchema.statics.getPrivateChannelBetweenUsers = async (
  user1: IUser,
  user2: IUser
) => {
  const channels = (await Channel.aggregate([
    { $match: { private: true } },
    {
      $lookup: {
        from: "userchannelmemberships",
        localField: "_id",
        foreignField: "channel",
        as: "memberships",
      },
    },
    {
      $addFields: {
        memberships: {
          $map: {
            input: "$memberships",
            in: "$$this.user",
          },
        },
      },
    },
    {
      $match: {
        $and: [
          { memberships: { $size: 2 } },
          { memberships: { $all: [user1._id, user2._id] } },
        ],
      },
    },
    { $addFields: { memberships: "$$REMOVE" } },
  ])) as IChannel[];

  if (channels.length === 1) {
    return channels[0];
  }

  if (channels.length === 0) {
    const newChannel = await new Channel({
      private: true,
    }).save();
    await new UserChannelMembership({
      user: user1,
      channel: newChannel,
    }).save();
    await new UserChannelMembership({
      user: user2,
      channel: newChannel,
    }).save();
    return newChannel;
  }

  throw new Error("Found too many private channels between two users!");
};

const Channel = mongoose.model<IChannel, IChannelModel>(
  "Channel",
  ChannelSchema
);

export default Channel;
