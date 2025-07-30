// prettier-ignore
export type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends
  (k: infer I) => void ? I : never;

type Primitive = string | number | boolean | bigint | symbol | null | undefined;
export function isPrimitive(x: unknown): x is Primitive {
  return x == null || (typeof x !== "object" && typeof x !== "function");
}

export type Constructor<T extends object = object> = new () => T;
