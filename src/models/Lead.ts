import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

export interface ILead {
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new mongoose.Schema<ILead>(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      private: true,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

leadSchema.plugin(toJSON);

export default mongoose.models.Lead || mongoose.model<ILead>("Lead", leadSchema);
