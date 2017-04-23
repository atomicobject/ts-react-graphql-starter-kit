import { updateIn } from './update-in';
import { flow } from 'lodash';

export interface Lens<T, V> {
  get(t: T): V;
  set(a: T, value: V): T
}

export interface Prism<T, V> {
  get(t: T): V | undefined;
  set(a: T, value: V): T
}

export type Isomorphism<T, V> = {
  to: (t: T) => V;
  from: (v: V) => T;
};

export namespace Lens {
  export function from<T>() {
    return new LensFactory<T>();
  }

  export function map<T, U, V>(l: Lens<T, U>, f: Isomorphism<U, V>): Lens<T, V> {
    return {
      get: flow(l.get, f.to),
      set(o, v) {
        return l.set(o, f.from(v));
      }
    };
  }

  export function comp<T, U, V>(l1: Lens<T, U>, l2: Lens<U, V>): Lens<T, V>;
  export function comp<T, U1, U2, V>(l1: Lens<T, U1>, l2: Lens<U1, U2>, l3: Lens<U2, V>): Lens<T, V>;
  export function comp<T, U1, U2, U3, V>(l1: Lens<T, U1>, l2: Lens<U1, U2>, l3: Lens<U2, U3>, l4: Lens<U3, V>): Lens<T, V>;
  export function comp<T, U1, U2, U3, U4, V>(l1: Lens<T, U1>, l2: Lens<U1, U2>, l3: Lens<U2, U3>, l4: Lens<U3, U4>, l5: Lens<U4, V>): Lens<T, V>;
  export function comp(...lenses: Lens<any, any>[]): Lens<any, any> {
    return {
      get(o: any) {
        return lenses.reduce((o, l) => l.get(o), o);
      },
      set(o: any, v: any) {
        return performComposedSet(o, v, lenses, 0);
      }
    }
  }
}

class LensFactory<O> {
  prop<K extends keyof O>(k: K): Lens<O, O[K]>;
  prop<K extends keyof O, K2 extends keyof O[K]>(k: K, k2: K2): Lens<O, O[K][K2]>;
  prop<K extends keyof O,
    K2 extends keyof O[K],
    K3 extends keyof O[K][K2]>(k: K, k2: K2, k3: K3): Lens<O, O[K][K2][K3]>;
  prop<K extends keyof O,
    K2 extends keyof O[K],
    K3 extends keyof O[K][K2],
    K4 extends keyof O[K][K2][K3]>(k: K, k2: K2, k3: K3, k4: K4): Lens<O, O[K][K2][K3][K4]>;
  prop(...ks: string[]): Lens<any, any> {
    return {
      get(o: O) {
        return ks.reduce((x, k) => (x as any)[k], o);
      },
      set(o: O, v: any) {
        return (updateIn as any)(o, ...ks, v);
      }
    };
  }
}

export namespace Prism {
  export function forArrayIndex<T>(n: number): Prism<T[], T> {
    function index(a: T[], n: number) {
      const l = a.length;
      if (l <= n) {
        return undefined;
      }
      return mod(n, l);
    }

    return {
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
    }
  }

  type Prismish<T,U> = Lens<T,U> | Prism<T,U>

  export function comp<T, U, V>(l1: Prismish<T, U>, l2: Prismish<U, V>): Prism<T, V>;
  export function comp<T, U1, U2, V>(l1: Prismish<T, U1>, l2: Prismish<U1, U2>, l3: Prism<U2, V>): Prismish<T, V>;
  export function comp<T, U1, U2, U3, V>(l1: Prismish<T, U1>, l2: Prismish<U1, U2>, l3: Prism<U2, U3>, l4: Prismish<U3, V>): Prismish<T, V>;
  export function comp<T, U1, U2, U3, U4, V>(l1: Prismish<T, U1>, l2: Prismish<U1, U2>, l3: Prism<U2, U3>, l4: Prismish<U3, U4>, l5: Prismish<U4, V>): Prismish<T, V>;
  export function comp(...prisms: Prismish<any, any>[]): Prism<any, any> {
    return {
      get(o: any) {
        return prisms.reduce((o, l) => o && l.get(o), o);
      },
      set(o: any, v: any) {
        return performComposedSet(o, v, prisms, 0);
      }
    }
  }
}

function performComposedSet(o: any, v: any, lenses: Lens<any, any>[], index: number): any {
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