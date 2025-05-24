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
