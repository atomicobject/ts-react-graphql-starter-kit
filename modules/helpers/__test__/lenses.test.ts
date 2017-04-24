import { Lens, Prism } from '../lenses';

describe('Lens', () => {
  describe('an instance/.of()', () => {
    const lowBitLens = Lens.of({
      get: (n: number): 0 | 1 => (n & 1) ? 1 : 0,
      set: (n: number, b: 0 | 1) => b ? n | 1 : n & (~1)
    });

    it('can get the value with #get()', () => {
      expect(lowBitLens.get(10)).toBe(0);
      expect(lowBitLens.get(11)).toBe(1);
    });

    it('can get the value like a function', () => {
      expect(lowBitLens(10)).toBe(0);
      expect(lowBitLens(11)).toBe(1);
    });

    it('can set the value directly', () => {
      expect(lowBitLens.set(10, 0)).toBe(10);
      expect(lowBitLens.set(10, 1)).toBe(11);
      expect(lowBitLens.set(11, 0)).toBe(10);
      expect(lowBitLens.set(11, 1)).toBe(11);
    });

    it('can create a setter by just passing a value', () => {
      expect(lowBitLens.set(0)(11)).toBe(10);
      expect(lowBitLens.set(1)(10)).toBe(11);
    });

    it('can create a value updater', () => {
      const toggleBit = lowBitLens.update(b => (1 - b) ? 1 : 0);
      expect(toggleBit(15)).toBe(14);
      expect(toggleBit(92)).toBe(93);
    });

    it('can update a value', () => {
      expect(lowBitLens.update(9, b => (1 - b) ? 1 : 0)).toBe(8);
    });
  });

  describe('.from<T>().prop(...keyPath)', () => {
    it("can point to a property of an object", () => {
      let o = { foo: 1 };

      let l = Lens.from<typeof o>().prop('foo');

      // Lenses act like functions to get
      expect(l(o)).toBe(1);
      // Or explicitly get the value
      expect(l.get(o)).toBe(1);

      // Set a value into the object
      let o2 = l.set(o, 10);
      expect(o2).toEqual({ foo: 10 });
      expect(o).toEqual({ foo: 1 });

      // Or create an O => O function that updates it's argument,
      // and pass o to that. Useful with lodash.flow
      let o3 = l.set(10)(o);
      expect(o3).toEqual(o2);
    });

    it("can update deeply nested structures, type-safely", () => {
      interface O { foo: { bar: { baz: number } } }
      let o: O = { foo: { bar: { baz: 1 } } };
      let l = Lens.from<O>().prop('foo', 'bar', 'baz');
      expect(l.get(o)).toBe(1);

      let o2 = l.set(o, 10);
      expect(o2).toEqual({ foo: { bar: { baz: 10 } } });
      expect(o2).not.toBe(o);
    });
  })

  describe('comp', () => {
    it("composes together multiple lenses into a single lens", () => {
      interface Bar { bar: number; }
      let bar: Bar = { bar: 1 };
      interface Foo { foo: Bar; }
      let o: Foo = { foo: bar };
      let l1 = Lens.from<Foo>().prop('foo');
      let l2 = Lens.from<Bar>().prop('bar');

      let composed = Lens.comp(l1, l2);
      expect(composed(o)).toBe(1);
      expect(composed.get(o)).toBe(1);
      expect(composed.set(o, 10)).toEqual({
        foo: { bar: 10 }
      });
      expect(composed.set(10)(o)).toEqual({
        foo: { bar: 10 }
      });
    });
  });

  describe('map', () => {
    it("translates a lens from one type to another via Isomorphism mapping.", () => {
      interface O { bar: number };
      let o: O = { bar: 1 };
      let l = Lens.from<O>().prop('bar');
      let n2s = {
        to: (n: number) => n.toString(),
        from: (s: string) => parseInt(s, 10)
      };

      let composed = Lens.map(l, n2s);
      expect(composed(o)).toBe('1');
      expect(composed.get(o)).toBe('1');
      expect(composed.set(o, '10')).toEqual({
        bar: 10
      });
    });
  })
})

describe('Prism', () => {
  function arrayIndex<T>(n: number): Prism<T[], T> {
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
  describe('.of', () => {
    it('creates a functioning prism', () => {
      let a = ['a'];
      let index0 = arrayIndex<string>(0);
      expect(index0.get(a)).toEqual('a');

      let a2 = index0.set(a, 'b');
      expect(a2).toEqual(['b']);
      expect(a2).not.toBe(a);
      expect(a).toEqual(['a']);
    });

    it('short circuits on undefined', () => {
      let a = ['a'];
      let index1 = arrayIndex<string>(1);
      expect(index1.get(a)).toEqual(undefined);

      let a2 = index1.set(a, 'b');
      expect(a2).toEqual(['a']);
    })
  });

  describe('.comp', () => {
    it("composes lenses and prisms", () => {
      interface X { prop: number }
      let x = { prop: 1 };

      interface Outer { array: X[] }
      let outer: Outer = {
        array: [x]
      };
      let lFoo = Lens.from<Outer>().prop('array');
      let lBar = Lens.from<X>().prop('prop');

      let p0 = arrayIndex<X>(0);

      let composed = Prism.comp(lFoo, p0, lBar);
      expect(composed(outer)).toBe(1);
      expect(composed.get(outer)).toBe(1);
      expect(composed.set(outer, 10)).toEqual({
        array: [{ prop: 10 }]
      });

      const empty = { array: [] };
      expect(composed(empty)).toBeUndefined()
      expect(composed.get(empty)).toBeUndefined()
      expect(composed.set(empty, 1)).toEqual({ array: [] });
    });
  });
});