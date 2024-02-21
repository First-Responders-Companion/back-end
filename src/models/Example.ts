import { Schema, model, Document } from "mongoose";

export interface IExample extends Document {
  name: string;
  id: number;
}

const ExampleSchema: Schema = new Schema({
  name: { type: String, required: true },
  id: { type: Number, required: true },
});

export default model<IExample>("Example", ExampleSchema);
