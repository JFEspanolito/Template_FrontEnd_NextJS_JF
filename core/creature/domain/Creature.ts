import { CreatureInput } from "./CreatureSchema";
import { DomainError } from "@/core/shared/errors";

export class Creature {
  constructor(public readonly props: CreatureInput) {
    if (props.name === "Admin") {
      throw new DomainError("El nombre 'Admin' está reservado por el sistema");
    }
  }
}
