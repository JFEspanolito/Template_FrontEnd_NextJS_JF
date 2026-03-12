# AI/rules/TDD_DDD_PROTOCOLS.md: PROTOCOLO OMEGA (NEXT.JS)

## 1. FILOSOFÍA CORE: CONCEPTS > CODE

No me interesa tu sintaxis si tu arquitectura es frágil. En este proyecto, el código es la última consecuencia de un pensamiento riguroso. Si no puedes explicar el problema, no tienes permiso para escribir la solución.

---

## 2. DOMAIN-DRIVEN DESIGN (DDD): Blindaje de Lógica

El negocio no vive en los componentes de React, en los Server Actions ni en los modelos de base de datos. El negocio vive en el Core.

### Capas del Sistema (Next.js Context):

* **Domain (`src/core/[domain]/domain`):** La zona sagrada. Aquí no hay dependencias externas. Solo Entidades, Contratos de Repositorio y Reglas de Negocio. Si cambias de base de datos, esta carpeta no se mueve.
* **Application (`src/core/[domain]/application`):** Orquestadores (Casos de Uso). Reciben datos validados, invocan al dominio y ejecutan la lógica. Son consumidos directamente por Server Components o Server Actions.
* **Infrastructure (`src/core/[domain]/infrastructure`):** Implementaciones técnicas. Conexiones a MongoDB (MongoRepository), Stripe o APIs externas. Se comunica con el core estrictamente a través de Interfaces.
* **Presentation (`src/app` & `src/components`):** La piel.
* **Server Components:** Orquestan el fetching de datos invocando al `core`.
* **Client Components:** Manejan la interactividad (Islands). Prohibido meter lógica de validación compleja aquí.

### Reglas de Oro de DDD:

* **Lenguaje Ubicuo:** Si el documento `spec.md` dice "Creature", no quiero ver "Monster" en el código.
* **Dependency Inversion:** El Core no importa nada de Infrastructure. Infrastructure implementa interfaces definidas en el Domain.
* **Bounded Contexts:** Las carpetas dentro de `src/core` (ej. `creature`, `user`) deben estar aisladas. La comunicación entre contextos se hace vía servicios de aplicación.

---

## 3. TEST-DRIVEN DEVELOPMENT (TDD): El Ciclo de Estabilidad

Escribir código sin tests es negligencia técnica. No acepto un solo PR que no siga el ciclo Red-Green-Refactor.

### El Protocolo de 3 Pasos:

1. 🔴 **RED (Fallo):** Escribe un test pequeño en `./TDD` para la lógica del `core`. Ejecútalo y confirma que falla.
2. 🟢 **GREEN (Paso):** Escribe el código mínimo necesario para que el test pase. Solo haz que el semáforo cambie a verde.
3. 🔵 **REFACTOR (Excelencia):** Limpia el código, mejora nombres y aplica patrones. Ejecuta los tests de nuevo para confirmar la integridad.

---

## 4. INSTRUCCIONES PARA AGENTES (JARVIS PROTOCOL)

Si eres una IA operando en este repositorio, estos son tus límites:

* **Prohibido:** Crear lógica de negocio en Server Actions (`src/app/api` o `actions.ts`) sin haber creado antes su test en `./TDD`.
* **Prohibido:** Mezclar lógica de Mongoose/MongoDB dentro de un Caso de Uso. Usa siempre el patrón Repository en `infrastructure`.
* **Obligatorio:** Validar todas las entradas de los Server Actions con Zod antes de pasarlas a la capa de `application`.
* **Obligatorio:** Antes de proponer un cambio masivo, usa `fd` y `rg` para identificar todos los puntos donde se rompe el contrato del dominio.