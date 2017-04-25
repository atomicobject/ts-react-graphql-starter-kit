/** Given an array of strings, return a module such that foreach foo in the array, x[foo] = foo. Useful for creating string enums. Combine with type MyEnum = keyof typeof MyEnum for a type representing the valid values in the array.. */
export function strEnum<T extends string>(o: Array<T>): {[K in T]: K} {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}