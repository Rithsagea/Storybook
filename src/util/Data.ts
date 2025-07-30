import type { BiMap } from "./Algorithms";
import { getMetadata } from "./Metadata";
import { type Constructor } from "./Types";

export type Context = BiMap<string, Constructor>;

interface PrimitivePropertyEntry {
  type: "primitive";
}

interface ClassPropertyEntry {
  type: "class";
  constructor: Constructor;
}

interface MultiPropertyEntry {
  type: "multi";
  context: Context;
}

type PropertyEntry =
  | PrimitivePropertyEntry
  | ClassPropertyEntry
  | MultiPropertyEntry;

// TODO: update value type to method
type PropertyData = Record<string, PropertyEntry>;
const SUBSCRIPTION_SYMBOL = Symbol("properties");
function getPropertyData(target: object) {
  return getMetadata<PropertyData>(target, SUBSCRIPTION_SYMBOL, {});
}

export namespace Property {
  export function Primitive(target: object, key: string) {
    getPropertyData(target)[key] = { type: "primitive" };
  }

  export function Class<T extends object>(constructor: Constructor<T>) {
    return (target: object, key: string) => {
      getPropertyData(target)[key] = { type: "class", constructor };
    };
  }

  export function Multi(context: Context) {
    return (target: object, key: string) => {
      getPropertyData(target)[key] = { type: "multi", context };
    };
  }
}

export function serialize(target: object): object {
  if (Array.isArray(target)) return target.map(serialize);

  const res: any = {};
  const properties = getPropertyData(target);
  for (const [label, property] of Object.entries(properties)) {
    const value = (target as any)[label];
    if (value === undefined) continue;
    switch (property.type) {
      case "primitive":
        res[label] = value;
        break;
      case "class":
        res[label] = serialize(value);
        break;
      case "multi":
        res[label] = serialize(value);
        res.$type = property.context.inverse().get(value.constructor);
        break;
      default:
        throw Error(`Unsupported property ${property}`);
    }
  }

  return res;
}

export function deserialize<T extends object>(
  source: any,
  constructor: Constructor<T>,
): T {
  if (Array.isArray(source))
    return source.map((e) => deserialize(e, constructor)) as any;
  // TODO: fix typing here!

  const res = new constructor();
  const properties = getPropertyData(res);
  for (const [label, property] of Object.entries(properties)) {
    const value = (source as any)[label];
    if (value === undefined) continue;
    switch (property.type) {
      case "primitive":
        (res as any)[label] = value;
        break;
      case "class":
        (res as any)[label] = deserialize(value, property.constructor);
        break;
      case "multi":
        (res as any)[label] = deserialize(
          value,
          property.context.get(source.$type)!,
        );
        break;
      default:
        throw Error(`Unsupported property ${property}`);
    }
  }
  return res;
}
