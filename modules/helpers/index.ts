import { Lens } from "@atomic-object/lenses";

export { AssertAssignable } from "./assert-assignable";

/** Used by Flavor to mark a type in a readable way. */
export interface Flavoring<FlavorT> {
  _type?: FlavorT;
}
/** Create a "flavored" version of a type. TypeScript will disallow mixing flavors, but will allow unflavored values of that type to be passed in where a flavored version is expected. This is a less restrictive form of branding. */
export type Flavor<T, FlavorT> = T & Flavoring<FlavorT>;

export function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export function targetReducer<T, U>(
  reducer: (arg: U, action: any) => U,
  lens: Lens<T, U>
): (arg: T, action: any) => T {
  return (arg: T, action: any) => lens.set(arg, reducer(lens.get(arg), action));
}
