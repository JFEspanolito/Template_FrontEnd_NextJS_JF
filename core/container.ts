import "server-only"; // Seguridad extra

// src/core/shared/container.ts
import { MongoRepository } from "@/core/creature/infrastructure/MongoRepository";
import { UploadCreature } from "@/core/creature/application/UploadCreature";

// 1. Instanciamos la infraestructura
const creatureRepository = new MongoRepository();

// 2. Inyectamos esa instancia en el caso de uso
const uploadCreatureUseCase = new UploadCreature(creatureRepository);

// 3. Exportamos para que la API (route.ts) lo use
export { uploadCreatureUseCase };
