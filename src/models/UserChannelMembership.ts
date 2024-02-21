import { Document, Model, model, Schema, Types } from "mongoose";

export interface IUserChannelMembership extends Document {
  user: Types.ObjectId;
  channel: Types.ObjectId;
  unreadCount: number;
}

export interface IUserChannelMembershipModel
  extends Model<IUserChannelMembership> {
  createIfNotExists: (membership: {
    user: Types.ObjectId;
    channel: Types.ObjectId;
  }) => Promise<void>;
}

const UserChannelMembershipSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  channel: { type: Schema.Types.ObjectId, ref: "Channel", required: true },
  unreadCount: { type: Schema.Types.Number, default: 0 },
});

UserChannelMembershipSchema.statics.createIfNotExists = async (membership: {
  user: Types.ObjectId;
  channel: Types.ObjectId;
}) => {
  if ((await UserChannelMembership.findOne(membership)) === null) {
    await new UserChannelMembership(membership).save();
  }
};

const UserChannelMembership = model<
  IUserChannelMembership,
  IUserChannelMembershipModel
>("UserChannelMembership", UserChannelMembershipSchema);
export default UserChannelMembership;
