import {Prism} from './lenses';

export namespace Arrays {
  /** Returns a Prism for the specified array index */
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

  /** Like Array#splice but returns a copy */
  export function splice<T>(a: T[], i: number, del: number, ...add: T[]) {
    return [
      ...a.slice(0, i),
      ...add,
      ...a.slice(i + del, a.length)
    ]
  };

  /** Like Array#pop but returns a copy */
  export function pop<T>(a: T[]): T[] {
    return splice(a, a.length-1, 1);
  }

  /** Like Array#push but returns a copy */
  export function push<T>(a: T[], t: T) {
    return splice(a, a.length, 0, t);
  }

  /** Like Array#unshift but returns a copy */
  export function unshift<T>(a: T[], t: T) {
    return splice(a, 0, 0, t);
  }

  /** Like Array#shift but returns a copy */
  export function shift<T>(a: T[]) {
    return splice(a, 0, 1);
  }
}