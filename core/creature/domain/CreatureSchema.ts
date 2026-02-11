import { z } from "zod";

export const CreatureSchema = z.object({
  name: z.string().min(3, "El nombre es muy corto"),
  level: z.number().int().positive().max(20),
  biome: z.string(),
});

export type CreatureInput = z.infer<typeof CreatureSchema>;
