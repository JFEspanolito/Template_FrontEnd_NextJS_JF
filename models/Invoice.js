import mongoose from "mongoose";
import toJSON from "./plugins/toJSON"; // Tu plugin existente

const invoiceSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ["PENDING", "PAID", "FAILED"], 
      default: "PENDING" 
    },
    items: [
      {
        description: String,
        quantity: Number,
        price: Number,
      },
    ],
    externalId: { type: String }, // UUID de FacturaGreen
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Agrega updatedAt automáticamente
  }
);

// Aplicar plugin de limpieza
invoiceSchema.plugin(toJSON);

// Evitar recompilación del modelo en hot-reload
export default mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);