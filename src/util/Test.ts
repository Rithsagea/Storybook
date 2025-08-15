import { serialize, deserialize } from "./Data";
import type { Constructor } from "./Types";
import { expect } from "bun:test";

export function testSerialize<T extends object>(
  source: T,
  target: any,
  constructor: Constructor<T>,
) {
  const forwardResult = serialize(source);
  expect(forwardResult).toStrictEqual(target);

  const backwardResult = deserialize(target, constructor);
  expect(backwardResult).toStrictEqual(source);
}
