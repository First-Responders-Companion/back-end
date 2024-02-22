import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";

export interface IMissingComplaint extends Document {
  complaintFiledBy: IUser; //Mandatory
  username?: IUser;
  name: string; //Mandatory
  sex: "male" | "female" | "other"; //Mandatory
  phoneNumber?: string;
  age: number; //Mandatory
  height?: string;
  weight?: string;
  email?: string;
  medications?: string;
  allergies?: string;
  conditions?: string;
  birthmark?: string;
  assignedTo: IUser; //Mandatory
  isCaseClosed: boolean; //Mandatory
  caseConclusion?: string;
  complaintFiledAt: string; //Mandatory
  caseClosedAt?: string;
  missingCitizen?: IUser;
}

const MissingComplaintSchema = new Schema<IMissingComplaint>({
  complaintFiledBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
    autopopulate: true,
  },
  username: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "User",
    autopopulate: true,
  },
  name: { type: String, required: true },
  sex: { type: String, required: true },
  phoneNumber: { type: String, required: false },
  age: { type: Number, required: true },
  height: { type: String, required: false },
  weight: { type: String, required: false },
  email: { type: String, required: false },
  medications: { type: String, required: false },
  allergies: { type: String, required: false },
  conditions: { type: String, required: false },
  birthmark: { type: String, required: false },
  assignedTo: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
    autopopulate: true,
  },
  isCaseClosed: { type: Boolean, required: true, default: false },
  caseConclusion: { type: String, required: false },
  complaintFiledAt: { type: String, required: true },
  caseClosedAt: { type: String, required: false },
  missingCitizen: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "User",
    autopopulate: true,
  },
});

MissingComplaintSchema.plugin(require("mongoose-autopopulate"));

// MissingComplaintSchema.plugin(
//   AutoPopulate as unknown as (
//     schema: import("mongoose").Schema<IMissingComplaint>
//   ) => void
// );

export default mongoose.model<IMissingComplaint>(
  "MissingComplaint",
  MissingComplaintSchema
);
