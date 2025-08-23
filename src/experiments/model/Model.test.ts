import { Axiom, Model } from "./Model";
import { expect, test } from "bun:test";
import { testSerialize } from "../../util/Test";

class Multitool extends Model {}
class Omnitool extends Model {}

class Pickaxe {
  name: string = "pickaxe";
}

const Axioms = {
  Pickaxe: new Axiom(Pickaxe, Multitool),
};

test("generate axiom on model", () => {
  const tool = new Multitool();

  expect(tool.suppose(Axioms.Pickaxe)).toBeUndefined();

  const pickaxe = tool.assume(Axioms.Pickaxe);
  expect(pickaxe).toStrictEqual(new Pickaxe());

  const supposedPickaxe = tool.suppose(Axioms.Pickaxe);
  expect(supposedPickaxe).toBe(pickaxe);
});

test("fails on incompatible axiom", () => {
  const tool = new Omnitool();
  expect(() => tool.assume(Axioms.Pickaxe)).toThrowError();
});

test("serializes id", () => {
  const id = "TEST-ID";
  const tool = new Multitool(id);
  testSerialize(tool, { id }, Multitool);
});
