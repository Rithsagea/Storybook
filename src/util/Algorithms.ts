// Digraphs

type GetChildren<Node> = (node: Node) => Iterable<Node>;
interface Digraph<Node> {
  root: Node;
  getChildren: GetChildren<Node>;
}

export function topologicalSort<Node>(digraph: Digraph<Node>) {
  const { root, getChildren } = digraph;
  const result: Node[] = [];
  const visited = new Set<Node>();
  const stack = new Set<Node>();

  function visit(node: Node) {
    if (visited.has(node)) return;
    if (stack.has(node)) throw Error("Cycle detected in graph");
    stack.add(node);

    for (const child of getChildren(node)) visit(child);

    stack.delete(node);
    visited.add(node);
    result.push(node);
  }

  visit(root);
  return result.reverse();
}

// BiMap
export class BiMap<K, V> {
  constructor(
    private readonly forward = new Map<K, V>(),
    private readonly backward = new Map<V, K>(),
  ) {}

  set(k: K, v: V) {
    if (this.forward.has(k) || this.backward.has(v)) return false;
    this.forward.set(k, v);
    this.backward.set(v, k);
    return true;
  }

  get(k: K) {
    return this.forward.get(k);
  }

  has(k: K) {
    return this.forward.has(k);
  }

  inverse(): BiMap<V, K> {
    return new BiMap(this.backward, this.forward);
  }

  static from<K extends keyof any, V>(data: Record<K, V>) {
    const res = new BiMap<K, V>();
    for (const [k, v] of Object.entries(data) as [K, V][])
      if (!res.set(k, v)) throw Error("Non-unique mapping!");
    return res;
  }
}
