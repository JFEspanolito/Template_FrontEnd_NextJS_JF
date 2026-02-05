import { Invoice } from "./Invoice";

export interface IBillingGateway {
  /**
   * Envía la factura al proveedor externo (Stripe, FacturaGreen, SAT).
   * Retorna el ID externo generado (UUID o Folio Fiscal).
   */
  createExternalInvoice(invoice: Invoice): Promise<string>;
}