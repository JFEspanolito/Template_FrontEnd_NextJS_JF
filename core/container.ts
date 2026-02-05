import "server-only"; // Seguridad extra

// 1. Importar Implementaciones (Infraestructura)
import { MongoInvoiceRepository } from "./Billing/Infrastructure/MongoInvoiceRepository";
import { FacturaGreenAdapter } from "./Billing/Infrastructure/FacturaGreenAdapter";

// 2. Importar Casos de Uso (Application)
import { GenerateInvoice } from "./Billing/Application/GenerateInvoice";

// 3. Instanciar Infraestructura (Singletons)
const invoiceRepository = new MongoInvoiceRepository();
const billingGateway = new FacturaGreenAdapter();

// 4. Inyectar dependencias en los Casos de Uso
export const generateInvoiceUseCase = new GenerateInvoice(
  invoiceRepository,
  billingGateway
);

// Aquí exportarías más casos de uso...
// export const sendInvoiceEmailUseCase = new SendInvoiceEmail(invoiceRepository, mailer);