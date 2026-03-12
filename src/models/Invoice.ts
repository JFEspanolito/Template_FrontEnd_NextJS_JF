import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

export type InvoiceStatus = "PENDING" | "PAID" | "FAILED";

export interface IInvoiceItem {
  description?: string;
  quantity?: number;
  price?: number;
}

export interface IInvoice {
  userId: string;
  amount: number;
  status: InvoiceStatus;
  items: IInvoiceItem[];
  externalId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new mongoose.Schema<IInvoice>(
  {
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"] satisfies InvoiceStatus[],
      default: "PENDING",
    },
    items: [
      {
        description: String,
        quantity: Number,
        price: Number,
      },
    ],
    externalId: { type: String },
  },
  {
    timestamps: true,
  }
);

invoiceSchema.plugin(toJSON);

export default mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", invoiceSchema);
