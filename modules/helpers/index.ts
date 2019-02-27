import { Lens } from "@atomic-object/lenses";

export { AssertAssignable } from "./assert-assignable";

/** Used by Flavor to mark a type in a readable way. */
export interface Flavoring<FlavorT> {
  _type?: FlavorT;
}
/** Create a "flavored" version of a type. TypeScript will disallow mixing flavors, but will allow unflavored values of that type to be passed in where a flavored version is expected. This is a less restrictive form of branding. */
export type Flavor<T, FlavorT> = T & Flavoring<FlavorT>;

/** Used by Brand to mark a type in a readable way. */
export interface Branding<BrandT> {
  _type: BrandT;
}
/** Create a "flavored" version of a type. TypeScript will disallow mixing flavors, but will allow unflavored values of that type to be passed in where a flavored version is expected. This is a less restrictive form of branding. */
export type Brand<T, BrandT> = T & Branding<BrandT>;

export function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export async function testWait() {
  await sleep(0);
  await sleep(0);
}

export function targetReducer<T, U>(
  reducer: (arg: U, action: any) => U,
  lens: Lens<T, U>
): (arg: T, action: any) => T {
  return (arg: T, action: any) => lens.set(arg, reducer(lens.get(arg), action));
}

let bombSuppressions = 0;
export function suppressBomb(fn: () => void) {
  bombSuppressions += 1;
  try {
    fn();
  } finally {
    bombSuppressions -= 1;
  }
}

export function bomb(errorMessage: string, error?: Error): never {
  if (bombSuppressions === 0) {
    console.error(errorMessage, error || new Error());
  }
  throw error || new Error(errorMessage);
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
