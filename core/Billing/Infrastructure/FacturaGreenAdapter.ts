import { IBillingGateway } from "@/core/Billing/Domain/IBillingGateway";
import { Invoice } from "@/core/Billing/Domain/Invoice";
import configApi from "@/configApi"; // Asegúrate de tener las keys aquí

// Tipos internos basados en la documentación de Factura.green
interface FGConfig {
  apiKey: string;
  businessUuid: string;
  accountUuid: string;
  baseUrl: string;
}

export class FacturaGreenAdapter implements IBillingGateway {
  private config: FGConfig;

  constructor() {
    // Validamos que existan las credenciales requeridas
    const cfg = configApi.facturaGreen;
    
    if (!cfg?.apiKey || !cfg?.businessUuid || !cfg?.accountUuid) {
      throw new Error("Faltan credenciales de Factura.green (apiKey, businessUuid, accountUuid)");
    }

    this.config = {
      apiKey: cfg.apiKey,
      businessUuid: cfg.businessUuid,
      accountUuid: cfg.accountUuid,
      baseUrl: cfg.url || "https://api.factura.green/v1" // URL base (ajustar si es sandbox)
    };
  }

  /**
   * Helper para generar los headers obligatorios
   */
  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      "Authorization": this.config.apiKey,
      "x-application-business-uuid": this.config.businessUuid,
      "x-application-account-uuid": this.config.accountUuid,
    };
  }

  /**
   * Emite la factura en Factura.green
   */
  async createExternalInvoice(invoice: Invoice): Promise<string> {
    const endpoint = `${this.config.baseUrl}/interop/cfdi/emmit`;

    // ⚠️ CRÍTICO: Factura.green requiere que el Customer y los Productos
    // ya existan y se referencien por UUID.
    // En un caso real, tu sistema debe tener mapeados estos UUIDs en tu DB.
    // Por ahora, simularemos que obtenemos estos UUIDs o usaremos placeholders.
    
    const customerUuid = await this.resolveCustomerUuid(invoice.userId); 
    
    // Mapeamos los items de dominio al formato de Factura.green
    const itemsPayload = await Promise.all(invoice.items.map(async (item) => {
      const productUuid = await this.resolveProductUuid(item.description);
      
      return {
        uuid: productUuid, // El UUID del producto registrado previamente
        qty: item.quantity,
        // Si el precio es dinámico, es OBLIGATORIO enviarlo
        price: {
          amount: item.price // Precio unitario antes de impuestos
        },
        // Opcional: Sobreescribir descripción al vuelo
        desc: item.description 
      };
    }));

    // Construcción del Payload final
    const payload = {
      cfdi: {
        customer: {
          uuid: customerUuid
        },
        payment: {
          form: { k: "99" }, // 99 = Por definir (Default seguro)
          method: { k: "PPD" } // PPD = Pago en parcialidades o diferido
        },
        items: itemsPayload,
        observations: `Factura generada desde sistema interno #${invoice.id}`
      }
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || result.response !== 'success') {
        // El 'call-uuid' es vital para soporte con ellos
        const callUuid = result.telemetry?.['call-uuid'] || 'unknown';
        throw new Error(`Error FacturaGreen (Call: ${callUuid}): ${JSON.stringify(result)}`);
      }

      // Retornamos el UUID Fiscal (o el interno de ellos)
      // La doc dice que en response-success viene el folio_tax o uuid
      return result.data.uuid;

    } catch (error) {
      console.error("FacturaGreen Adapter Error:", error);
      throw error;
    }
  }

  // --- Métodos Privados de Resolución (Stub) ---

  /**
   * En un escenario real, aquí buscarías en tu BD: "User X -> FG Customer UUID Y"
   * Si no existe, llamarías a endpoint `/interop/customer/add`
   */
  private async resolveCustomerUuid(userId: string): Promise<string> {
    // TODO: Implementar búsqueda real o creación "Lazy"
    // Retorno un UUID de ejemplo de la documentación para que compile
    return "e-customer-placeholder-uuid"; 
  }

  /**
   * En un escenario real, aquí buscarías en tu BD: "Item SKU Z -> FG Product UUID W"
   * Si no existe, llamarías a endpoint `/interop/product/add`
   */
  private async resolveProductUuid(description: string): Promise<string> {
    // TODO: Implementar búsqueda real
    // Retorno un UUID de ejemplo
    return "e-product-placeholder-uuid";
  }
}