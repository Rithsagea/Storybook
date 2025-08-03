import { Property } from "../../util/Data";

export abstract class Option<Key> {
  @Property.List()
  selected: Key[] = [];

  constructor(
    readonly values: Key[],
    readonly count: number,
  ) {}

  select(keys: Key[]) {
    if (this.selected.length > 0)
      throw Error("Option has already been selected");
    if (keys.length !== this.count)
      throw Error("Incorrect number of selected values");
    if (keys.find((k) => !this.values.includes(k)) !== undefined)
      throw Error("Invalid key value");
    this.selected = keys;
    this.handle(keys);
  }

  abstract handle(keys: Key[]): void;
}
