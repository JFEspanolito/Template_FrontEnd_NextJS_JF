import { Creature } from "./Creature";

export interface CreatureRepository {
  save(creature: Creature): Promise<void>;
  findAll(): Promise<Creature[]>;
}
