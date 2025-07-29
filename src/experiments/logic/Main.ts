import { construct, LogicalClass } from "./Logic";

const Dependency1 = LogicalClass("Dependency1", [], {
  foo: 1,
  initialize: () => console.log("Initializing Dependency 1"),
  dep1() {
    console.log(`Method from Dependency 1: ${this.foo}`);
  },
});

const Dependency2 = LogicalClass("Dependency2", [], {
  bar: 2,
  initialize: () => console.log("Initializing Dependency 2"),
  dep2() {
    console.log(`Method from Dependency 2: ${this.bar}`);
  },
});

const TestClass = LogicalClass("TestClass", [Dependency1, Dependency2], {
  baz: 3,
  dep2: () => console.log("Overriden method!"),
  test() {
    console.log(`Total: ${this.foo}, ${this.bar}, ${this.baz}`);
  },
});

const test = construct(TestClass);
test.dep1();
test.dep2();
test.test();
