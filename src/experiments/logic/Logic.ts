import { topologicalSort } from "../../util/Algorithms";
import type { UnionToIntersection } from "../../util/Types";

interface Definition {
  initialize?: () => void;
  [key: string]: any;
}

type Merge<Deps extends readonly Logical[]> = UnionToIntersection<
  Deps[number] extends Logical<any, infer Def> ? Def : never
>;

export interface Logical<
  Deps extends readonly Logical[] = any,
  Def extends Definition = any,
  Name extends string = any,
> {
  name: Name;
  dependencies: Deps;
  definition: Def & ThisType<Merge<Deps> & Def>;
}

// External Methods

export function LogicalClass<
  Deps extends readonly Logical[],
  Def extends Definition,
  Inst extends Merge<Deps> & Def,
  Name extends string,
>(
  name: Name,
  dependencies: Deps,
  definition: Def & ThisType<Inst>,
): Logical<Deps, Inst, Name> {
  return { name, dependencies, definition: definition as Inst };
}

export function construct<
  Def extends Definition,
  Deps extends readonly Logical[],
>(logical: Logical<Deps, Def>, target: any = {}): Def {
  for (const dependency of topologicalSort({
    root: logical,
    getChildren: (l) => l.dependencies,
  })
    .slice(1)
    .reverse()) {
    construct(dependency, target);
  }

  for (const [k, v] of Object.entries(logical.definition)) {
    if (k === "initialize") continue;
    if (typeof v === "function") target[k] = (v as Function).bind(target);
    else target[k] = v;
  }

  logical.definition.initialize?.call(target);

  return target;
}
