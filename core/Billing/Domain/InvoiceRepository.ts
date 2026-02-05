import { Invoice } from "@/core/Billing/Domain/Invoice";

export interface InvoiceRepository {
  /**
   * Busca una factura por su ID único.
   * Retorna null si no existe.
   */
  findById(id: string): Promise<Invoice | null>;

  /**
   * Guarda una factura (ya sea nueva o una actualización de estado).
   * La implementación debe decidir si hace insert o update.
   */
  save(invoice: Invoice): Promise<void>;

  /**
   * Busca todas las facturas de un usuario específico.
   * Útil para mostrar el historial en el dashboard.
   */
  findByUserId(userId: string): Promise<Invoice[]>;
}