import {Prism} from './lenses';

export namespace Arrays {
  export function index<T>(n: number): Prism<T[], T> {
    function index(a: T[], n: number) {
      if (n < 0 || n >= a.length) {
        return undefined;
      }
      return n;
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

  export function splice<T>(a:T[], i: number, del: number, ...add: T[]) {
    return [
      ...a.slice(0, i),
      ...add,
      ...a.slice(i + (del||0), a.length)
    ]
  };

  export function pop<T>(a: T[]): T[] {
    return splice(a, a.length-1, 1);
  }

  export function push<T>(a: T[], t: T) {
    return splice(a, a.length, 0, t);
  }

  export function unshift<T>(a: T[], t: T) {
    return splice(a, 0, 0, t);
  }
}