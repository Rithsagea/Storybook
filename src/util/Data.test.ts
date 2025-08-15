import { test } from "bun:test";
import { Property, type Context } from "./Data";
import { BiMap } from "./Algorithms";
import { testSerialize } from "./Test";

class Struct {
  @Property.Primitive stringField: string = "";
  @Property.Primitive numberField: number = 0;

  ignoredField: boolean = false;
}

test("serialize primitive field", () => {
  const source = new Struct();
  source.stringField = "foo";
  source.numberField = 39;

  const target = {
    stringField: "foo",
    numberField: 39,
  };

  testSerialize(source, target, Struct);
});

class Node {
  @Property.Primitive value: number = 0;
  @Property.Class(Node) next?: Node;
}

test("serialize nested object", () => {
  const source = new Node();
  source.value = 1;
  source.next = new Node();
  source.next.value = 2;

  const target = {
    value: 1,
    next: { value: 2 },
  };

  testSerialize(source, target, Node);
});

class StringBox {
  @Property.Primitive value: string;
  constructor(value: string = "") {
    this.value = value;
  }
}

class NumberBox {
  @Property.Primitive value: number;
  constructor(value: number = 0) {
    this.value = value;
  }
}

const context: Context = BiMap.from({
  string: StringBox,
  number: NumberBox,
});

class Container {
  @Property.Multi(context) box?: StringBox | NumberBox;
}

test("serialize subclass", () => {
  const source = new Container();

  source.box = new StringBox("foo");
  const targetStringBox = { box: { $type: "string", value: "foo" } };
  testSerialize(source, targetStringBox, Container);

  source.box = new NumberBox(39);
  const targetNumberBox = { box: { $type: "number", value: 39 } };
  testSerialize(source, targetNumberBox, Container);
});

class ListContainer {
  @Property.List(context) list: (StringBox | NumberBox)[] = [];
}

test("serialize list", () => {
  const source = new ListContainer();
  source.list = [
    ...[1, 2, 3].map((i) => new NumberBox(i)),
    ...["a", "b", "c"].map((i) => new StringBox(i)),
  ];

  const target = {
    list: [
      ...[1, 2, 3].map((i) => ({ $type: "number", value: i })),
      ...["a", "b", "c"].map((i) => ({ $type: "string", value: i })),
    ],
  };

  testSerialize(source, target, ListContainer);
});

class MapContainer {
  @Property.Map(context) map: Record<string, StringBox | NumberBox> = {};
}

test("serialize map", () => {
  const source = new MapContainer();
  source.map.a = new StringBox("a");
  source.map.b = new StringBox("b");
  source.map.c = new NumberBox(1);
  source.map.d = new NumberBox(2);

  const target = {
    map: {
      a: { $type: "string", value: "a" },
      b: { $type: "string", value: "b" },
      c: { $type: "number", value: 1 },
      d: { $type: "number", value: 2 },
    },
  };

  testSerialize(source, target, MapContainer);
});
