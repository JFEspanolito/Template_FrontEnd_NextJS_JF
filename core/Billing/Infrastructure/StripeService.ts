import Stripe from "stripe";
import configApi from "@/configApi";
import { Invoice } from "@/core/Billing/Domain/Invoice";
import { IBillingGateway } from "@/core/Billing/Domain/IBillingGateway";

export class StripeService implements IBillingGateway {
  private stripe: Stripe;

  constructor() {
    // Inicializamos Stripe con la clave secreta definida en configApi.js
    // Validamos que exista para no fallar silenciosamente en producción
    if (!configApi.stripe.secretKey) {
      throw new Error("Stripe Secret Key is missing in configApi");
    }

    this.stripe = new Stripe(configApi.stripe.secretKey, {
      apiVersion: "2025-01-27.acacia" as any,
      typescript: true,
    });
  }

  /**
   * Crea una intención de pago en Stripe basada en nuestra factura.
   * Retorna el ID del PaymentIntent (ej: "pi_3O9...")
   */
  async createExternalInvoice(invoice: Invoice): Promise<string> {
    // 1. Convertir items de dominio a items de Stripe (Cents)
    // Nota: Para PaymentIntents simples, solo enviamos el monto total.
    // Si usaras Stripe Checkout, enviarías line_items.

    // Stripe trabaja en centavos (USD $10.00 -> 1000 cents)
    const amountInCents = Math.round(invoice.amount * 100);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd", // Podrías sacarlo de configProject.ts si es multi-moneda
      metadata: {
        invoiceId: invoice.id,
        userId: invoice.userId,
      },
      description: `Payment for Invoice #${invoice.id}`,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent.id;
  }
}
