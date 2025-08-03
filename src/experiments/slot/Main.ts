import { BiMap } from "../../util/Algorithms";
import { serialize, deserialize } from "../../util/Data";
import { Slot } from "./Slot";

class Race {}

class ElfRace extends Race {
  name: string = "elf";
}

class DragonRace extends Race {
  name: string = "dragon";
}

const RaceContext = BiMap.from({
  dragon: DragonRace,
  elf: ElfRace,
});

const RaceSlot = Slot<Race>(RaceContext);
const slot = new RaceSlot();
slot.set(new DragonRace());
const target = serialize(slot);
const source = deserialize(target, RaceSlot);
console.log(source);
