# 🧠 CORE: Lógica de Negocio (Arquitectura DDD)

Este directorio aísla la lógica de negocio pura del framework (Next.js). Aquí viven las reglas, validaciones y conexiones a datos.

## 🏗 ¿Qué es DDD (Domain-Driven Design)?
Es una arquitectura que separa el **"Qué"** (Dominio/Reglas) del **"Cómo"** (Infraestructura/Base de Datos).
* **Ventaja:** Puedes cambiar de MongoDB a SQL, o de Stripe a PayPal, sin romper la lógica de negocio.

## 📂 Estructura del Directorio
core/
├── container.ts            # 💉 INYECCIÓN DE DEPENDENCIAS (Conecta todo aquí)
├── Shared/                 # 🛠 Tipos y Errores comunes (AppError, etc.)
└── [Modulo] (ej: Billing)/ # 📦 Contexto Delimitado (Bounded Context)
    ├── Domain/             # 👑 REGLAS Y CONTRATOS (Puro TS, sin deps externas)
    │   ├── Entity.ts       # Qué es (ej: Invoice)
    │   └── IRepository.ts  # Qué necesitamos hacer (Interfaz)
    ├── Application/        # 🎬 CASOS DE USO (Acciones)
    │   └── CreateAction.ts # Orquesta: Recibe datos -> Valida -> Guarda
    └── Infrastructure/     # 🔌 CABLES (Implementación Real)
        ├── MongoRepo.ts    # Guarda en MongoDB
        └── StripeApi.ts    # Conecta con API externa

## Cómo añadir una nueva API/Módulo
- Crea la carpeta: core/NuevoModulo/ con las subcarpetas Domain, Application, Infrastructure.
- Define el Dominio: Crea tu entidad (User.ts) y la interfaz del repositorio (IUserRepository.ts).
- Crea el Caso de Uso: En Application, escribe la lógica (RegisterUser.ts) usando solo la interfaz del repositorio.
- Implementa la Infra: En Infrastructure, escribe el código real de Mongoose o Fetch (MongoUserRepository.ts).
- Conecta: Instancia la clase en core/container.ts y expórtala.
- Usa: Importa el caso de uso en app/api/tu-ruta/route.ts.

## IMPORTANTE: Placeholder
El módulo actual Billing y el adaptador de FacturaGreen son ejemplos de implementación (Placeholders) para ilustrar la arquitectura.
No usar en producción sin revisar credenciales, URLs y validaciones finales.
Los UUIDs y métodos de pago son simulados.

## Conexión con APP/API
Las rutas de Next.js (app/api/*) actúan solo como Callers (Controladores). No deben contener lógica de negocio, solo orquestación HTTP.

### Flujo de Datos
1. API Route recibe el Request HTTP.
2. Importa el Caso de Uso ya listo desde core/container.ts.
3. Ejecuta el método .execute().
4. Devuelve JSON al cliente.

### Ejemplo de app\api\billing\route.ts:
```
import { NextResponse } from "next/server";
import { generateInvoiceUseCase } from "@/core/container";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, taxId } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Items are required" }, { status: 400 });
    }

    const invoice = await generateInvoiceUseCase.execute({
      userId: session.user.id,
      userEmail: session.user.email || "",
      items: items,
      taxId: taxId,
    });

    return NextResponse.json({
      success: true,
      data: invoice.toPrimitives(),
    });
  } catch (error: any) {
    console.error("Billing Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
```