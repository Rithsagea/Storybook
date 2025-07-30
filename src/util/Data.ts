import assert from "assert";
import type { BiMap } from "./Algorithms";
import { getMetadata } from "./Metadata";
import { type Constructor } from "./Types";

export type Context = BiMap<string, Constructor>;

type PropertyData = Record<string, SerializationStrategy<any>>;
const SUBSCRIPTION_SYMBOL = Symbol("properties");
function getPropertyData(target: object) {
  return getMetadata<PropertyData>(target, SUBSCRIPTION_SYMBOL, {});
}

export namespace Property {
  export function Serialize(strategy: SerializationStrategy) {
    return (target: object, key: string) => {
      getPropertyData(target)[key] = strategy;
    };
  }

  export function Primitive(target: object, key: string) {
    getPropertyData(target)[key] = PrimitiveSerializationStrategy();
  }

  export function Class<T extends object>(constructor: Constructor<T>) {
    return Serialize(ClassSerializationStrategy(constructor));
  }

  export function Multi(context: Context) {
    return Serialize(MultiSerializationStrategy(context));
  }

  function getStrategy(context?: Constructor | Context) {
    if (context === undefined) return PrimitiveSerializationStrategy();
    else if (typeof context === "function")
      return ClassSerializationStrategy(context);
    else return MultiSerializationStrategy(context);
  }

  export function List(context?: Constructor | Context) {
    return Serialize(ListSerializationStrategy(getStrategy(context)));
  }

  export function Map(context?: Constructor | Context) {
    return Serialize(MapSerializationStrategy(getStrategy(context)));
  }
}

export function serialize(target: object): object {
  const res: any = {};
  const properties = getPropertyData(target);
  for (const [label, property] of Object.entries(properties)) {
    const value = (target as any)[label];
    if (value === undefined) continue;
    res[label] = property.serialize(value);
  }

  return res;
}

export function deserialize<T extends object>(
  source: any,
  constructor: Constructor<T>,
): T {
  const res = new constructor();
  const properties = getPropertyData(res);
  for (const [label, property] of Object.entries(properties)) {
    const value = (source as any)[label];
    if (value === undefined) continue;
    (res as any)[label] = property.deserialize(value);
  }
  return res;
}

interface SerializationStrategy<T = any> {
  serialize(source: T): any;
  deserialize(source: object): T;
}

function PrimitiveSerializationStrategy(): SerializationStrategy {
  return {
    serialize: (i) => i,
    deserialize: (i) => i,
  };
}

function ClassSerializationStrategy<T extends object>(
  constructor: Constructor<T>,
): SerializationStrategy<T> {
  return {
    serialize(source) {
      return serialize(source);
    },
    deserialize(source) {
      return deserialize(source, constructor);
    },
  };
}

function MultiSerializationStrategy(context: Context): SerializationStrategy {
  return {
    serialize(source) {
      return {
        ...serialize(source),
        $type: context.inverse().get(source.constructor),
      };
    },
    deserialize(source) {
      return deserialize(source, context.get((source as any).$type)!);
    },
  };
}

function ListSerializationStrategy<T>(
  base: SerializationStrategy<T>,
): SerializationStrategy<T[]> {
  return {
    serialize(source) {
      return source.map(base.serialize);
    },
    deserialize(source) {
      assert(Array.isArray(source));
      return source.map(base.deserialize);
    },
  };
}

function MapSerializationStrategy<T>(
  base: SerializationStrategy<T>,
): SerializationStrategy<Record<string, T>> {
  return {
    serialize(source) {
      const res: any = {};
      for (const k in source) res[k] = base.serialize(source[k]!);
      return res;
    },
    deserialize(source) {
      const res: Record<string, T> = {};
      for (const k in source) res[k] = base.deserialize((source as any)[k]);
      return res;
    },
  };
}
