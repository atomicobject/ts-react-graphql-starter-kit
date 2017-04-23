import { updateIn } from './update-in';
import { flow } from 'lodash';

/** Core lens shape. Used to construct Lens and can be passed to higher-order functions, such as Lens.comp */
export interface ILens<T, V> {
  get(t: T): V;
  set(a: T, value: V): T
}

/** An object which can be used for getting and copy-and-updating substructure of objects. */
export interface Lens<T,V> {
  /** Gets the value from the object */
  (t:T): V;
  /** Gets the value from the object */
  get(t:T): V;

  /** Given a value, returns a function which updates its argument to that value */
  set(v:V): (t:T) => T;
  /** Given an object and a value, updates the object's referenced state to that value. */
  set(t:T, v:V): T;

  /** Given a function that operates on a value, return a function that uses it to update an object's internal value */
  update(fn: (v:V) => V): (t:T) => T;
  /** Given an object and a function that operates on it's value, return an updated object. */
  update(t:T, fn: (v:V) => V): T;
}

/** Core prism shape. Used to construct Prisms and can be passed to higher-order Prism functions, such as comp */
export interface IPrism<T, V> {
  get(t: T): V | undefined;
  set(a: T, value: V): T
}

/** An object which can be used for getting and copy-and-updating potentially-undefined substructure of objects. Like lens, but used for optional things. */
export interface Prism<T,V> {
  (t:T): V | undefined;
  get(t:T): V | undefined;

  set(v:V): (t:T) => T;
  set(t:T, v:V): T;

  update(fn: (v:V | undefined) => V | undefined): (t:T) => T;
  update(t:T, fn: (v:V | undefined) => V | undefined): T;
}

/** A mapping to/from one type to another. Used with the `map` function to create a lens that operates on one type via another. */
export type Isomorphism<T, V> = {
  to: (t: T) => V;
  from: (v: V) => T;
};

class LensFactory<O> {
  /** Creates lenses that access/update substructure via a keypath. */
  prop<K extends keyof O>(k: K): Lens<O, O[K]>;
  /** Creates lenses that access/update substructure via a keypath. */
  prop<K extends keyof O, K2 extends keyof O[K]>(k: K, k2: K2): Lens<O, O[K][K2]>;
  /** Creates lenses that access/update substructure via a keypath. */
  prop<K extends keyof O,
    K2 extends keyof O[K],
    K3 extends keyof O[K][K2]>(k: K, k2: K2, k3: K3): Lens<O, O[K][K2][K3]>;
  /** Creates lenses that access/update substructure via a keypath. */
  prop<K extends keyof O,
    K2 extends keyof O[K],
    K3 extends keyof O[K][K2],
    K4 extends keyof O[K][K2][K3]>(k: K, k2: K2, k3: K3, k4: K4): Lens<O, O[K][K2][K3][K4]>;
  prop(...ks: string[]): Lens<any, any> {
    return Lens.of({
      get(o: O) {
        return ks.reduce((x, k) => (x as any)[k], o);
      },
      set(o: O, v: any) {
        return (updateIn as any)(o, ...ks, v);
      }
    });
  }
}

/** Core module for creating and using prisms, which are get/set proxies that gracefully handle undefined. */
export namespace Prism {
  export function of<T,V>(spec: IPrism<T,V>) {
    var func = <Prism<T,V>>function (o: T) {
      return spec.get(o);
    };

    func.get = spec.get;
    (func as any).set = (tOrV: T|V, v?: V) => {
      if (v === undefined) {
        return (t:T) => spec.set(t, <V>tOrV);
      } else {
        return spec.set(<T>tOrV, v);
      }
    }

    (func as any).update = (tOrFn: T|Function, f?: Function) => {
      if (f === undefined) {
        const fn = <Function>tOrFn;
        return (t:T) => func.update(t, <any>fn);
      } else {
        const t = <T>tOrFn;
        const v = spec.get(t);
        if (v === undefined) {
          return t;
        } else {
          return spec.set(t, <V>f(v));
        }
      }
    }

    return func;
  }

