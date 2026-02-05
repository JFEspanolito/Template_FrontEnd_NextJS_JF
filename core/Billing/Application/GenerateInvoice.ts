import { Invoice } from "@/core/Billing/Domain/Invoice";
import { InvoiceRepository } from "@/core/Billing/Domain/InvoiceRepository";
import { IBillingGateway } from "@/core/Billing/Domain/IBillingGateway";

// 1. DTO (Data Transfer Object): Qué datos necesito para empezar
export interface GenerateInvoiceDTO {
  userId: string;
  userEmail: string;
  items: Array<{
    description: string;
    price: number;
    quantity: number;
  }>;
  taxId?: string; // RFC o Tax ID opcional
}

// 2. El Caso de Uso (Application Service)
export class GenerateInvoice {
  // Inyección de Dependencias:
  // No pedimos "Stripe" ni "Mongo" directamente, pedimos sus interfaces.
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly billingGateway: IBillingGateway
  ) {}

  async execute(input: GenerateInvoiceDTO): Promise<Invoice> {
    // A. Regla de Negocio: Calcular Total
    const totalAmount = input.items.reduce(
      (acc, item) => acc + item.price * item.quantity, 
      0
    );

    if (totalAmount <= 0) {
      throw new Error("El monto total debe ser mayor a 0");
    }

    // B. Crear la Entidad de Dominio (Estado inicial: PENDING)
    // Nota: Esto asume que tu clase Invoice tiene este constructor.
    const invoice = new Invoice({
      userId: input.userId,
      amount: totalAmount,
      status: "PENDING",
      items: input.items,
      createdAt: new Date(),
    });

    // C. Orquestación con Infraestructura
    try {
      // 1. Intentar facturar en el proveedor externo (Stripe/FacturaGreen)
      const externalId = await this.billingGateway.createExternalInvoice(invoice);
      
      // 2. Si éxito, actualizamos la entidad con el ID externo y estado PAID
      invoice.markAsPaid(externalId);

    } catch (error) {
      // Si falla el proveedor, marcamos como FAILED pero guardamos el registro
      invoice.markAsFailed();
      console.error("Error en facturación externa:", error);
      // Aquí podrías decidir si lanzar error o solo guardar el fallo
    }

    // D. Persistencia: Guardar el resultado final en nuestra BD
    await this.repository.save(invoice);

    return invoice;
  }
}