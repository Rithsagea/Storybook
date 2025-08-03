import { serialize } from "../../util/Data";
import { Option } from "./Option";

type Skill = "strength" | "dexterity" | "wisdom";

class SkillOption extends Option<Skill> {
  constructor() {
    super(["strength", "dexterity"], 1);
  }

  handle(keys: Skill[]): void {
    console.log(keys);
  }
}

const option = new SkillOption();
console.log(serialize(option));
option.select(["strength"]);
console.log(serialize(option));
