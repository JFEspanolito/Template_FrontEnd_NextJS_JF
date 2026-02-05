import { InvoiceRepository } from "@/core/Billing/Domain/InvoiceRepository";
import { Invoice } from "@/core/Billing/Domain/Invoice";
import InvoiceModel from "@/models/Invoice";
import { connectMongo } from "@/libs/db";

export class MongoInvoiceRepository implements InvoiceRepository {
  
  // Mapper: Convierte el documento de Mongo (JS) a nuestra Entidad de Dominio (Class)
  private toDomain(doc: any): Invoice {
    return new Invoice({
      id: doc._id.toString(),
      userId: doc.userId,
      amount: doc.amount,
      status: doc.status,
      items: doc.items,
      createdAt: doc.createdAt,
      externalId: doc.externalId,
    });
  }

  async findById(id: string): Promise<Invoice | null> {
    await connectMongo();
    const doc = await InvoiceModel.findById(id);
    return doc ? this.toDomain(doc) : null;
  }

  async findByUserId(userId: string): Promise<Invoice[]> {
    await connectMongo();
    const docs = await InvoiceModel.find({ userId }).sort({ createdAt: -1 });
    return docs.map((doc) => this.toDomain(doc));
  }

  async save(invoice: Invoice): Promise<void> {
    await connectMongo();
    const data = invoice.toPrimitives();

    // Upsert: Si existe actualiza, si no crea.
    // Usamos el ID del dominio como _id de Mongo si quieres sincronía total,
    // o dejamos que Mongo maneje el _id y mapeamos. 
    // Para simplificar este boilerplate, buscamos por ID:
    
    await InvoiceModel.findOneAndUpdate(
      { _id: invoice.id },
      { $set: { ...data, _id: invoice.id } }, // Forzamos el ID
      { upsert: true, new: true }
    );
  }
}