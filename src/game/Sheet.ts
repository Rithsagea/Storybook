import { EnumMap } from "../util/Types";
import { Abilities } from "./Stats";

export class Sheet {
  abilityScores = EnumMap(Abilities, (_) => 0);
  abilityModifiers = EnumMap(Abilities, (_) => 0);
}
