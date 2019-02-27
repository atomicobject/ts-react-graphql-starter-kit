export type Option<T> = T | null | undefined;
export function isSome<T>(x: Option<T>): x is T {
  return x != null;
}
export function isNone<T>(x: Option<T>): x is null | undefined {
  return x == null;
}
export function optionMap<T, Y>(x: Option<T>, fn: ((_: T) => Y)): Option<Y> {
  if (isNone(x)) {
    return null;
  }
  return fn(x);
}
