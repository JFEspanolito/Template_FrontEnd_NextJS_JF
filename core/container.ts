import "server-only"; // Seguridad extra

// 1. Importar Implementaciones (Infraestructura)
import { MongoInvoiceRepository } from "./Billing/Infrastructure/MongoInvoiceRepository";
import { FacturaGreenAdapter } from "./Billing/Infrastructure/FacturaGreenAdapter";
import type { IBillingGateway } from "./Billing/Domain/IBillingGateway";

// 2. Importar Casos de Uso (Application)
import { GenerateInvoice } from "./Billing/Application/GenerateInvoice";

// 3. Instanciar Infraestructura (Singletons)
const invoiceRepository = new MongoInvoiceRepository();

class LazyBillingGateway implements IBillingGateway {
  private implementation: IBillingGateway | null = null;

  private getImplementation(): IBillingGateway {
    if (!this.implementation) {
      this.implementation = new FacturaGreenAdapter();
    }

    return this.implementation;
  }

  async createExternalInvoice(invoice: Parameters<IBillingGateway["createExternalInvoice"]>[0]) {
    return this.getImplementation().createExternalInvoice(invoice);
  }
}

const billingGateway = new LazyBillingGateway();

// 4. Inyectar dependencias en los Casos de Uso
export const generateInvoiceUseCase = new GenerateInvoice(
  invoiceRepository,
  billingGateway
);

// Aquí exportarías más casos de uso...
// export const sendInvoiceEmailUseCase = new SendInvoiceEmail(invoiceRepository, mailer);