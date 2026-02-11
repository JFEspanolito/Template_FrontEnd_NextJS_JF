import { Creature } from "../domain/Creature";
import { CreatureRepository } from "../domain/CreatureRepository";
import { CreatureInput } from "../domain/CreatureSchema";

export class UploadCreature {
  constructor(private repository: CreatureRepository) {}

  async execute(input: CreatureInput): Promise<void> {
    const creature = new Creature(input);
    await this.repository.save(creature);
  }
}