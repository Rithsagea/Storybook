import { Property, type Context } from "../../util/Data";
import type { Constructor } from "../../util/Types";

class BaseSlot<T extends object> {
  private value?: T;

  constructor(private readonly context: Context) {
    Property.Multi(context)(this, "value");
  }

  set(value: T) {
    if (!this.context.inverse().has(value.constructor as Constructor))
      throw Error(`Unsupported slot value type: ${value.constructor.name}`);
    this.value = value;
  }

  get(): T | undefined {
    return this.value;
  }
}

export function Slot<T extends object>(context: Context) {
  class Slot extends BaseSlot<T> {
    constructor() {
      super(context);
    }
  }
  return Slot;
}
