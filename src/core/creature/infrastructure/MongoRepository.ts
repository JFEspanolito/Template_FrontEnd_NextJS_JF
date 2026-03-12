
import { CreatureRepository } from "../domain/CreatureRepository";
import { Creature } from "../domain/Creature";

export class MongoRepository implements CreatureRepository {
  async save(creature: Creature): Promise<void> {
    console.log("Guardando en Mongo:", creature.props);
  }

  async findAll(): Promise<Creature[]> {
    return [];
  }
}