import { expect, test } from "bun:test";
import { deserialize, Property, serialize, type Context } from "./Data";
import { BiMap } from "./Algorithms";

class Struct {
  @Property.Primitive stringField: string = "";
  @Property.Primitive numberField: number = 0;

  ignoredField: boolean = false;
}

test("serialize primitive field", () => {
  const struct = new Struct();
  struct.stringField = "foo";
  struct.numberField = 39;
  struct.ignoredField = true;

  const expected = {
    stringField: "foo",
    numberField: 39,
  };

  const result = serialize(struct);

  expect(result).toStrictEqual(expected);
});

test("deserialize primitive field", () => {
  const data = {
    stringField: "foo",
    numberField: 39,
  };

  const expected = new Struct();
  expected.stringField = "foo";
  expected.numberField = 39;

  const result = deserialize(data, Struct);

  expect(result).toStrictEqual(expected);
});

class Node {
  @Property.Primitive value: number = 0;
  @Property.Class(Node) next?: Node;
}

test("serialize nested object", () => {
  const root = new Node();
  root.value = 1;
  root.next = new Node();
  root.next.value = 2;

  const expected = {
    value: 1,
    next: { value: 2 },
  };

  const result = serialize(root);

  expect(result).toStrictEqual(expected);
});

test("deserialize nested object", () => {
  const data = {
    value: 1,
    next: { value: 2 },
  };

  const expected = new Node();
  expected.value = 1;
  expected.next = new Node();
  expected.next.value = 2;

  const result = deserialize(data, Node);

  expect(result).toStrictEqual(expected);
});

class NodeContainer {
  @Property.Class(Node) nodes: Node[] = [];
}

test("serialize list", () => {
  const indices = [1, 2, 3, 4, 5];
  const container = new NodeContainer();
  container.nodes = indices.map((i) => {
    const node = new Node();
    node.value = i;
    return node;
  });

  const expected = { nodes: indices.map((i) => ({ value: i })) };
  const result = serialize(container);
  expect(result).toStrictEqual(expected);
});

test("deserialize list", () => {
  const indices = [1, 2, 3, 4, 5];
  const data = { nodes: indices.map((i) => ({ value: i })) };

  const expected = new NodeContainer();
  expected.nodes = indices.map((i) => {
    const node = new Node();
    node.value = i;
    return node;
  });
  const result = deserialize(data, NodeContainer);
  expect(result).toStrictEqual(expected);
});

class StringBox {
  @Property.Primitive value: string = "";
}

class NumberBox {
  @Property.Primitive value: number = 0;
}

const context: Context = BiMap.from({
  string: StringBox,
  number: NumberBox,
});

class Container {
  @Property.Multi(context) box?: StringBox | NumberBox;
}

test("serialize subclass", () => {
  const container = new Container();

  container.box = new StringBox();
  container.box.value = "foo";
  const expectedStringBox = { $type: "string", box: { value: "foo" } };
  const resultString = serialize(container);
  expect(resultString).toStrictEqual(expectedStringBox);

  container.box = new NumberBox();
  container.box.value = 39;
  const expectedNumberBox = { $type: "number", box: { value: 39 } };
  const resultNumber = serialize(container);
  expect(resultNumber).toStrictEqual(expectedNumberBox);
});

test("deserialize subclass", () => {
  const expected = new Container();

  const stringBox = { $type: "string", box: { value: "foo" } };
  const resultStringBox = deserialize(stringBox, Container);
  expected.box = new StringBox();
  expected.box.value = "foo";
  expect(resultStringBox).toStrictEqual(expected);

  const numberBox = { $type: "number", box: { value: 39 } };
  const resultNumberBox = deserialize(numberBox, Container);
  expected.box = new NumberBox();
  expected.box.value = 39;
  expect(resultNumberBox).toStrictEqual(expected);
});
