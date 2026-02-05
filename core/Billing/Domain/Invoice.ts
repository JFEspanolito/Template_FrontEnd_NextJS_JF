// Value Object: Definimos qué es un item dentro de la factura
export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

// Tipos de Estado permitidos
export type InvoiceStatus = 'PENDING' | 'PAID' | 'FAILED';

// Interface para el constructor (lo que necesitamos para crearla)
export interface InvoiceProps {
  id?: string;
  userId: string;
  items: InvoiceItem[];
  amount: number; // Podrías calcularlo dentro, pero a veces viene de fuera
  status: InvoiceStatus;
  createdAt: Date;
  externalId?: string; // ID de Stripe/SAT
}

export class Invoice {
  public readonly id: string;
  public readonly userId: string;
  public readonly items: InvoiceItem[];
  public readonly amount: number;
  public readonly createdAt: Date;

  // Propiedades mutables (privadas para controlar cómo cambian)
  private _status: InvoiceStatus;
  private _externalId?: string;

  constructor(props: InvoiceProps) {
    // Si no trae ID (es nueva), generamos uno. Si viene de BD, usamos el existente.
    this.id = props.id || crypto.randomUUID(); 
    this.userId = props.userId;
    this.items = props.items;
    this.amount = props.amount;
    this.createdAt = props.createdAt;
    
    this._status = props.status;
    this._externalId = props.externalId;
  }

  // --- Getters (Lectura pública) ---
  
  get status(): InvoiceStatus {
    return this._status;
  }

  get externalId(): string | undefined {
    return this._externalId;
  }

  // --- Domain Behaviors (Reglas de Negocio) ---

  public markAsPaid(externalId: string): void {
    if (this._status === 'PAID') {
      // Regla: No puedes pagar algo ya pagado.
      // Aquí podrías lanzar error o simplemente ignorar (idempotencia).
      return; 
    }
    
    this._status = 'PAID';
    this._externalId = externalId;
  }

  public markAsFailed(): void {
    // Regla: Solo puedes fallar si estaba pendiente
    if (this._status === 'PENDING') {
      this._status = 'FAILED';
    }
  }

  // Helper para convertir la clase a JSON plano (útil para guardar en Mongo)
  public toPrimitives() {
    return {
      id: this.id,
      userId: this.userId,
      items: this.items,
      amount: this.amount,
      status: this._status,
      externalId: this._externalId,
      createdAt: this.createdAt,
    };
  }
}