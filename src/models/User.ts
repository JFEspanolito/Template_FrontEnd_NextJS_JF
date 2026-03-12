import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

export type UserRole = "user" | "admin" | "editor" | "moderator";

export interface IUser {
  name?: string;
  email?: string;
  image?: string;
  role: UserRole;
  customerId?: string;
  priceId?: string;
  hasAccess: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      private: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin", "editor", "moderator"] satisfies UserRole[],
      default: "user",
    },
    customerId: {
      type: String,
      validate: {
        validator: (value: string) => value.includes("cus_"),
        message: "customerId must contain 'cus_'",
      },
    },
    priceId: {
      type: String,
      validate: {
        validator: (value: string) => value.includes("price_"),
        message: "priceId must contain 'price_'",
      },
    },
    hasAccess: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

userSchema.plugin(toJSON);

export default mongoose.models.User || mongoose.model<IUser>("User", userSchema);
