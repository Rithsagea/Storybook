export function getMetadata<T>(
  target: object,
  metadataSymbol: symbol,
  defaultValue: T,
): T {
  if ((target as any)[metadataSymbol] === undefined)
    (target as any)[metadataSymbol] = defaultValue;
  return (target as any)[metadataSymbol];
}
