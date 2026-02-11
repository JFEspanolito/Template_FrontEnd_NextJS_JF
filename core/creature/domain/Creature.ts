import { CreatureInput } from "./CreatureSchema";

export class Creature {
  constructor(public readonly props: CreatureInput) {
    // Validaciones de negocio adicionales si fueran necesarias
    if (props.name === "Admin") throw new Error("Nombre no permitido");
  }
}