  export function forArrayIndex<T>(n: number): Prism<T[], T> {
    function index(a: T[], n: number) {
      const l = a.length;
      if (l <= n) {
        return undefined;
      }
      return mod(n, l);
    }

    return Prism.of<T[], T>({
      get(a) {
        const i = index(a, n)
        return i !== undefined ? a[i] : undefined;
      },
      set(a, v) {
        const i = index(a, n);
        if (i === undefined) {
          return a;
        }
        const copy = a.slice();
        copy[i] = v;
        return copy;
      }
    });
  }

  type Prismish<T,U> = ILens<T,U> | IPrism<T,U>

  export function comp<T, U, V>(l1: Prismish<T, U>, l2: Prismish<U, V>): Prism<T, V>;
  export function comp<T, U1, U2, V>(l1: Prismish<T, U1>, l2: Prismish<U1, U2>, l3: IPrism<U2, V>): Prism<T, V>;
  export function comp<T, U1, U2, U3, V>(l1: Prismish<T, U1>, l2: Prismish<U1, U2>, l3: IPrism<U2, U3>, l4: Prismish<U3, V>): Prism<T, V>;
  export function comp<T, U1, U2, U3, U4, V>(l1: Prismish<T, U1>, l2: Prismish<U1, U2>, l3: IPrism<U2, U3>, l4: Prismish<U3, U4>, l5: Prismish<U4, V>): Prism<T, V>;
  export function comp(...prisms: Prismish<any, any>[]): Prism<any, any> {
    return Prism.of({
      get(o: any) {
        return prisms.reduce((o, l) => o && l.get(o), o);
      },
      set(o: any, v: any) {
        return performComposedSet(o, v, prisms, 0);
      }
    });
  }
}

export namespace Lens {
  /** Returns a builder which can be used to create a lens that updates a simple object value or nested value */
  export function from<T>() {
    return new LensFactory<T>();
  }

  /** Creates a Lens from a simple get/set specification. */
  export function of<T,V>(spec: ILens<T,V>) {
    return (Prism.of as any)(spec);
  }

  /** Given a lens and a way to map that lens type to/from another (an isomorphism), returns a lens that can operate on the other type. */
  export function map<T, U, V>(l: ILens<T, U>, f: Isomorphism<U, V>): Lens<T, V> {
    return Lens.of({
      get: flow(l.get, f.to),
      set(o, v) {
        return l.set(o, f.from(v));
      }
    });
  }

  /** Compose together lenses for updating nested structures. */
  export function comp<T, U, V>(l1: ILens<T, U>, l2: ILens<U, V>): Lens<T, V>;
  export function comp<T, U1, U2, V>(l1: ILens<T, U1>, l2: ILens<U1, U2>, l3: ILens<U2, V>): Lens<T, V>;
  export function comp<T, U1, U2, U3, V>(l1: ILens<T, U1>, l2: ILens<U1, U2>, l3: ILens<U2, U3>, l4: ILens<U3, V>): Lens<T, V>;
  export function comp<T, U1, U2, U3, U4, V>(l1: ILens<T, U1>, l2: ILens<U1, U2>, l3: ILens<U2, U3>, l4: ILens<U3, U4>, l5: ILens<U4, V>): Lens<T, V>;
  export function comp(...lenses: ILens<any, any>[]): Lens<any, any> {
    return Lens.of({
      get(o: any) {
        return lenses.reduce((o, l) => l.get(o), o);
      },
      set(o: any, v: any) {
        return performComposedSet(o, v, lenses, 0);
      }
    });
  }
}

function performComposedSet(o: any, v: any, lenses: ILens<any, any>[], index: number): any {
  if (index == lenses.length - 1) {
    return lenses[index].set(o, v);
  } else {
    const inner = lenses[index].get(o);
    if (inner) {
      return lenses[index].set(o, performComposedSet(inner, v, lenses, index + 1));
    } else {
      return o;
    }
  }
}

function mod(n: number, l: number): number {
  let i = n % l;
  if (i < 0) {
    i += l;
  }
  return i;
}