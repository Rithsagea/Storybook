export class State<Value, Context> {
  private value: Value;
  private effects: Effect<Value, Context>[];

  constructor(
    readonly zero: Value,
    readonly context: Context,
  ) {
    this.value = zero;
    this.effects = [];
  }

  get() {
    return this.value;
  }

  compute() {
    this.value = this.zero;
    for (const effect of this.effects) this.value = effect.apply(this.value);
  }
}

interface Effect<Value, Context> {
  apply: (value: Value) => Value;
  predicates?: Predicate<Context>[];
}

type Predicate<Context> = (context: Context) => boolean;

/*
State is a container for some value.
Effects mutate state commutatively
Predicates are conditions that must be satisfied before some effect is applied
Context is the information which a predicate value is derived from
*/
