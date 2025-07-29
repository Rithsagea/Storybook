class Trait<S extends symbol> {
  constructor(public readonly symbol: S) {}
}

const HealthSymbol = Symbol("health");
class Health extends Trait<typeof HealthSymbol> {
  constructor(
    public health: number,
    public maxHealth: number,
  ) {
    super(HealthSymbol);
  }
}

const AttackSymbol = Symbol("attack");
class Attack extends Trait<typeof AttackSymbol> {
  constructor(public attack: number) {
    super(AttackSymbol);
  }
}

function assignTrait(trait: Trait<any>, target: any) {
  target[trait.symbol] = trait;
}

function assertTrait<T extends Trait<S>, S extends symbol, R extends object>(
  symbol: S,
  target: R,
): R & {
  [P in S]: T;
} {
  if (!(target as any)[symbol])
    throw Error(`Target does not possess trait ${String(symbol)}`);
  return target as any;
}

// represents a player
const playerSheet = {};
assignTrait(new Health(10, 10), playerSheet);
assignTrait(new Attack(5), playerSheet);

// represents a prop, like a chair
const propSheet = {};
assignTrait(new Health(10, 10), propSheet);

// represnts a hazard, like a bonfire
const hazardSheet = {};
assignTrait(new Attack(10), hazardSheet);

function AttackAction(attacker: object, target: object) {
  // type = {[AttackSymbol]: Attack}
  const castedAttacker = assertTrait<Attack, typeof AttackSymbol, object>(
    AttackSymbol,
    attacker,
  );

  // type = {[HealthSymbol]: Health}
  const castedTarget = assertTrait<Health, typeof HealthSymbol, object>(
    HealthSymbol,
    target,
  );

  castedTarget[HealthSymbol].health -= castedAttacker[AttackSymbol].attack;
}

function RestAction(target: object) {
  // type = {[HealthSymbol]: Health}
  const castedTarget = assertTrait<Health, typeof HealthSymbol, object>(
    HealthSymbol,
    target,
  );

  const healthTrait = castedTarget[HealthSymbol];
  healthTrait.health = healthTrait.maxHealth;
}

function Print(name: string, target: any) {
  const data: any = {};

  if (target[HealthSymbol]) {
    data.health = target[HealthSymbol].health;
    data.maxHealth = target[HealthSymbol].maxHealth;
  }
  if (target[AttackSymbol]) {
    data.attack = target[AttackSymbol].attack;
  }

  console.log(name, data);
}

Print("Player", playerSheet);
Print("Prop", propSheet);
console.log("attack!");
AttackAction(playerSheet, propSheet);
Print("Player", playerSheet);
Print("Prop", propSheet);

console.log("prop rests!");
RestAction(propSheet);
Print("Prop", propSheet);

RestAction(hazardSheet);
