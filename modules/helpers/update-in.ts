
interface SafeUpdate {
  <O, K1 extends keyof O>(o: O, k: K1, v: O[K1]): O;
  <O, K1 extends keyof O,
      K2 extends keyof O[K1]>(o: O, k: K1, k2: K2, v: O[K1][K2]): O;
  <O, K1 extends keyof O,
      K2 extends keyof O[K1],
      K3 extends keyof O[K1][K2]>(o: O, k: K1, k2: K2, k3: K3, v: O[K1][K2][K3]): O;
  <O, K1 extends keyof O,
      K2 extends keyof O[K1],
      K3 extends keyof O[K1][K2],
      K4 extends keyof O[K1][K2][K3]>(o: O, k: K1, k2: K2, k3: K3, k4: K4, v: O[K1][K2][K3][K4]): O;
  <O, K1 extends keyof O,
      K2 extends keyof O[K1],
      K3 extends keyof O[K1][K2],
      K4 extends keyof O[K1][K2][K3],
      K5 extends keyof O[K1][K2][K3][K4]>(o: O, k: K1, k2: K2, k3: K3, k4: K4, k5: K5, v: O[K1][K2][K3][K4][K5]): O;
}

function performUpdate(o: any, v: any, keys: string[], idx: number, last: number): any {
  const copy = Object.assign({}, o);
  if (idx == last) {
    copy[keys[idx]] = v;
    return copy;
  } else {
    copy[keys[idx]] = performUpdate(o[keys[idx]], v, keys, idx+1, last);
    return copy;
  }
}

/** Given an object, a sequence of keys, and a value, deep update that value by recursively copying. Type safe. */
export const updateIn: SafeUpdate = function(o: any, ...args: any[]) {
  return performUpdate(o, args[args.length - 1], args, 0, args.length-2);
}

class Updater<O> {
  private _object: O;

  constructor(o: O) {
    this._object = o;
  }

  /** Updates a keypath to a new value. Can be chained */
  with<K1 extends keyof O>(k: K1, v: O[K1]): Updater<O>;
  with<K1 extends keyof O,
      K2 extends keyof O[K1]>(k: K1, k2: K2, v: O[K1][K2]): Updater<O>;
  with<K1 extends keyof O,
      K2 extends keyof O[K1],
      K3 extends keyof O[K1][K2]>(k: K1, k2: K2, k3: K3, v: O[K1][K2][K3]): Updater<O>;
  with<K1 extends keyof O,
      K2 extends keyof O[K1],
      K3 extends keyof O[K1][K2],
      K4 extends keyof O[K1][K2][K3]>(k: K1, k2: K2, k3: K3, k4: K4, v: O[K1][K2][K3][K4]): Updater<O>;
  with<K1 extends keyof O,
      K2 extends keyof O[K1],
      K3 extends keyof O[K1][K2],
      K4 extends keyof O[K1][K2][K3],
      K5 extends keyof O[K1][K2][K3][K4]>(k: K1, k2: K2, k3: K3, k4: K4, k5: K5, v: O[K1][K2][K3][K4][K5]): Updater<O>;
  with(...args: any[]) {
    const value = args[args.length-1];
    this._object = performUpdate(this._object, value, args, 0, args.length-2);
    return this;
  }

  /** Extract the updated value. */
  valueOf(): O {
    return this._object;
  }
}

export function update<O>(o: O): Updater<O> {
  return new Updater(o);
}