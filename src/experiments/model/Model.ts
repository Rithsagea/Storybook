import assert from "assert";
import { Property } from "../../util/Data";
import type { Constructor } from "../../util/Types";

export class Model {
  @Property.Primitive
  readonly id: string;

  // TRANSIENT
  readonly axioms: Record<symbol, object> = {};

  constructor(id: string = crypto.randomUUID()) {
    this.id = id;
  }

  assume<S extends object>(axiom: Axiom<S, typeof this>) {
    const { Id, Target, Type } = axiom;
    assert(this.constructor === Target);
    if (!this.axioms[Id]) this.axioms[Id] = new Type();
    return this.axioms[Id];
  }

  suppose<S extends object>(axiom: Axiom<S, typeof this>) {
    const { Id, Target } = axiom;
    assert(this.constructor === Target);
    return this.axioms[Id];
  }
}

export class Axiom<S extends object, T extends Model> {
  readonly Id: symbol;
  constructor(
    readonly Type: Constructor<S>,
    readonly Target: Constructor<T>,
  ) {
    this.Id = Symbol(Type.name);
  }
}
